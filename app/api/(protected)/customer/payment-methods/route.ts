// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    ModelIdSchema,
    
    type Pagination,
    PaginationArgSchema,
    
    type PaymentMethodProvider,
    type PaymentMethodDetail,
    paymentMethodDetailSelect,
    PaymentMethodUpdateRequestSchema,
    PaymentMethodProviderSchema,
    SetupPaymentRequestSchema,
    type PaymentMethodSetupDetail,
    type PaymentMethodCaptureDetail,
    paymentMethodLimitMax,
    
    
    
    // utilities:
    convertPaymentMethodDetailDataToPaymentMethodDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'

// internals:
import {
    // utilities:
    paypalCreateSetupPayment,
    paypalCapturePaymentMethod,
    paypalListPaymentMethods,
    paypalDeletePaymentMethod,
}                           from '@/libs/payments/processors/paypal'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';

const limitMaxPaymentMethodList = paymentMethodLimitMax * 2;



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<Request, RequestContext>();
const handler = async (req: Request, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paginationArg : {
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region query result
    try {
        const [customerIds, total, paged] = await prisma.$transaction([
            //#region find existing providerCustomerId
            prisma.customer.findUnique({
                where  : {
                    id : customerId, // important: the signedIn customerId
                },
                select : {
                    paypalCustomerId   : true,
                    stripeCustomerId   : true,
                    midtransCustomerId : true,
                },
            }),
            //#endregion find existing providerCustomerId
            
            prisma.paymentMethod.count({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                },
            }),
            prisma.paymentMethod.findMany({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                },
                select : paymentMethodDetailSelect,
                orderBy : {
                    sort: 'desc',
                },
                skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
                take    : perPage,
            }),
        ]);
        if (!customerIds) return Response.json({
            total    : 0,
            entities : [],
        } satisfies Pagination<PaymentMethodDetail>);
        
        
        
        //#region query api
        //#region find existing providerCustomerId
        const {
            paypalCustomerId,
            // stripeCustomerId,
            // midtransCustomerId,
        } = customerIds;
        //#endregion find existing providerCustomerId
        
        const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
            ...((paypalCustomerId && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList) : []),
        ]);
        //#endregion query api
        
        
        
        const paginationPaymentMethodDetail : Pagination<PaymentMethodDetail> = {
            total    : total,
            entities : (
                paged
                .map((item) => convertPaymentMethodDetailDataToPaymentMethodDetail(item, total, resolver))
                .filter((item): item is Exclude<typeof item, null> => (item !== null))
            ) satisfies PaymentMethodDetail[],
        };
        return Response.json(paginationPaymentMethodDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'unexpected error' }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
})
.patch(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                arg : PaymentMethodUpdateRequestSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        arg: {
            // records:
            id,
            vaultToken,
            currency,
        },
    } = requestData;
    const paymentData = ((): [PaymentMethodProvider, string]|null => {
        if (vaultToken.startsWith('#PAYPAL_')) {
            return [
                'PAYPAL',
                vaultToken.slice(8), // remove prefix #PAYPAL_
            ];
        }
        else if (vaultToken.startsWith('#STRIPE_')) {
            return [
                'STRIPE',
                vaultToken.slice(8), // remove prefix #STRIPE_
            ];
        }
        else if (vaultToken.startsWith('#MIDTRANS_')) {
            return [
                'MIDTRANS',
                vaultToken.slice(10), // remove prefix #MIDTRANS_
            ];
        }
        else {
            return null;
        } // if
    })();
    if (!paymentData) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const [
        provider,
        providerVaultToken,
    ] = paymentData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        //#region process the vault token
        const paymentMethodCapture = await (async (): Promise<PaymentMethodCaptureDetail|null> => {
            switch (provider) {
                case 'PAYPAL': return checkoutConfigServer.payment.processors.paypal.enabled ? paypalCapturePaymentMethod(providerVaultToken) : null;
                default      : return null;
            } // switch
        })();
        if (!paymentMethodCapture) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        const {
            providerPaymentMethodId,
            providerCustomerId,
        } = paymentMethodCapture;
        //#endregion process the vault token
        
        
        
        if (id) { // updating only
            //#region delete prev payment token
            const existingPaymentMethod = await prisma.paymentMethod.findUnique({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    id       : id,
                },
                select : {
                    provider                : true,
                    providerPaymentMethodId : true,
                },
            });
            if (existingPaymentMethod) {
                const {
                    provider                : existingProvider,
                    providerPaymentMethodId : existingProviderPaymentMethodId,
                } = existingPaymentMethod;
                
                
                
                if ((existingProvider !== provider) || (existingProviderPaymentMethodId !== providerPaymentMethodId)) {
                    //#region process the vault token
                    switch (existingProvider) {
                        case 'PAYPAL': checkoutConfigServer.payment.processors.paypal.enabled && await paypalDeletePaymentMethod(existingProviderPaymentMethodId);
                    } // switch
                    //#endregion process the vault token
                } // if
            } // if
            //#endregion delete prev payment token
        } // if
        
        
        
        const [paymentMethodData, paymentMethodCount] = await prisma.$transaction(async (prismaTransaction): Promise<[Parameters<typeof convertPaymentMethodDetailDataToPaymentMethodDetail>[0] | false, number]> => {
            const [maxSort, paymentMethodCount] = await Promise.all([
                prismaTransaction.paymentMethod.findFirst({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                    },
                    select  : {
                        sort : true,
                    },
                    orderBy : {
                        sort: 'desc',
                    },
                }),
                
                prismaTransaction.paymentMethod.count({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                    },
                }),
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
                        
                        sort                    : (maxSort?.sort ?? -1) + 1,
                        
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
            
            
            
            return [paymentMethodData, paymentMethodCount + (!id ? 1 /* creating */ : 0 /* updating */)];
        });
        if (!paymentMethodData) {
            return Response.json({
                error: 'Max payment method count has been reached.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        for (let attempts = 10; attempts > 0; attempts--) {
            const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
                ...(((provider === 'PAYPAL') && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(providerCustomerId, limitMaxPaymentMethodList) : []),
            ]);
            const paymentMethod : PaymentMethodDetail|null = convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodData, paymentMethodCount, resolver);
            if (paymentMethod) {
                await deleteNonRelatedAccounts(customerId);
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
        
        
        
        await deleteNonRelatedAccounts(customerId);
        return Response.json({ error: 'Unexpected error' }, { status: 500 }); // handled with error: unauthorized
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.delete(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                id : ModelIdSchema.parse(data?.id),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        id,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        //#region find existing paymentMethod
        const existingPaymentMethod = await prisma.paymentMethod.findUnique({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                id       : id,
            },
            select : {
                provider                : true,
                providerPaymentMethodId : true,
            },
        });
        if (!existingPaymentMethod) {
            return Response.json({
                id : id,
            } satisfies Pick<PaymentMethodDetail, 'id'>); // handled with success
        } // if
        const {
            provider,
            providerPaymentMethodId,
        } = existingPaymentMethod;
        //#endregion find existing paymentMethod
        
        
        
        //#region process the vault token
        switch (provider) {
            case 'PAYPAL': checkoutConfigServer.payment.processors.paypal.enabled && await paypalDeletePaymentMethod(providerPaymentMethodId);
        } // switch
        //#endregion process the vault token
        
        
        
        const deletedPaymentMethod : Pick<PaymentMethodDetail, 'id'> = (
            await prisma.paymentMethod.delete({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    id       : id,
                },
                select : {
                    id       : true,
                },
            })
        );
        
        
        
        await deleteNonRelatedAccounts(customerId);
        return Response.json(deletedPaymentMethod); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});



const deleteNonRelatedAccounts = async (customerId: string): Promise<void> => {
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
            // TODO: api for stripe
            // TODO: api for midtrans
        ]);
    }
    catch (error: any) {
        console.log(error);
        // ignore any error
    } // try
};
