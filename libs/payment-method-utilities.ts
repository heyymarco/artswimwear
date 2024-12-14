// models:
import {
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
    type prisma,
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
export const createOrUpdatePaymentMethod = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createOrUpdatedata: Omit<PaymentMethodUpdateRequest, 'vaultToken'>, customerId: string, paymentMethodCapture: PaymentMethodCapture, detailedPaymentMethodCapture = true): Promise<Response> => {
    const {
        // records:
        id,
        currency,
    } = createOrUpdatedata;
    
    const {
        paymentMethodProvider,
        paymentMethodProviderId,
        paymentMethodProviderCustomerId,
    } = paymentMethodCapture;
    
    
    
    //#region save changes
    try {
        const [paymentMethodData, paymentMethodCount] = await (async (): Promise<[Parameters<typeof convertPaymentMethodDetailDataToPaymentMethodDetail>[0] | false, number]> => {
            const [paymentMethodCount, prevPaymentMethod] = await Promise.all([
                prismaTransaction.paymentMethod.count({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                    },
                }),
                
                id /* updating only */ ? prismaTransaction.paymentMethod.findUnique({
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
                        
                        provider                : paymentMethodProvider,
                        providerPaymentMethodId : paymentMethodProviderId,
                        
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
                        provider                : paymentMethodProvider,
                        providerPaymentMethodId : paymentMethodProviderId,
                        
                        currency                : currency,
                    },
                    select : paymentMethodDetailSelect,
                })
            );
            //#endregion update the db
            
            
            
            // after successfully updated => delete prev payment token account (if any):
            if (prevPaymentMethod) {
                const {
                    provider                : existingPaymentMethodProvider,
                    providerPaymentMethodId : existingPaymentMethodProviderId,
                } = prevPaymentMethod;
                
                
                
                if ((existingPaymentMethodProvider !== paymentMethodProvider) || (existingPaymentMethodProviderId !== paymentMethodProviderId)) {
                    await deletePaymentMethodAccount({
                        paymentMethodProvider   : existingPaymentMethodProvider,
                        paymentMethodProviderId : existingPaymentMethodProviderId,
                    });
                } // if
            } // if
            
            
            
            return [paymentMethodData, paymentMethodCount + (!id ? 1 /* creating */ : 0 /* updating */)];
        })();
        if (!paymentMethodData) {
            return Response.json({
                error: 'Max payment method count has been reached.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        if (detailedPaymentMethodCapture) {
            for (let attempts = 15; attempts > 0; attempts--) {
                const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
                    ...(((paymentMethodProvider === 'PAYPAL') && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(paymentMethodProviderCustomerId, limitMaxPaymentMethodList) : []),
                    ...(((paymentMethodProvider === 'STRIPE') && checkoutConfigServer.payment.processors.stripe.enabled) ? await stripeListPaymentMethods(paymentMethodProviderCustomerId, limitMaxPaymentMethodList) : []),
                ]);
                const paymentMethod : PaymentMethodDetail|null = convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodData, paymentMethodCount, resolver);
                if (paymentMethod) {
                    const {
                        shifted : shiftedPaymentMethods,
                    } = await deleteNonRelatedAccounts(prismaTransaction, customerId);
                    const repriorityPaymentMethods = new Map<string, number>(shiftedPaymentMethods); // never thrown
                    const modifiedPriority = repriorityPaymentMethods.get(paymentMethod.id);
                    if (modifiedPriority !== undefined) paymentMethod.priority = modifiedPriority;
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
        } // if
        
        
        
        const paymentMethod : PaymentMethodDetail = convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodData, paymentMethodCount, null);
        
        const {
            shifted : shiftedPaymentMethods,
        } = await deleteNonRelatedAccounts(prismaTransaction, customerId);
        const repriorityPaymentMethods = detailedPaymentMethodCapture ? new Map<string, number>(shiftedPaymentMethods) : null; // never thrown
        const modifiedPriority = repriorityPaymentMethods?.get(paymentMethod.id);
        if (modifiedPriority !== undefined) paymentMethod.priority = modifiedPriority;
        
        return Response.json(paymentMethod); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
};
export const deletePaymentMethodAccount  = async (paymentMethodCapture: Pick<PaymentMethodCapture, 'paymentMethodProvider'|'paymentMethodProviderId'>): Promise<boolean> => {
    const {
        paymentMethodProvider,
        paymentMethodProviderId,
    } = paymentMethodCapture;
    
    
    
    try {
        switch (paymentMethodProvider) {
            case 'PAYPAL': checkoutConfigServer.payment.processors.paypal.enabled && await paypalDeletePaymentMethod(paymentMethodProviderId);
            case 'STRIPE': checkoutConfigServer.payment.processors.stripe.enabled && await stripeDeletePaymentMethod(paymentMethodProviderId);
        } // switch
        return true; // succeeded
    }
    catch {
        return false; // failed
    } // try
    //#region process the vault token
    //#endregion process the vault token
};
export const deleteNonRelatedAccounts    = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], customerId: string): Promise<AffectedPaymentMethods> => {
    try {
        //#region find existing paymentMethodProviderCustomerId
        const paymentMethodProviderCustomerIds = await prismaTransaction.customer.findUnique({
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
        if (!paymentMethodProviderCustomerIds) return { deleted: [], shifted: [] } satisfies AffectedPaymentMethods;
        const {
            paypalCustomerId,
            stripeCustomerId,
            midtransCustomerId,
        } = paymentMethodProviderCustomerIds;
        //#endregion find existing paymentMethodProviderCustomerId
        
        
        
        const mergedExcessInternalPaymentMethodIds : string[] = [];
        const mergedExcessExternalPaymentMethodsIdsDeletedPromises : Promise<void>[] = [];
        await Promise.allSettled([
            // delete api for paypal:
            checkoutConfigServer.payment.processors.paypal.enabled && paypalCustomerId && (async (): Promise<void> => {
                const allInternalPaymentMethods       = paymentMethodProviderCustomerIds.paymentMethods.filter(({provider}) => (provider === 'PAYPAL')).map(({id, providerPaymentMethodId}) => ({id, providerPaymentMethodId}));
                const allExternalPaymentMethods       = Array.from((await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList)).keys()).map((item) => item.startsWith('PAYPAL/') ? item.slice(7) : item); // remove prefix `PAYPAL/`
                const excessInternalPaymentMethodIds  = allInternalPaymentMethods.filter(({providerPaymentMethodId: item}) => !allExternalPaymentMethods.includes(item)).map(({id}) => id);
                const excessExternalPaymentMethodsIds = allExternalPaymentMethods.filter((item) => !allInternalPaymentMethods.map(({providerPaymentMethodId}) => providerPaymentMethodId).includes(item));
                
                mergedExcessInternalPaymentMethodIds.push(
                    ...excessInternalPaymentMethodIds
                );
                mergedExcessExternalPaymentMethodsIdsDeletedPromises.push(
                    ...
                    excessExternalPaymentMethodsIds
                    .map((excessExternalPaymentMethodsId) =>
                        paypalDeletePaymentMethod(excessExternalPaymentMethodsId)
                    ),
                );
            })(),
            
            
            
            // delete api for stripe:
            checkoutConfigServer.payment.processors.stripe.enabled && stripeCustomerId && (async (): Promise<void> => {
                const allInternalPaymentMethods       = paymentMethodProviderCustomerIds.paymentMethods.filter(({provider}) => (provider === 'STRIPE')).map(({id, providerPaymentMethodId}) => ({id, providerPaymentMethodId}));
                const allExternalPaymentMethods       = Array.from((await stripeListPaymentMethods(stripeCustomerId, limitMaxPaymentMethodList)).keys()).map((item) => item.startsWith('STRIPE/') ? item.slice(7) : item); // remove prefix `STRIPE/`
                const excessInternalPaymentMethodIds  = allInternalPaymentMethods.filter(({providerPaymentMethodId: item}) => !allExternalPaymentMethods.includes(item)).map(({id}) => id);
                const excessExternalPaymentMethodsIds = allExternalPaymentMethods.filter((item) => !allInternalPaymentMethods.map(({providerPaymentMethodId}) => providerPaymentMethodId).includes(item));
                
                mergedExcessInternalPaymentMethodIds.push(
                    ...excessInternalPaymentMethodIds
                );
                mergedExcessExternalPaymentMethodsIdsDeletedPromises.push(
                    ...
                    excessExternalPaymentMethodsIds
                    .map((excessExternalPaymentMethodsId) =>
                        stripeDeletePaymentMethod(excessExternalPaymentMethodsId)
                    ),
                );
            })(),
            
            
            
            // TODO: delete api for midtrans
        ]);
        
        
        
        // after successfully deleted of the api above => decrease the sibling's sort that are greater than deleted_paymentMethod's sort:
        const [affectedPaymentMethods] = await Promise.all([
            // decrease the sibling's sort that are greater than deleted_paymentMethod's sort:
            deletePaymentMethod(prismaTransaction, customerId, mergedExcessInternalPaymentMethodIds),
            
            
            
            // also wait for all api delete done:
            Promise.allSettled(mergedExcessExternalPaymentMethodsIdsDeletedPromises),
        ]);
        
        
        
        // report the re-sorted PaymentMethods:
        return affectedPaymentMethods;
    }
    catch (error: any) {
        console.log(error);
        // ignore any error
        
        
        
        // assumes nothing was modified (sql transaction should be failed):
        return { deleted: [], shifted: [] } satisfies AffectedPaymentMethods;
    } // try
};



export interface AffectedPaymentMethods {
    deleted : string[]
    shifted : [string, number][]
}
export const deletePaymentMethod         = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], customerId: string, paymentMethodIdsToDelete: string[]): Promise<AffectedPaymentMethods> => {
    // conditions:
    paymentMethodIdsToDelete = Array.from(new Set<string>(paymentMethodIdsToDelete)); // ensure each id is unique
    if (!paymentMethodIdsToDelete.length) return { deleted: [], shifted: [] } satisfies AffectedPaymentMethods;
    
    
    
    const deletedDesc = await prismaTransaction.paymentMethod.findMany({
        where  : {
            parentId : customerId, // important: the signedIn customerId
            id       : { in: paymentMethodIdsToDelete },
        },
        select : {
            id       : true,
            sort     : true,
        },
        orderBy : {
            sort: 'desc',
        },
    });
    const deletedSortsDesc = deletedDesc.map(({sort}) => sort);
    const deletedPaymentMethodPromise = prismaTransaction.paymentMethod.deleteMany({
        where  : {
            parentId : customerId, // important: the signedIn customerId
            id       : { in: paymentMethodIdsToDelete },
        },
    });
    if (!deletedSortsDesc.length) return { deleted: [], shifted: [] } satisfies AffectedPaymentMethods;
    const minDeletedSort = deletedSortsDesc[deletedSortsDesc.length - 1];
    
    
    
    const siblingSortsAsc = await prismaTransaction.paymentMethod.findMany({
        where  : {
            parentId : customerId, // important: the signedIn customerId
            id       : { notIn: paymentMethodIdsToDelete },
            sort     : { gt: minDeletedSort },
        },
        select : {
            id       : true,
            sort     : true,
        },
        orderBy : {
            sort: 'asc',
        },
    });
    for (const deletedSort of deletedSortsDesc) {
        const startIndex = siblingSortsAsc.findIndex(({sort}) => (sort > deletedSort));
        if (startIndex < 0) continue; // not found => skip to next
        
        
        
        for (let index = startIndex; index < siblingSortsAsc.length; index++) {
            siblingSortsAsc[index].sort--; // decrement by 1
        } // for
    } // for
    
    
    
    await Promise.all([
        deletedPaymentMethodPromise,
        
        
        
        ...
        siblingSortsAsc
        .map(({id, sort}) =>
            prismaTransaction.paymentMethod.update({
                where  : {
                    id : id,
                },
                data   : {
                    sort: sort,
                },
            })
        )
    ]);
    
    
    
    // report the re-sorted PaymentMethods:
    return {
        deleted : deletedDesc.toReversed().map(({id}) => id),
        shifted : (
            siblingSortsAsc
            .map(({id}, index, array) => [
                id,
                array.length - index - 1, // zero_based priority
            ])
        ),
    } satisfies AffectedPaymentMethods;
};
