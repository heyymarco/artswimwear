// models:
import {
    // types:
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
}                           from '@/models'

// utilities:
import {
    convertCurrencyToStripeNominal,
    revertCurrencyFromStripeNominal,
}                           from '@/libs/currencyExchanges-stripe'

// stripe:
import {
    Stripe,
}                           from 'stripe'



const stripe = !process.env.STRIPE_SECRET ? undefined : new Stripe(process.env.STRIPE_SECRET);



export const stripeCreateOrder = async (options: CreateOrderOptions): Promise<AuthorizedFundData> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const {
        currency,
        totalCostConverted,
        totalProductPriceConverted,
        totalShippingCostConverted,
        
        detailedItems,
        
        hasShippingAddress,
        shippingAddress,
    } = options;
    
    
    
    const paymentIntent = await stripe.paymentIntents.create({
        currency       : currency.toLowerCase(),
        amount         : convertCurrencyToStripeNominal(totalCostConverted, currency),
        
        shipping       : !shippingAddress ? undefined : {
            address : {
                country     : shippingAddress.country,
                state       : shippingAddress.state,
                city        : shippingAddress.city,
                postal_code : shippingAddress.zip ?? undefined,
                line1       : shippingAddress.address,
                line2       : undefined,
            },
            name            : (shippingAddress.firstName ?? '') + ((!!shippingAddress.firstName && !!shippingAddress.lastName) ? ' ' : '') + (shippingAddress.lastName ?? ''),
            phone           : shippingAddress.phone,
        },
        capture_method : 'manual'
    });
    const {
        client_secret,
    } = paymentIntent;
    
    
    
    return {
        paymentId    : client_secret, // to be confirmed on the client_side, contains paymentIntentId + clientSecretToken, eg: pi_3Pfco5D6SqU8owGY1dwhOu2O_secret_5yy7AsjFNZJeIGyytPdlmeGeO
        redirectData : undefined,     // no redirectData required
    } as AuthorizedFundData;
}



export const stripeCaptureFund = async (paymentId: string): Promise<PaymentDetail|undefined> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntentId = ((): string => { // pi_3Pfco5D6SqU8owGY1dwhOu2O
        var secretIndex = paymentId.indexOf('_secret_');
        if (secretIndex < 0) return paymentId;
        return paymentId.slice(0, secretIndex);
    })();
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') return undefined;
    
    
    
    /*
        {
            id: "pi_3PfjefD6SqU8owGY1n9iHL1t",
            object: "payment_intent",
            amount: 2512,
            amount_capturable: 0,
            amount_details: {
                tip: {
                },
            },
            amount_received: 2512,
            application: null,
            application_fee_amount: null,
            automatic_payment_methods: {
                allow_redirects: "always",
                enabled: true,
            },
            canceled_at: null,
            cancellation_reason: null,
            capture_method: "manual",
            client_secret: "pi_3PfjefD6SqU8owGY1n9iHL1t_secret_j2ErOM5KCNxsNjHH98Fe0Agtr",
            confirmation_method: "automatic",
            created: 1721744729,
            currency: "usd",
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: null,
            latest_charge: "ch_3PfjefD6SqU8owGY1wN5xzIl",
            livemode: false,
            metadata: {
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: "pm_1PfjehD6SqU8owGYIXsJyZnw",
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
                card: {
                    installments: null,
                    mandate_options: null,
                    network: null,
                    request_three_d_secure: "automatic",
                },
                cashapp: {
                },
                link: {
                    persistent_token: null,
                },
            },
            payment_method_types: [
                "card",
                "link",
                "cashapp",
            ],
            processing: null,
            receipt_email: null,
            review: null,
            setup_future_usage: null,
            shipping: {
                address: {
                    city: "Yogyakarta",
                    country: "ID",
                    line1: "Jl monjali",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                },
                carrier: null,
                name: "Yunus Kurniawan",
                phone: "0888889999999",
                tracking_number: null,
            },
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: "succeeded",
            transfer_data: null,
            transfer_group: null,
        }
    */
    const {
        payment_method : paymentMethodRaw,
        
        amount_received,
        application_fee_amount,
        currency,
    } = paymentIntent;
    const paymentMethod : Stripe.PaymentMethod|null = await (async () => {
        if (typeof(paymentMethodRaw) !== 'string') return paymentMethodRaw;
        try {
            return await stripe.paymentMethods.retrieve(paymentMethodRaw);
        }
        catch {
            return null;
        } // try
    })();
    /*
        {
            id: "pm_1PfjehD6SqU8owGYIXsJyZnw",
            object: "payment_method",
            allow_redisplay: "unspecified",
            billing_details: {
                address: {
                    city: "Yogyakarta",
                    country: "ID",
                    line1: "Jl monjali",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                },
                email: null,
                name: "Yunus Kurniawan",
                phone: "0888889999999",
            },
            card: {
                brand: "visa",
                checks: {
                    address_line1_check: "pass",
                    address_postal_code_check: "pass",
                    cvc_check: "pass",
                },
                country: "US",
                display_brand: "visa",
                exp_month: 12,
                exp_year: 2034,
                fingerprint: "ER4JXzEkwjffY8fr",
                funding: "credit",
                generated_from: null,
                last4: "4242",
                networks: {
                    available: [
                        "visa",
                    ],
                    preferred: null,
                },
                three_d_secure_usage: {
                    supported: true,
                },
                wallet: null,
            },
            created: 1721744732,
            customer: null,
            livemode: false,
            metadata: {
            },
            type: "card",
        }
    */
    const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
        if (paymentMethod && (typeof(paymentMethod) === 'object')) {
            /* PAY WITH CARD */
            if (paymentMethod.card) return {
                type       : 'CARD',
                brand      : paymentMethod.card.brand,
                identifier : paymentMethod.card.last4,
            };
        } // if
        
        
        
        /* PAY WITH OTHER */
        return {
            type       : 'CUSTOM',
            brand      : null,
            identifier : null,
        };
    })();
    return {
        ...paymentDetailPartial,
        
        amount : revertCurrencyFromStripeNominal(amount_received, currency),
        fee    : revertCurrencyFromStripeNominal(application_fee_amount ?? 0, currency),
    } satisfies PaymentDetail;
}
export const stripeCancelOrder = async (paymentId: string): Promise<boolean> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntentId = ((): string => { // pi_3Pfco5D6SqU8owGY1dwhOu2O
        var secretIndex = paymentId.indexOf('_secret_');
        if (secretIndex < 0) return paymentId;
        return paymentId.slice(0, secretIndex);
    })();
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return (paymentIntent.status === 'canceled');
}
