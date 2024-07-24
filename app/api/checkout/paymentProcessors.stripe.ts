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
        capture_method : 'manual',
    });
    const {
        client_secret,
    } = paymentIntent;
    
    
    
    return {
        paymentId    : client_secret, // to be confirmed on the client_side, contains paymentIntentId + clientSecretToken, eg: pi_3Pg295D6SqU8owGY1RScPekB_secret_VYiYYEUsKwarB1YAqTWqF11cI
        redirectData : undefined,     // no redirectData required
    } as AuthorizedFundData;
}



export const stripeCaptureFund = async (paymentId: string): Promise<PaymentDetail|undefined> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntentId = ((): string => { // pi_3Pg295D6SqU8owGY1RScPekB
        var secretIndex = paymentId.indexOf('_secret_');
        if (secretIndex < 0) return paymentId;
        return paymentId.slice(0, secretIndex);
    })();
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId, {
        expand : [
            'latest_charge.balance_transaction',
            'payment_method',
        ],
    });
    if (paymentIntent.status !== 'succeeded') return undefined;
    
    
    
    /*
        {
            id: "pi_3Pg295D6SqU8owGY1RScPekB",
            object: "payment_intent",
            amount: 2506,
            amount_capturable: 0,
            amount_details: {
                tip: {
                },
            },
            amount_received: 2506,
            application: null,
            application_fee_amount: null,
            automatic_payment_methods: {
                allow_redirects: "always",
                enabled: true,
            },
            canceled_at: null,
            cancellation_reason: null,
            capture_method: "manual",
            client_secret: "pi_3Pg295D6SqU8owGY1RScPekB_secret_VYiYYEUsKwarB1YAqTWqF11cI",
            confirmation_method: "automatic",
            created: 1721815807,
            currency: "usd",
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: null,
            latest_charge: {
                id: "ch_3Pg295D6SqU8owGY1MBl7JsV",
                object: "charge",
                amount: 2506,
                amount_captured: 2506,
                amount_refunded: 0,
                application: null,
                application_fee: null,
                application_fee_amount: null,
                balance_transaction: {
                    id: "txn_3Pg295D6SqU8owGY1UzDNnwt",
                    object: "balance_transaction",
                    amount: 2506,
                    available_on: 1722384000,
                    created: 1721815875,
                    currency: "usd",
                    description: null,
                    exchange_rate: null,
                    fee: 103,
                    fee_details: [
                        {
                            amount: 103,
                            application: null,
                            currency: "usd",
                            description: "Stripe processing fees",
                            type: "stripe_fee",
                        },
                    ],
                    net: 2403,
                    reporting_category: "charge",
                    source: "ch_3Pg295D6SqU8owGY1MBl7JsV",
                    status: "pending",
                    type: "charge",
                },
                billing_details: {
                    address: {
                        city: "Sleman",
                        country: "ID",
                        line1: "Jl Monjali Gang Perkutut 25",
                        line2: null,
                        postal_code: "55284",
                        state: "DI Yogyakarta",
                    },
                    email: null,
                    name: "Yunus Kurniawan",
                    phone: "0838467735677",
                },
                calculated_statement_descriptor: "Stripe",
                captured: true,
                created: 1721815844,
                currency: "usd",
                customer: null,
                description: null,
                destination: null,
                dispute: null,
                disputed: false,
                failure_balance_transaction: null,
                failure_code: null,
                failure_message: null,
                fraud_details: {
                },
                invoice: null,
                livemode: false,
                metadata: {
                },
                on_behalf_of: null,
                order: null,
                outcome: {
                    network_status: "approved_by_network",
                    reason: null,
                    risk_level: "normal",
                    risk_score: 52,
                    seller_message: "Payment complete.",
                    type: "authorized",
                },
                paid: true,
                payment_intent: "pi_3Pg295D6SqU8owGY1RScPekB",
                payment_method: "pm_1Pg29gD6SqU8owGYlFWtrEOC",
                payment_method_details: {
                    card: {
                        amount_authorized: 2506,
                        brand: "visa",
                        capture_before: 1722420644,
                        checks: {
                            address_line1_check: "pass",
                            address_postal_code_check: "pass",
                            cvc_check: "pass",
                        },
                        country: "US",
                        exp_month: 12,
                        exp_year: 2034,
                        extended_authorization: {
                            status: "disabled",
                        },
                        fingerprint: "ER4JXzEkwjffY8fr",
                        funding: "credit",
                        incremental_authorization: {
                            status: "unavailable",
                        },
                        installments: null,
                        last4: "4242",
                        mandate: null,
                        multicapture: {
                            status: "unavailable",
                        },
                        network: "visa",
                        network_token: {
                            used: false,
                        },
                        overcapture: {
                            maximum_amount_capturable: 2506,
                            status: "unavailable",
                        },
                        three_d_secure: null,
                        wallet: null,
                    },
                    type: "card",
                },
                radar_options: {
                },
                receipt_email: null,
                receipt_number: null,
                receipt_url: "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTVN2dGdENlNxVThvd0dZKMSmg7UGMgaRtDYQOEQ6LBYvoqionNt_kF_EHLlX3BwvRYoeAPbxHzzyXaRHMGMw-PI4Cp5EZF-7XTkq",
                refunded: false,
                review: null,
                shipping: {
                    address: {
                        city: "Sleman",
                        country: "ID",
                        line1: "Jl Monjali Gang Perkutut 25",
                        line2: null,
                        postal_code: "55284",
                        state: "DI Yogyakarta",
                    },
                    carrier: null,
                    name: "Yunus Kurniawan",
                    phone: "0838467735677",
                    tracking_number: null,
                },
                source: null,
                source_transfer: null,
                statement_descriptor: null,
                statement_descriptor_suffix: null,
                status: "succeeded",
                transfer_data: null,
                transfer_group: null,
            },
            livemode: false,
            metadata: {
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: {
                id: "pm_1Pg29gD6SqU8owGYlFWtrEOC",
                object: "payment_method",
                allow_redisplay: "unspecified",
                billing_details: {
                    address: {
                        city: "Sleman",
                        country: "ID",
                        line1: "Jl Monjali Gang Perkutut 25",
                        line2: null,
                        postal_code: "55284",
                        state: "DI Yogyakarta",
                    },
                    email: null,
                    name: "Yunus Kurniawan",
                    phone: "0838467735677",
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
                created: 1721815844,
                customer: null,
                livemode: false,
                metadata: {
                },
                type: "card",
            },
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
                    city: "Sleman",
                    country: "ID",
                    line1: "Jl Monjali Gang Perkutut 25",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                },
                carrier: null,
                name: "Yunus Kurniawan",
                phone: "0838467735677",
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
        amount_received : amountFallback,
        currency        : currencyFallback,
        
        payment_method  : paymentMethodRaw,
    } = paymentIntent;
    const latestCharge       = paymentIntent.latest_charge       as Stripe.Charge|undefined;
    const balanceTransaction = latestCharge?.balance_transaction as Stripe.BalanceTransaction|undefined;
    const currency           = balanceTransaction?.currency ?? latestCharge?.currency        ?? currencyFallback;
    const amount             = balanceTransaction?.amount   ?? latestCharge?.amount_captured ?? amountFallback;
    const fee                = balanceTransaction?.fee      ?? 0;
    const paymentMethod      = (
        (paymentMethodRaw && (typeof(paymentMethodRaw) === 'object'))
        ? paymentMethodRaw
        : null
    );
    
    
    
    const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
        if (paymentMethod) {
            /* PAY WITH CARD */
            if ((paymentMethod.type === 'card') && paymentMethod.card) return {
                type       : 'CARD',
                brand      : paymentMethod.card.brand /* machine readable name */ ?? paymentMethod.card.display_brand /* human readable name */,
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
        
        amount : revertCurrencyFromStripeNominal(amount, currency),
        fee    : revertCurrencyFromStripeNominal(fee   , currency),
    } satisfies PaymentDetail;
}
export const stripeCancelOrder = async (paymentId: string): Promise<boolean> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentIntentId = ((): string => { // pi_3Pg295D6SqU8owGY1RScPekB
        var secretIndex = paymentId.indexOf('_secret_');
        if (secretIndex < 0) return paymentId;
        return paymentId.slice(0, secretIndex);
    })();
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return (paymentIntent.status === 'canceled');
}
