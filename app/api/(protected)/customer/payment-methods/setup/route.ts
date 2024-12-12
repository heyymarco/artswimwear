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
    type PaymentMethodSetupDetail,
    PaymentMethodSetupRequestSchema,
    type PaymentMethodSetup,
    type PaymentMethodCapture,
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
import {
    // utilities:
    stripeCreatePaymentMethodSetup,
}                           from '@/libs/payments/processors/stripe'
import {
    createOrUpdatePaymentMethod,
    deletePaymentMethodAccount,
}                           from '@/libs/payment-method-utilities'

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
            paymentMethodProvider,
            cardToken,
            billingAddress,
            
            // data for immediately updated without returning setup token:
            ...createOrUpdatedata
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region find existing paymentMethodProviderCustomerId
    const paymentMethodProviderCustomerIds = await prisma.customer.findUniqueOrThrow({
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
    //#endregion find existing paymentMethodProviderCustomerId
    
    
    
    const paymentMethodSetupOrCapture = await (async (): Promise<PaymentMethodSetup|PaymentMethodCapture|null> => {
        switch (paymentMethodProvider) {
            case 'PAYPAL' : return checkoutConfigServer.payment.processors.paypal.enabled ? paypalCreatePaymentMethodSetup({ paymentMethodProviderCustomerId: paymentMethodProviderCustomerIds.paypalCustomerId, billingAddress }) : null;
            case 'STRIPE' : return checkoutConfigServer.payment.processors.stripe.enabled ? stripeCreatePaymentMethodSetup({ paymentMethodProviderCustomerId: paymentMethodProviderCustomerIds.stripeCustomerId, billingAddress, cardToken }) : null;
            default       : return null;
        } // switch
    })();
    if (!paymentMethodSetupOrCapture) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paymentMethodProviderCustomerId,
    } = paymentMethodSetupOrCapture;
    
    
    
    //#region save the new generated paymentMethodProviderCustomerId
    if (
        ((paymentMethodProvider ===   'PAYPAL') && !paymentMethodProviderCustomerIds.paypalCustomerId)
        ||
        ((paymentMethodProvider ===   'STRIPE') && !paymentMethodProviderCustomerIds.stripeCustomerId)
        ||
        ((paymentMethodProvider === 'MIDTRANS') && !paymentMethodProviderCustomerIds.midtransCustomerId)
    ) {
        await prisma.customer.update({
            where  : {
                id : customerId, // important: the signedIn customerId
            },
            data   : {
                paypalCustomerId   : (paymentMethodProvider ===   'PAYPAL') ? paymentMethodProviderCustomerId : undefined,
                stripeCustomerId   : (paymentMethodProvider ===   'STRIPE') ? paymentMethodProviderCustomerId : undefined,
                midtransCustomerId : (paymentMethodProvider === 'MIDTRANS') ? paymentMethodProviderCustomerId : undefined,
            },
            select : {
                id : true,
            },
        });
    } // if
    //#endregion save the new generated paymentMethodProviderCustomerId
    
    
    
    if ('paymentMethodSetupToken' in paymentMethodSetupOrCapture) {
        const {
            paymentMethodSetupToken,
            redirectData,
        } = paymentMethodSetupOrCapture satisfies PaymentMethodSetup;
        
        
        
        const paymentMethodSetup = {
            paymentMethodSetupToken : `#${paymentMethodProvider}_${paymentMethodSetupToken}`,
            redirectData,
        } satisfies PaymentMethodSetupDetail;
        return Response.json(paymentMethodSetup); // handled with success
    }
    else {
        const response = await prisma.$transaction(async (prismaTransaction) => {
            return await createOrUpdatePaymentMethod(prismaTransaction, createOrUpdatedata, customerId, paymentMethodSetupOrCapture satisfies PaymentMethodCapture);
        }, { timeout: 15000 }); // give a longer timeout for complex db_transactions and api_fetches // may up to 15 secs
        
        
        
        // undo `providerCreatePaymentMethodSetup()` if `createOrUpdatePaymentMethod()` failed:
        if (!response.ok && !createOrUpdatedata.id /* do not revert for updating */) {
            await deletePaymentMethodAccount(paymentMethodSetupOrCapture satisfies PaymentMethodCapture);
        } // if
        
        
        
        return response;
    } // if
});
