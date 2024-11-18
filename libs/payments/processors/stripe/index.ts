// models:
import {
    // types:
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    
    
    // utilities:
    isAuthorizedFundData,
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



export interface StripeTranslateDataOptions {
    resolveMissingFee           ?: boolean
    resolveMissingPaymentMethod ?: boolean
}
/**
 * undefined          : (never happened) Transaction not found.  
 * null               : Transaction creation was denied (for example due to a decline).  
 * 0                  : Transaction is being processed (may be processed on customer_side or stripe_side).  
 * AuthorizedFundData : Authorized for payment.  
 * PaymentDetail      : Paid.  
 * false              : Transaction was deleted due to canceled.  
 * empty_string       : (never happened) Transaction was deleted due to expired.  
 */
export const stripeTranslateData = async (paymentIntent: Stripe.PaymentIntent, options?: StripeTranslateDataOptions): Promise<undefined|0|null|AuthorizedFundData|PaymentDetail|false> => {
    // options:
    const {
        resolveMissingFee           = false, // false by default because the operation may take quite long time
        resolveMissingPaymentMethod = true,  // true  by default because the operation can be done quickly
    } = options ?? {};
    
    
    
    switch (paymentIntent.status) {
        // step 1:
        case 'requires_payment_method' : { // if the payment attempt fails (for example due to a decline)
            return null;
        }
        
        
        
        // step 2:
        case 'requires_confirmation'   : {
            return 0; // being processed on customer_side, click [pay] button
        }
        
        
        
        // step 3:
        case 'requires_action'         : { // the payment requires additional actions, such as authenticating with 3D Secure
            return {
                paymentId    : paymentIntent.id, // paymentIntent Id
                redirectData : paymentIntent.client_secret ?? '', // redirectData for 3DS verification (credit_card)
            } satisfies AuthorizedFundData;
        }
        
        
        
        // step 4 (optional):
        case 'requires_capture'        : { // not paid until manually capture on server_side
            return {
                paymentId    : paymentIntent.id, // paymentIntent Id
                redirectData : undefined, // no redirectData required but require a `stripeCaptureFund()` to capture the fund
            } satisfies AuthorizedFundData;
        }
        
        
        
        // step 5 (for asynchronous payment methods):
        case 'processing'              : { // created, all the required data passed, but not paid
            return 0; // being processed on stripe_side
        }
        
        
        
        // step 6:
        case 'canceled'                : { // canceled by api
            return false;
        }
        
        
        
        // step 7:
        case 'succeeded'               : { // paid
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
                currency        : currencyFallback,
                amount_received : amountFallback,
                
                payment_method  : paymentMethodRaw,
            } = paymentIntent;
            const latestCharge       = ((paymentIntent.latest_charge       && (typeof(paymentIntent.latest_charge     ) === 'object')) ? paymentIntent.latest_charge      : undefined);
            let   balanceTransaction = ((latestCharge?.balance_transaction && (typeof(latestCharge.balance_transaction) === 'object')) ? latestCharge.balance_transaction : undefined);
            if (resolveMissingFee && !!paymentIntent.latest_charge && !balanceTransaction && stripe) {
                for (let remainingRetries = 9, retryCounter = 0; remainingRetries > 0; remainingRetries--, retryCounter++) {
                    const prevTick = performance.now();
                    try {
                        const newLatestCharge = await stripe.charges.retrieve(((typeof(paymentIntent.latest_charge) === 'string') ? paymentIntent.latest_charge : paymentIntent.latest_charge.id), {
                            expand : [
                                'balance_transaction',
                            ],
                        });
                        balanceTransaction = ((newLatestCharge.balance_transaction && (typeof(newLatestCharge.balance_transaction) === 'object')) ? newLatestCharge.balance_transaction : undefined);
                        if (balanceTransaction) {
                            break;
                        } // if
                    }
                    catch {
                        // ignore any error
                    } // try
                    const executionInterval = performance.now() - prevTick;
                    
                    
                    
                    if (remainingRetries > 0) {
                        // wait for a brief moment for next retry:
                        const absoluteDelay = (((1.4 ** retryCounter) - 1) * 1000); // absoluteDelay: 0, 0.4, 0.96, 1.74, 2.84, 4.38, 6.53, 9.54, 13.76 => sum 40.15 secs
                        const relativeDelay = Math.max(absoluteDelay - executionInterval, 0);
                        console.log(`wait for: ${absoluteDelay} => ${relativeDelay}`);
                        await new Promise<void>((resolve) => {
                            setTimeout(resolve, relativeDelay);
                        });
                    } // if
                } // for
            } // if
            const currency           = balanceTransaction?.currency ?? latestCharge?.currency        ?? currencyFallback;
            const amount             = balanceTransaction?.amount   ?? latestCharge?.amount_captured ?? amountFallback;
            const fee                = balanceTransaction?.fee      ?? 0;
            const paymentMethod      = (
                (paymentMethodRaw && (typeof(paymentMethodRaw) === 'object'))
                ? paymentMethodRaw
                : (
                    (!resolveMissingPaymentMethod || (typeof(paymentMethodRaw) !== 'string') || !stripe)
                    ? undefined
                    : await stripe.paymentMethods.retrieve(paymentMethodRaw)
                )
            );
            
            
            
            const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
                if (paymentMethod) {
                    /* PAY WITH CARD */
                    if ((paymentMethod.type === 'card') && paymentMethod.card) return {
                        type       : 'CARD',
                        brand      : paymentMethod.card.brand /* machine readable name */ ?? paymentMethod.card.display_brand /* human readable name */,
                        identifier : paymentMethod.card.last4,
                    };
                    
                    
                    
                    /* PAY WITH AMAZON_PAY */
                    if ((paymentMethod.type === 'amazon_pay') && paymentMethod.amazon_pay) return {
                        type       : 'EWALLET',
                        brand      : 'amazonpay',
                        identifier : null,
                    };
                    
                    
                    
                    /* PAY WITH LINK */
                    if ((paymentMethod.type === 'link') && paymentMethod.link) return {
                        type       : 'EWALLET',
                        brand      : 'link',
                        identifier : paymentMethod.link.email,
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
        
        
        
        default    : {
            console.log('unexpected response: ', paymentIntent);
            throw Error('unexpected API response');
        }
    } // switch
}

export const stripeGetPaymentFee = async (charge: Stripe.Charge): Promise<number|undefined> => {
    const balanceTransaction = (
        !charge.balance_transaction
        ? undefined
        : (
            (typeof(charge.balance_transaction) === 'object')
            ? charge.balance_transaction
            : (
                !stripe
                ? undefined
                : await stripe.balanceTransactions.retrieve(charge.balance_transaction)
            )
        )
    );
    if (balanceTransaction === undefined) return undefined;
    
    
    
    const currency = balanceTransaction?.currency ?? charge?.currency;
    const fee      = balanceTransaction.fee;
    return revertCurrencyFromStripeNominal(fee, currency);
}



export const stripeCreateOrder = async (cardToken: string, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|PaymentDetail|null> => {
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
    
    
    
    const isPaymentMethodToken = cardToken.startsWith('pm_');
    const isConfirmationToken  = cardToken.startsWith('ctoken_');
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    try {
        paymentIntent = await stripe.paymentIntents.create({
            metadata                  : {
                orderId               : orderId,
            },
            
            currency                  : currency.toLowerCase(),
            amount                    : convertCurrencyToStripeNominal(totalCostConverted, currency),
            
            shipping                  : !shippingAddress ? undefined : {
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
            capture_method            : isPaymentMethodToken ? 'manual' : undefined, // the fund must be captured on server_side
            // confirmation_method       : isConfirmationToken  ? 'manual' : undefined, // the fund must be captured on server_side // DOESN'T WORK
            
            confirm                   : true,
            payment_method            : isPaymentMethodToken ? cardToken : undefined,
            confirmation_token        : isConfirmationToken  ? cardToken : undefined,
            return_url                : isConfirmationToken  ? `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}` : undefined,
            automatic_payment_methods : {
                enabled         : true,
                allow_redirects : 'never',
            },
            
            // payment_method_types      : ['card_present'],
            // setup_future_usage        : 'off_session',
            
            expand                    : [
                'latest_charge.balance_transaction',
                'payment_method',
            ],
        });
    }
    catch (error: any) {
        /*
            declined:
            {
                type: "StripeCardError",
                raw: {
                    charge: "ch_3PgQFND6SqU8owGY18nat0La",
                    code: "card_declined",
                    decline_code: "generic_decline",
                    doc_url: "https://stripe.com/docs/error-codes/card-declined",
                    message: "Your card was declined.",
                    payment_intent: {
                        id: "pi_3PgQFND6SqU8owGY1BaO8DHR",
                        object: "payment_intent",
                        amount: 2506,
                        amount_capturable: 0,
                        amount_details: {
                            tip: {
                            },
                        },
                        amount_received: 0,
                        application: null,
                        application_fee_amount: null,
                        automatic_payment_methods: {
                            allow_redirects: "never",
                            enabled: true,
                        },
                        canceled_at: null,
                        cancellation_reason: null,
                        capture_method: "manual",
                        client_secret: "pi_3PgQFND6SqU8owGY1BaO8DHR_secret_xL95GHzgmHvoncXBAsxSA2lNL",
                        confirmation_method: "automatic",
                        created: 1721908453,
                        currency: "usd",
                        customer: null,
                        description: null,
                        invoice: null,
                        last_payment_error: {
                            charge: "ch_3PgQFND6SqU8owGY18nat0La",
                            code: "card_declined",
                            decline_code: "generic_decline",
                            doc_url: "https://stripe.com/docs/error-codes/card-declined",
                            message: "Your card was declined.",
                            payment_method: {
                                id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                                    fingerprint: "2vIPq9JPFdYz8JZO",
                                    funding: "credit",
                                    generated_from: null,
                                    last4: "0002",
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
                                created: 1721908442,
                                customer: null,
                                livemode: false,
                                metadata: {
                                },
                                radar_options: {
                                },
                                type: "card",
                            },
                            type: "card_error",
                        },
                        latest_charge: "ch_3PgQFND6SqU8owGY18nat0La",
                        livemode: false,
                        metadata: {
                        },
                        next_action: null,
                        on_behalf_of: null,
                        payment_method: null,
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
                            link: {
                                persistent_token: null,
                            },
                        },
                        payment_method_types: [
                            "card",
                            "link",
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
                        status: "requires_payment_method",
                        transfer_data: null,
                        transfer_group: null,
                    },
                    payment_method: {
                        id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                            fingerprint: "2vIPq9JPFdYz8JZO",
                            funding: "credit",
                            generated_from: null,
                            last4: "0002",
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
                        created: 1721908442,
                        customer: null,
                        livemode: false,
                        metadata: {
                        },
                        radar_options: {
                        },
                        type: "card",
                    },
                    request_log_url: "https://dashboard.stripe.com/test/logs/req_DoE9rERpVndavX?t=1721908453",
                    type: "card_error",
                    headers: {
                        server: "nginx",
                        date: "Thu, 25 Jul 2024 11:54:14 GMT",
                        "content-type": "application/json",
                        "content-length": "5664",
                        connection: "keep-alive",
                        "access-control-allow-credentials": "true",
                        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
                        "access-control-allow-origin": "*",
                        "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
                        "access-control-max-age": "300",
                        "cache-control": "no-cache, no-store",
                        "content-security-policy": "report-uri https://q.stripe.com/csp-report?p=v1%2Fpayment_intents; block-all-mixed-content; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'",
                        "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
                        "idempotency-key": "stripe-node-retry-4e0f0a1d-d2c9-4f05-b8b2-1a248810b8af",
                        "original-request": "req_DoE9rERpVndavX",
                        "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"}],\"include_subdomains\":true}",
                        "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"",
                        "request-id": "req_DoE9rERpVndavX",
                        "stripe-should-retry": "false",
                        "stripe-version": "2024-06-20",
                        vary: "Origin",
                        "x-content-type-options": "nosniff",
                        "x-stripe-priority-routing-enabled": "true",
                        "x-stripe-routing-context-priority-tier": "api-testmode",
                        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
                    },
                    statusCode: 402,
                    requestId: "req_DoE9rERpVndavX",
                },
                rawType: "card_error",
                code: "card_declined",
                doc_url: "https://stripe.com/docs/error-codes/card-declined",
                param: undefined,
                detail: undefined,
                headers: {
                    server: "nginx",
                    date: "Thu, 25 Jul 2024 11:54:14 GMT",
                    "content-type": "application/json",
                    "content-length": "5664",
                    connection: "keep-alive",
                    "access-control-allow-credentials": "true",
                    "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
                    "access-control-allow-origin": "*",
                    "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
                    "access-control-max-age": "300",
                    "cache-control": "no-cache, no-store",
                    "content-security-policy": "report-uri https://q.stripe.com/csp-report?p=v1%2Fpayment_intents; block-all-mixed-content; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'",
                    "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
                    "idempotency-key": "stripe-node-retry-4e0f0a1d-d2c9-4f05-b8b2-1a248810b8af",
                    "original-request": "req_DoE9rERpVndavX",
                    "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"}],\"include_subdomains\":true}",
                    "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"",
                    "request-id": "req_DoE9rERpVndavX",
                    "stripe-should-retry": "false",
                    "stripe-version": "2024-06-20",
                    vary: "Origin",
                    "x-content-type-options": "nosniff",
                    "x-stripe-priority-routing-enabled": "true",
                    "x-stripe-routing-context-priority-tier": "api-testmode",
                    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
                },
                requestId: "req_DoE9rERpVndavX",
                statusCode: 402,
                charge: "ch_3PgQFND6SqU8owGY18nat0La",
                decline_code: "generic_decline",
                payment_intent: {
                    id: "pi_3PgQFND6SqU8owGY1BaO8DHR",
                    object: "payment_intent",
                    amount: 2506,
                    amount_capturable: 0,
                    amount_details: {
                        tip: {
                        },
                    },
                    amount_received: 0,
                    application: null,
                    application_fee_amount: null,
                    automatic_payment_methods: {
                        allow_redirects: "never",
                        enabled: true,
                    },
                    canceled_at: null,
                    cancellation_reason: null,
                    capture_method: "manual",
                    client_secret: "pi_3PgQFND6SqU8owGY1BaO8DHR_secret_xL95GHzgmHvoncXBAsxSA2lNL",
                    confirmation_method: "automatic",
                    created: 1721908453,
                    currency: "usd",
                    customer: null,
                    description: null,
                    invoice: null,
                    last_payment_error: {
                        charge: "ch_3PgQFND6SqU8owGY18nat0La",
                        code: "card_declined",
                        decline_code: "generic_decline",
                        doc_url: "https://stripe.com/docs/error-codes/card-declined",
                        message: "Your card was declined.",
                        payment_method: {
                            id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                                fingerprint: "2vIPq9JPFdYz8JZO",
                                funding: "credit",
                                generated_from: null,
                                last4: "0002",
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
                            created: 1721908442,
                            customer: null,
                            livemode: false,
                            metadata: {
                            },
                            radar_options: {
                            },
                            type: "card",
                        },
                        type: "card_error",
                    },
                    latest_charge: "ch_3PgQFND6SqU8owGY18nat0La",
                    livemode: false,
                    metadata: {
                    },
                    next_action: null,
                    on_behalf_of: null,
                    payment_method: null,
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
                        link: {
                            persistent_token: null,
                        },
                    },
                    payment_method_types: [
                        "card",
                        "link",
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
                    status: "requires_payment_method",
                    transfer_data: null,
                    transfer_group: null,
                },
                payment_method: {
                    id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                        fingerprint: "2vIPq9JPFdYz8JZO",
                        funding: "credit",
                        generated_from: null,
                        last4: "0002",
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
                    created: 1721908442,
                    customer: null,
                    livemode: false,
                    metadata: {
                    },
                    radar_options: {
                    },
                    type: "card",
                },
                payment_method_type: undefined,
                setup_intent: undefined,
                source: undefined,
            }
        */
        
        return null;
    } // try
    const result = await stripeTranslateData(paymentIntent);
    switch (result) {
        // unexpected results:
        case undefined :   // (never happened) Transaction not found.
        case 0         :   // Transaction is being processed (may be processed on customer_side or stripe_side).
        case false     : { // Transaction was deleted due to canceled.
            console.log('unexpected response: ', paymentIntent);
            throw Error('unexpected API response');
        }
        
        
        
        default:
            /*
                expected result:
                * null               : Transaction creation was denied.
                * AuthorizedFundData : Authorized for payment.
                * PaymentDetail      : Paid.
            */
            return result;
    } // switch
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
    const result = await stripeTranslateData(paymentIntent);
    switch (result) {
        // unexpected results:
        case undefined :   // (never happened) Transaction not found.
        case null      :   // Transaction creation was denied.
        case 0         :   // Transaction is being processed (may be processed on customer_side or stripe_side).
        case false     : { // Transaction was deleted due to canceled.
            console.log('unexpected response: ', paymentIntent);
            throw Error('unexpected API response');
        }
        
        
        
        default:
            // unexpected result:
            if (isAuthorizedFundData(result)) {
                // AuthorizedFundData : Authorized for payment.
                console.log('unexpected response: ', paymentIntent);
                throw Error('unexpected API response');
            } // if
            
            
            
            /*
                expected result:
                * PaymentDetail : Paid.
            */
            return result;
    } // switch
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
