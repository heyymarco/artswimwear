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
    type PaymentMethodCapture,
    type AffectedPaymentMethods,
    PaymentMethodOfCurrencyRequestSchema,
    
    
    
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
    paypalCapturePaymentMethod,
    paypalListPaymentMethods,
}                           from '@/libs/payments/processors/paypal'
import {
    // utilities:
    stripeCapturePaymentMethod,
    stripeListPaymentMethods,
}                           from '@/libs/payments/processors/stripe'
import {
    limitMaxPaymentMethodList,
    createOrUpdatePaymentMethod,
    deletePaymentMethodAccount,
    deleteNonRelatedAccounts,
    deletePaymentMethod,
}                           from '@/libs/payment-method-utilities'

// configs:
import {
    paypalPaymentMethodEnabledOfAnyMethod,
    stripePaymentMethodEnabledOfAnyMethod,
}                           from '@/libs/payment-method-enabled'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 20; // this function can run for a maximum of 20 seconds for many & complex transactions



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
.get(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                arg : PaymentMethodOfCurrencyRequestSchema.parse(data),
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
        arg : {
            currency,
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
        const [customerIds, compatiblePaymentMethodData] = await prisma.$transaction([
            //#region find existing paymentMethodProviderCustomerId
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
            //#endregion find existing paymentMethodProviderCustomerId
            
            prisma.paymentMethod.findMany({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    currency : currency,
                },
                select : paymentMethodDetailSelect,
                orderBy : {
                    sort: 'desc',
                },
            }),
        ]);
        if (!customerIds) return Response.json([] satisfies PaymentMethodDetail[]);
        
        
        
        //#region query api
        //#region find existing paymentMethodProviderCustomerId
        const {
            paypalCustomerId,
            stripeCustomerId,
            // midtransCustomerId,
        } = customerIds;
        //#endregion find existing paymentMethodProviderCustomerId
        
        const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
            ...((paypalCustomerId && paypalPaymentMethodEnabledOfAnyMethod) ? await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList) : []),
            ...((stripeCustomerId && stripePaymentMethodEnabledOfAnyMethod) ? await stripeListPaymentMethods(stripeCustomerId, limitMaxPaymentMethodList) : []),
        ]);
        //#endregion query api
        
        
        
        const compatiblePaymentMethods = compatiblePaymentMethodData.map((item) =>
            convertPaymentMethodDetailDataToPaymentMethodDetail(item, compatiblePaymentMethodData.length, resolver) ?? convertPaymentMethodDetailDataToPaymentMethodDetail(item, compatiblePaymentMethodData.length, null)
        ) satisfies PaymentMethodDetail[];
        return Response.json(compatiblePaymentMethods); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'unexpected error' }, { status: 500 }); // handled with error
    } // try
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
            //#region find existing paymentMethodProviderCustomerId
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
            //#endregion find existing paymentMethodProviderCustomerId
            
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
        //#region find existing paymentMethodProviderCustomerId
        const {
            paypalCustomerId,
            stripeCustomerId,
            // midtransCustomerId,
        } = customerIds;
        //#endregion find existing paymentMethodProviderCustomerId
        
        const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
            ...((paypalCustomerId && paypalPaymentMethodEnabledOfAnyMethod) ? await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList) : []),
            ...((stripeCustomerId && stripePaymentMethodEnabledOfAnyMethod) ? await stripeListPaymentMethods(stripeCustomerId, limitMaxPaymentMethodList) : []),
        ]);
        //#endregion query api
        
        
        
        const paginationPaymentMethodDetail : Pagination<PaymentMethodDetail> = {
            total    : total,
            entities : (
                paged
                .map((item) =>
                    convertPaymentMethodDetailDataToPaymentMethodDetail(item, total, resolver) ?? convertPaymentMethodDetailDataToPaymentMethodDetail(item, total, null)
                )
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
            vaultToken,
            ...createOrUpdatedata
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
        paymentMethodProvider,
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
        const paymentMethodCapture = await (async (): Promise<PaymentMethodCapture|null> => {
            switch (paymentMethodProvider) {
                case 'PAYPAL': return paypalPaymentMethodEnabledOfAnyMethod ? paypalCapturePaymentMethod(providerVaultToken) : null;
                case 'STRIPE': return stripePaymentMethodEnabledOfAnyMethod ? stripeCapturePaymentMethod(providerVaultToken) : null;
                default      : return null;
            } // switch
        })();
        if (!paymentMethodCapture) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        //#endregion process the vault token
        
        
        
        const result = await prisma.$transaction(async (prismaTransaction) => {
            return await createOrUpdatePaymentMethod(prismaTransaction, createOrUpdatedata, customerId, paymentMethodCapture);
        }, { timeout: 20000 }); // give a longer timeout for complex db_transactions and api_fetches // may up to 20 secs
        
        
        
        // undo `providerCapturePaymentMethod()` if `createOrUpdatePaymentMethod()` failed:
        if ((result instanceof Response/*Error*/) && !createOrUpdatedata.id /* do not revert for updating */) {
            await deletePaymentMethodAccount(paymentMethodCapture);
        } // if
        
        
        
        if (result instanceof Response/*Error*/) return result satisfies Response/*Error*/;
        return Response.json(result);
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
        const affectedPaymentMethods = await prisma.$transaction(async (prismaTransaction): Promise<AffectedPaymentMethods> => {
            const deletingPaymentMethod = await prismaTransaction.paymentMethod.findUniqueOrThrow({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    id       : id,
                },
                select : {
                    id                      : true,
                    
                    provider                : true,
                    providerPaymentMethodId : true,
                },
            });
            const {
                id                      : deletingPaymentMethodId,
                provider                : existingPaymentMethodProvider,
                providerPaymentMethodId : existingPaymentMethodProviderId,
            } = deletingPaymentMethod;
            
            
            
            // decrease the sibling's sort that are greater than deleted_paymentMethod's sort:
            const affectedPaymentMethods : AffectedPaymentMethods = await deletePaymentMethod(prismaTransaction, customerId, [deletingPaymentMethodId]);
            
            
            
            // after successfully deleted of the api above => delete payment token account:
            await deletePaymentMethodAccount({
                paymentMethodProvider   : existingPaymentMethodProvider,
                paymentMethodProviderId : existingPaymentMethodProviderId,
            });
            
            
            
            return affectedPaymentMethods;
        }, { timeout: 20000 }); // give a longer timeout for complex db_transactions and api_fetches // may up to 20 secs
        
        
        
        await prisma.$transaction(async (prismaTransaction) => {
            await deleteNonRelatedAccounts(prismaTransaction, customerId); // never thrown
        }, { timeout: 20000 }); // give a longer timeout for complex db_transactions and api_fetches // may up to 20 secs
        return Response.json(affectedPaymentMethods); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
