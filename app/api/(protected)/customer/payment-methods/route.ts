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
    SetupPaymentRequestTypeSchema,
    type PaymentMethodTokenDetail,
    
    
    
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
}                           from '@/libs/payments/processors/paypal'

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
                    sort: 'asc',
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
            ...((paypalCustomerId && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(paypalCustomerId) : []),
        ]);
        //#endregion query api
        
        
        
        const paginationPaymentMethodDetail : Pagination<PaymentMethodDetail> = {
            total    : total,
            entities : (
                paged
                .map((item) => convertPaymentMethodDetailDataToPaymentMethodDetail(item, resolver))
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
        //#region find existing providerCustomerId
        const providerCustomerIds = await prisma.customer.findUnique({
            where  : {
                id : customerId, // important: the signedIn customerId
            },
            select : {
                paypalCustomerId   : true,
                stripeCustomerId   : true,
                midtransCustomerId : true,
            },
        });
        //#endregion find existing providerCustomerId
        
        
        
        //#region process the vault token
        const paymentMethodToken = await (async (): Promise<PaymentMethodTokenDetail|null> => {
            switch (provider) {
                case 'PAYPAL': return checkoutConfigServer.payment.processors.paypal.enabled ? paypalCapturePaymentMethod(providerVaultToken, providerCustomerIds?.paypalCustomerId ?? undefined) : null;
                default      : return null;
            } // switch
        })();
        if (!paymentMethodToken) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        const {
            providerCustomerId,
            providerPaymentMethodId,
        } = paymentMethodToken;
        //#endregion process the vault token
        
        
        
        //#region save the new generated providerCustomerId
        if (
            ((provider ===   'PAYPAL') && !providerCustomerIds?.paypalCustomerId)
            ||
            ((provider ===   'STRIPE') && !providerCustomerIds?.stripeCustomerId)
            ||
            ((provider === 'MIDTRANS') && !providerCustomerIds?.midtransCustomerId)
        ) {
            await prisma.customer.update({
                where  : {
                    id : customerId, // important: the signedIn customerId
                },
                data   : {
                    paypalCustomerId   : (provider ===   'PAYPAL') ? providerCustomerId : undefined,
                    stripeCustomerId   : (provider ===   'STRIPE') ? providerCustomerId : undefined,
                    midtransCustomerId : (provider === 'MIDTRANS') ? providerCustomerId : undefined,
                },
                select : {
                    id : true,
                },
            });
        } // if
        //#endregion save the new generated providerCustomerId
        
        
        
        const paymentMethodData = (
            !id
            ? await prisma.paymentMethod.create({
                data   : {
                    parentId                : customerId, // important: the signedIn customerId
                    
                    sort                    : 0,
                    
                    provider                : provider,
                    providerPaymentMethodId : providerPaymentMethodId,
                    
                    currency                : 'USD',
                },
                select : paymentMethodDetailSelect,
            })
            : await prisma.paymentMethod.update({
                where  : {
                    id                      : id,
                    parentId                : customerId, // important: the signedIn customerId
                },
                data   : {
                    sort                    : 0,
                    
                    provider                : provider,
                    providerPaymentMethodId : providerPaymentMethodId,
                    
                    currency                : 'USD',
                },
                select : paymentMethodDetailSelect,
            })
        );
        
        
        
        const resolver = new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>([
            ...(((provider === 'PAYPAL') && checkoutConfigServer.payment.processors.paypal.enabled) ? await paypalListPaymentMethods(providerCustomerId) : []),
        ]);
        const paymentMethod : PaymentMethodDetail|null = convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodData, resolver);
        return Response.json(paymentMethod); // handled with success
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
        return Response.json(deletedPaymentMethod); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.get(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                type : SetupPaymentRequestTypeSchema.parse(data?.type),
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
        type,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    switch (type) {
        case 'paypal': {
            const setupToken = await paypalCreateSetupPayment();
            return new Response(setupToken);
        }
        
        default:
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
    } // switch
});
