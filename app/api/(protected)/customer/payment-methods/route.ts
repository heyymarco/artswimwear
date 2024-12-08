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
}                           from './utilities'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



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
            stripeCustomerId,
            // midtransCustomerId,
        } = customerIds;
        //#endregion find existing providerCustomerId
        
        const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
            ...((paypalCustomerId && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(paypalCustomerId, limitMaxPaymentMethodList) : []),
            ...((stripeCustomerId && checkoutConfigServer.payment.processors.stripe.enabled) ? await stripeListPaymentMethods(stripeCustomerId, limitMaxPaymentMethodList) : []),
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
        const paymentMethodCapture = await (async (): Promise<PaymentMethodCapture|null> => {
            switch (provider) {
                case 'PAYPAL': return checkoutConfigServer.payment.processors.paypal.enabled ? paypalCapturePaymentMethod(providerVaultToken) : null;
                case 'STRIPE': return checkoutConfigServer.payment.processors.stripe.enabled ? stripeCapturePaymentMethod(providerVaultToken) : null;
                default      : return null;
            } // switch
        })();
        if (!paymentMethodCapture) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        //#endregion process the vault token
        
        
        
        const response = await createOrUpdatePaymentMethod(createOrUpdatedata, customerId, provider, paymentMethodCapture);
        
        
        
        //#region revert the account if creation is failed
        if (!response.ok && !createOrUpdatedata.id /* do not revert for updating */) {
            const {
                providerPaymentMethodId,
            } = paymentMethodCapture;
            await deletePaymentMethodAccount(provider, providerPaymentMethodId);
        } // if
        //#endregion revert the account if creation is failed
        
        
        
        return response;
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
        
        
        
        const [deletedPaymentMethod] = await Promise.all([
            prisma.paymentMethod.delete({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    id       : id,
                },
                select : {
                    id       : true,
                },
            }) satisfies Promise<Pick<PaymentMethodDetail, 'id'>>,
            
            deletePaymentMethodAccount(provider, providerPaymentMethodId),
        ]);
        
        
        
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
