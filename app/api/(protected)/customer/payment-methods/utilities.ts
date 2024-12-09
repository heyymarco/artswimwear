// models:
import {
    type PaymentMethodProvider,
    type PaymentMethodDetail,
    type PaymentMethodUpdateRequest,
    paymentMethodDetailSelect,
    type PaymentMethodCapture,
    paymentMethodLimitMax,
    
    
    
    // utilities:
    convertPaymentMethodDetailDataToPaymentMethodDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // utilities:
    paypalListPaymentMethods,
    paypalDeletePaymentMethod,
}                           from '@/libs/payments/processors/paypal'
import {
    // utilities:
    stripeListPaymentMethods,
    stripeDeletePaymentMethod,
}                           from '@/libs/payments/processors/stripe'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const limitMaxPaymentMethodList = paymentMethodLimitMax * 2;



// utilities:
export const createOrUpdatePaymentMethod = async (createOrUpdatedata: Omit<PaymentMethodUpdateRequest, 'vaultToken'>, customerId: string, provider: PaymentMethodProvider, paymentMethodCapture: PaymentMethodCapture): Promise<Response> => {
    const {
        // records:
        id,
        currency,
    } = createOrUpdatedata;
    
    const {
        providerPaymentMethodId,
        providerCustomerId,
    } = paymentMethodCapture;
    
    
    
    //#region save changes
    try {
        const [paymentMethodData, paymentMethodCount] = await prisma.$transaction(async (prismaTransaction): Promise<[Parameters<typeof convertPaymentMethodDetailDataToPaymentMethodDetail>[0] | false, number]> => {
            const [paymentMethodCount, prevPaymentMethod] = await Promise.all([
                prismaTransaction.paymentMethod.count({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                    },
                }),
                
                id /* updating only */ ? prisma.paymentMethod.findUnique({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                        id       : id,
                    },
                    select : {
                        provider                : true,
                        providerPaymentMethodId : true,
                    },
                }) : undefined
            ]);
            if (!id) { // creating only
                //#region limits max payment method count
                if (paymentMethodCount >= paymentMethodLimitMax) {
                    return [false, paymentMethodCount];
                } // if
                //#endregion limits max payment method count
            } // if
            
            
            
            //#region update the db
            const paymentMethodData = (
                !id
                ? await prismaTransaction.paymentMethod.create({
                    data   : {
                        parentId                : customerId, // important: the signedIn customerId
                        
                        sort                    : paymentMethodCount,
                        
                        provider                : provider,
                        providerPaymentMethodId : providerPaymentMethodId,
                        
                        currency                : currency,
                    },
                    select : paymentMethodDetailSelect,
                })
                : await prismaTransaction.paymentMethod.update({
                    where  : {
                        id                      : id,
                        parentId                : customerId, // important: the signedIn customerId
                    },
                    data   : {
                        provider                : provider,
                        providerPaymentMethodId : providerPaymentMethodId,
                        
                        currency                : currency,
                    },
                    select : paymentMethodDetailSelect,
                })
            );
            //#endregion update the db
            
            
            
            // after successfully updated => delete prev payment token account (if any):
            if (prevPaymentMethod) {
                const {
                    provider                : existingProvider,
                    providerPaymentMethodId : existingProviderPaymentMethodId,
                } = prevPaymentMethod;
                
                
                
                if ((existingProvider !== provider) || (existingProviderPaymentMethodId !== providerPaymentMethodId)) {
                    await deletePaymentMethodAccount(existingProvider, existingProviderPaymentMethodId);
                } // if
            } // if
            
            
            
            return [paymentMethodData, paymentMethodCount + (!id ? 1 /* creating */ : 0 /* updating */)];
        }, { timeout: 15000 }); // give a longer timeout for creating_db|updating_db and `deletePaymentMethodAccount` // may up to 15 secs
        if (!paymentMethodData) {
            return Response.json({
                error: 'Max payment method count has been reached.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        for (let attempts = 10; attempts > 0; attempts--) {
            const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
                ...(((provider === 'PAYPAL') && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(providerCustomerId, limitMaxPaymentMethodList) : []),
                ...(((provider === 'STRIPE') && checkoutConfigServer.payment.processors.stripe.enabled) ? await stripeListPaymentMethods(providerCustomerId, limitMaxPaymentMethodList) : []),
            ]);
            const paymentMethod : PaymentMethodDetail|null = convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodData, paymentMethodCount, resolver);
            if (paymentMethod) {
                await deleteNonRelatedAccounts(customerId); // never thrown
                return Response.json(paymentMethod); // handled with success
            } // if
            
            
            
            if (attempts > 0) {
                // wait for 1 sec before running the next attempts:
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            } // if
        } // for
        
        
        
        await deleteNonRelatedAccounts(customerId); // never thrown
        return Response.json({ error: 'Unexpected error' }, { status: 500 }); // handled with error: unauthorized
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
};
export const deletePaymentMethodAccount  = async (provider: PaymentMethodProvider, providerPaymentMethodId: string): Promise<boolean> => {
    try {
        switch (provider) {
            case 'PAYPAL': checkoutConfigServer.payment.processors.paypal.enabled && await paypalDeletePaymentMethod(providerPaymentMethodId);
            case 'STRIPE': checkoutConfigServer.payment.processors.stripe.enabled && await stripeDeletePaymentMethod(providerPaymentMethodId);
        } // switch
        return true; // succeeded
    }
    catch {
        return false; // failed
    } // try
    //#region process the vault token
    //#endregion process the vault token
};
export const deleteNonRelatedAccounts    = async (customerId: string): Promise<void> => {
    try {
        //#region find existing providerCustomerId
        const providerCustomerIds = await prisma.customer.findUnique({
            where  : {
                id : customerId, // important: the signedIn customerId
            },
            select : {
                paypalCustomerId   : true,
                stripeCustomerId   : true,
                midtransCustomerId : true,
                
                // relations:
                paymentMethods : {
                    select : {
                        id                      : true,
                        provider                : true,
                        providerPaymentMethodId : true,
                    },
                },
            },
        });
        if (!providerCustomerIds) return;
        const {
            paypalCustomerId,
            stripeCustomerId,
            midtransCustomerId,
        } = providerCustomerIds;
        //#endregion find existing providerCustomerId
        
        
        
        await Promise.allSettled([
            checkoutConfigServer.payment.processors.paypal.enabled && paypalCustomerId && (async (): Promise<void> => {
                const allInternalPaymentMethods       = providerCustomerIds.paymentMethods.filter(({provider}) => (provider === 'PAYPAL')).map(({id, providerPaymentMethodId}) => ({id, providerPaymentMethodId}));
                const allExternalPaymentMethods       = Array.from((await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList)).keys()).map((item) => item.startsWith('PAYPAL/') ? item.slice(7) : item); // remove prefix `PAYPAL/`
                const excessInternalPaymentMethodIds  = allInternalPaymentMethods.filter(({providerPaymentMethodId: item}) => !allExternalPaymentMethods.includes(item)).map(({id}) => id);
                const excessExternalPaymentMethodsIds = allExternalPaymentMethods.filter((item) => !allInternalPaymentMethods.map(({providerPaymentMethodId}) => providerPaymentMethodId).includes(item));
                
                await Promise.allSettled([
                    excessInternalPaymentMethodIds.length && prisma.paymentMethod.deleteMany({
                        where  : {
                            parentId : customerId, // important: the signedIn customerId
                            provider : 'PAYPAL',
                            id       : { in: excessInternalPaymentMethodIds },
                        },
                    }),
                    
                    ...
                    excessExternalPaymentMethodsIds
                    .map((excessExternalPaymentMethodsId) =>
                        paypalDeletePaymentMethod(excessExternalPaymentMethodsId)
                    ),
                ]);
            })(),
            
            checkoutConfigServer.payment.processors.stripe.enabled && stripeCustomerId && (async (): Promise<void> => {
                const allInternalPaymentMethods       = providerCustomerIds.paymentMethods.filter(({provider}) => (provider === 'STRIPE')).map(({id, providerPaymentMethodId}) => ({id, providerPaymentMethodId}));
                const allExternalPaymentMethods       = Array.from((await stripeListPaymentMethods(stripeCustomerId, limitMaxPaymentMethodList)).keys()).map((item) => item.startsWith('STRIPE/') ? item.slice(7) : item); // remove prefix `STRIPE/`
                const excessInternalPaymentMethodIds  = allInternalPaymentMethods.filter(({providerPaymentMethodId: item}) => !allExternalPaymentMethods.includes(item)).map(({id}) => id);
                const excessExternalPaymentMethodsIds = allExternalPaymentMethods.filter((item) => !allInternalPaymentMethods.map(({providerPaymentMethodId}) => providerPaymentMethodId).includes(item));
                
                await Promise.allSettled([
                    excessInternalPaymentMethodIds.length && prisma.paymentMethod.deleteMany({
                        where  : {
                            parentId : customerId, // important: the signedIn customerId
                            provider : 'STRIPE',
                            id       : { in: excessInternalPaymentMethodIds },
                        },
                    }),
                    
                    ...
                    excessExternalPaymentMethodsIds
                    .map((excessExternalPaymentMethodsId) =>
                        stripeDeletePaymentMethod(excessExternalPaymentMethodsId)
                    ),
                ]);
            })(),
            
            // TODO: api for midtrans
        ]);
    }
    catch (error: any) {
        console.log(error);
        // ignore any error
    } // try
};
