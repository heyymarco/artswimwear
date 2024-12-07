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
    PaymentMethodSetupRequestSchema,
    type PaymentMethodSetupDetail,
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
    paypalCreatePaymentMethodSetup,
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
                arg : PaymentMethodSetupRequestSchema.parse(data),
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
            provider,
            billingAddress,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
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
    
    // do not limit, in case of updating instead of creating:
    // //#region limits max payment method count
    // if (paymentMethodCount >= paymentMethodLimitMax) {
    //     return Response.json({
    //         error: 'Max payment method count has been reached.',
    //     }, { status: 400 }); // handled with error
    // } // if
    // //#endregion limits max payment method count
    //#endregion find existing providerCustomerId
    
    
    
    const paymentMethodSetup = await (async (): Promise<PaymentMethodSetupDetail|null> => {
        switch (provider) {
            case 'PAYPAL' : return checkoutConfigServer.payment.processors.paypal.enabled ? paypalCreatePaymentMethodSetup({ providerCustomerId: providerCustomerIds?.paypalCustomerId ?? undefined, billingAddress }) : null;
            default       : return null;
        } // switch
    })();
    if (!paymentMethodSetup) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        setupToken,
        providerCustomerId,
    } = paymentMethodSetup;
    
    
    
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
    
    
    
    return new Response(setupToken); // handled with success
});
