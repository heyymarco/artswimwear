// models:
import {
    // types:
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    type PaymentMethodDetail,
    type PaymentMethodSetupOptions,
    type PaymentMethodSetup,
    type PaymentMethodCapture,
    
    
    
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
 * undefined                                  : (never happened) Transaction not found.  
 * null                                       : Transaction creation was denied (for example due to a decline).  
 * 0                                          : Transaction is being processed (may be processed on customer_side or stripe_side).  
 * AuthorizedFundData                         : Authorized for payment.  
 * [PaymentDetail, PaymentMethodCapture|null] : Paid.  
 * false                                      : Transaction was deleted due to canceled.  
 * empty_string                               : (never happened) Transaction was deleted due to expired.  
 */
export const stripeTranslateData = async (paymentIntent: Stripe.PaymentIntent, options?: StripeTranslateDataOptions): Promise<undefined|0|null|AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|false> => {
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
            return [
                {
                    ...paymentDetailPartial,
                    
                    amount : revertCurrencyFromStripeNominal(amount, currency),
                    fee    : revertCurrencyFromStripeNominal(fee   , currency),
                } satisfies PaymentDetail,
                
                
                
                (paymentMethod && paymentMethod.customer)
                // needs to save the paymentMethod:
                ? {
                    type                            : (() => {
                        switch (paymentMethod.type) {
                            case 'card'   : return 'CARD';
                            case 'paypal' : return 'PAYPAL';
                            default       : throw Error('unexpected API response');
                        } // switch
                    })(),
                    
                    paymentMethodProvider           : 'STRIPE',
                    paymentMethodProviderId         : paymentMethod.id,
                    paymentMethodProviderCustomerId : (typeof(paymentMethod.customer) === 'string') ? paymentMethod.customer : paymentMethod.customer.id,
                } satisfies PaymentMethodCapture
                // no need to save the paymentMethod:
                : null,
            ] as const;
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



export const stripeCreateOrder = async (cardToken: string, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|null> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const {
        currency,
        totalCostConverted,
        totalProductPriceConverted,
        totalShippingCostConverted,
        
        detailedItems,
        
        hasShippingAddress,
        shippingAddress,
        
        paymentMethodProviderCustomerId : existingPaymentMethodProviderCustomerId,
    } = options;
    
    
    
    const isPaymentMethodToken = cardToken.startsWith('pm_');
    const isConfirmationToken  = cardToken.startsWith('ctoken_');
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    try {
        const customer = (existingPaymentMethodProviderCustomerId !== undefined) ? (
            existingPaymentMethodProviderCustomerId
            ? await stripe.customers.retrieve(existingPaymentMethodProviderCustomerId)
            : await stripe.customers.create()
        ) : undefined;
        paymentIntent = await stripe.paymentIntents.create({
            metadata                  : {
                orderId               : orderId,
            },
            
            
            
            currency                  : currency.toLowerCase(),
            amount                    : convertCurrencyToStripeNominal(totalCostConverted, currency),
            
            shipping                  : (
                (hasShippingAddress && !!shippingAddress)
                ? {
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
                }
                : undefined
            ),
            
            
            
            capture_method            : isPaymentMethodToken ? 'manual' : undefined, // the fund must be captured on server_side
            // confirmation_method       : isConfirmationToken  ? 'manual' : undefined, // the fund must be captured on server_side // DOESN'T WORK
            
            confirm                   : true, // auto confirm because the payment_method is already provided
            payment_method            : isPaymentMethodToken ? cardToken : undefined,
            automatic_payment_methods : {
                enabled         : true,
                allow_redirects : 'never',
            },
            confirmation_token        : isConfirmationToken  ? cardToken : undefined,
            return_url                : isConfirmationToken  ? `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}` : undefined,
            
            
            
            // save payment method during purchase:
            customer                  : customer?.id,
            setup_future_usage        : customer ? 'off_session' : undefined,
            
            
            
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
                * null                                       : Transaction creation was denied.
                * AuthorizedFundData                         : Authorized for payment.
                * [PaymentDetail, PaymentMethodCapture|null] : Paid.
            */
            return result;
    } // switch
}
export const stripeCreatePaymentMethodSetup = async (options: PaymentMethodSetupOptions): Promise<PaymentMethodSetup|PaymentMethodCapture> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const {
        paymentMethodProviderCustomerId : existingPaymentMethodProviderCustomerId,
        cardToken,
        billingAddress,
    } = options;
    
    
    
    const customer = (
        existingPaymentMethodProviderCustomerId
        ? await stripe.customers.retrieve(existingPaymentMethodProviderCustomerId)
        : await stripe.customers.create()
    );
    const setupIntent = await stripe.setupIntents.create({
        confirm                   : true, // auto confirm because the payment_method is already provided
        payment_method            : cardToken,
        automatic_payment_methods : {
            enabled         : true,
            allow_redirects : 'never',
        },
        
        
        
        // save payment method without charging:
        customer                  : customer.id,
        usage                     : 'off_session',
        
        expand                    : [
            'payment_method',
        ],
    });
    /*
        // sample without 3DS:
        {
            id: "seti_1QTe9qD6SqU8owGYTA9PaJQ7",
            object: "setup_intent",
            application: null,
            automatic_payment_methods: {
                allow_redirects: "never",
                enabled: true,
            },
            cancellation_reason: null,
            client_secret: "seti_1QTe9qD6SqU8owGYTA9PaJQ7_secret_RMMtrLPy8YATkfY7YimOFxvJu6fOcOZ",
            created: 1733639998,
            customer: "cus_RM0eWmwlxkogKO",
            description: null,
            flow_directions: null,
            last_setup_error: null,
            latest_attempt: "setatt_1QTe9qD6SqU8owGY5xyKnn7a",
            livemode: false,
            mandate: null,
            metadata: {
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: "pm_1QTe9gD6SqU8owGYmZiu4RzF",
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
                card: {
                    mandate_options: null,
                    network: null,
                    request_three_d_secure: "automatic",
                },
            },
            payment_method_types: [
                "card",
                "link",
                "amazon_pay",
            ],
            single_use_mandate: null,
            status: "succeeded",
            usage: "off_session",
        }
    */
    /*
        // sample with 3DS:
        {
            id: "seti_1QTe7SD6SqU8owGYhmmKXdWF",
            object: "setup_intent",
            application: null,
            automatic_payment_methods: {
                allow_redirects: "never",
                enabled: true,
            },
            cancellation_reason: null,
            client_secret: "seti_1QTe7SD6SqU8owGYhmmKXdWF_secret_RMMrTOFKacskXl1vHypqn8qMsExM5NL",
            created: 1733639850,
            customer: "cus_RM0eWmwlxkogKO",
            description: null,
            flow_directions: null,
            last_setup_error: null,
            latest_attempt: "setatt_1QTe7SD6SqU8owGYzKnpuHzS",
            livemode: false,
            mandate: null,
            metadata: {
            },
            next_action: {
                type: "use_stripe_sdk",
                use_stripe_sdk: {
                    directory_server_encryption: {
                        algorithm: "RSA",
                        certificate: "-----BEGIN CERTIFICATE-----\nMIIGAzCCA+ugAwIBAgIQNyg9v/wemJMz4m18kdvt6zANBgkqhkiG9w0BAQsFADB2\nMQswCQYDVQQGEwJVUzENMAsGA1UECgwEVklTQTEvMC0GA1UECwwmVmlzYSBJbnRl\ncm5hdGlvbmFsIFNlcnZpY2UgQXNzb2NpYXRpb24xJzAlBgNVBAMMHlZpc2EgZUNv\nbW1lcmNlIElzc3VpbmcgQ0EgLSBHMjAeFw0yNDAyMjcyMjQ0MDNaFw0yNzAyMjYy\nMjQ0MDJaMIGhMRgwFgYDVQQHDA9IaWdobGFuZHMgUmFuY2gxETAPBgNVBAgMCENv\nbG9yYWRvMQswCQYDVQQGEwJVUzENMAsGA1UECgwEVklTQTEvMC0GA1UECwwmVmlz\nYSBJbnRlcm5hdGlvbmFsIFNlcnZpY2UgQXNzb2NpYXRpb24xJTAjBgNVBAMMHDNk\nczIucnNhLmVuY3J5cHRpb24udmlzYS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQCSABLI5aAnf8Cypn/sKETE+U3e3YruYzUkqNpEMH0sPMpCAW1V\n33xiklm5R0S3ZFOEzzlmL22tRyjXaB6/WJUa66ajRz2DiY8+7x5CcMJNVlwqS6OG\nTlmvXGOxPXIVz6hxCsAb7mKS7cnpGpkjVD/Oe4u8ZmeUrcPWKdeH+e5BfeWp2Iel\nh89pU4tpJ84PlPTlLjZ3TLa2OutFLsMBExcr4ipWnEcbpkzvAPBRABBVZbkWTA9i\nVM9v5MXIJGzXDsQVJEOgxm/kyQXeO3JtNytYOaQ6sQi+z9gF32plP3hsrUQ2jJ3H\nCnZmOyrHl8tQWxhAIMZ/WHogpvEGufi14eyBAgMBAAGjggFfMIIBWzAMBgNVHRMB\nAf8EAjAAMB8GA1UdIwQYMBaAFL0nYyikrlS3yCO3wTVCF+nGeF+FMGcGCCsGAQUF\nBwEBBFswWTAwBggrBgEFBQcwAoYkaHR0cDovL2Vucm9sbC52aXNhY2EuY29tL2VD\nb21tRzIuY3J0MCUGCCsGAQUFBzABhhlodHRwOi8vb2NzcC52aXNhLmNvbS9vY3Nw\nMEYGA1UdIAQ/MD0wMQYIKwYBBQUHAgEwJTAjBggrBgEFBQcCARYXaHR0cDovL3d3\ndy52aXNhLmNvbS9wa2kwCAYGZ4EDAQEBMBMGA1UdJQQMMAoGCCsGAQUFBwMCMDUG\nA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly9lbnJvbGwudmlzYWNhLmNvbS9lQ29tbUcy\nLmNybDAdBgNVHQ4EFgQU6gD/Z5m2gw4n676qt4jXOWr8ynowDgYDVR0PAQH/BAQD\nAgSwMA0GCSqGSIb3DQEBCwUAA4ICAQBumWXGS/uaaajte2gI3xCpsuewmihQKvKq\nOhaOc+wgdfwIkEAXdJIc33n2j/iaT5Lusi09ezZpBB80C6KQVr5Fs10SX0hlBCvT\n9MGYFwFtYUgi5OenqYsXc8BdmiE0bFiSXZ7XfxWuvYjis4LOubMr48yVyyEynWWb\nSGr7rTJztraOFjsykK16x946YXi/LswEP9RtDiOBNJ9cBVcOP+u8Q+dEzA5A63Ay\nA2Z/5m/pyCIWMSYGMtM0RANUp9gp7cEXaMpwKWfrW6ZanF60IoGlmRHilGU4rvm7\ntd4yJTfwxtkmh4w/IPiqI/OaXj5iG8hCo8a9FTnGahIcij8c1UWzQ3/A7o99AUwy\n1Xi9JnNiXYVM1bfQalK0DKsLqRiS6rzPfwMUxj2+ALnhcrnSdPnZgVxiQB7kvfi3\nHFXHoGhmMHHj8tlURqUQzpJcCz1QOy5c9SCc/M8Xu+eRsCnJrtvvDxriLWfDDM9M\n8/8JsiBP+DF6omCb6J4ryEulcVPnVAAZNlNtaUadPYnCJfB0p67jWkHa5NvQdZGW\naT1tvo9DqjI7zLf9Km0qqkK51gwYDnsy14pYvfeEwL9O9aepFa7x08bM3272xqNK\neGHXFK/zUVxYY5uxukcqYAdhAvx7f6d0J6Nr8jPxo6UNXKiFH9leGPPzx9oNugts\nz6qck4YdAQ==\n-----END CERTIFICATE-----\n",
                        directory_server_id: "A000000003",
                        root_certificate_authorities: [
                            "-----BEGIN CERTIFICATE-----\nMIIFqTCCA5GgAwIBAgIPUT6WAAAA20Qn7qzgvuFIMA0GCSqGSIb3DQEBCwUAMG8x\nCzAJBgNVBAYTAlVTMQ0wCwYDVQQKDARWSVNBMS8wLQYDVQQLDCZWaXNhIEludGVy\nbmF0aW9uYWwgU2VydmljZSBBc3NvY2lhdGlvbjEgMB4GA1UEAwwXVmlzYSBQdWJs\naWMgUlNBIFJvb3QgQ0EwHhcNMjEwMzE2MDAwMDAwWhcNNDEwMzE1MDAwMDAwWjBv\nMQswCQYDVQQGEwJVUzENMAsGA1UECgwEVklTQTEvMC0GA1UECwwmVmlzYSBJbnRl\ncm5hdGlvbmFsIFNlcnZpY2UgQXNzb2NpYXRpb24xIDAeBgNVBAMMF1Zpc2EgUHVi\nbGljIFJTQSBSb290IENBMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA\n2WEbXLS3gI6LOY93bP7Kz6EO9L1QXlr8l+fTkJWZldJ6QuwZ1cv4369tfjeJ8O5w\nSJiDcVw7eNdOP73LfAtwHlTnUnb0e9ILTTipc5bkNnAevocrJACsrpiQ8jBI9ttp\ncqKUeJgzW4Ie25ypirKroVD42b4E0iICK2cZ5QfD4BSzUnftp4Bqh8AfpGvG1lre\nCaD53qrsy5SUadY/NaeUGOkqdPvDSNoDIdrbExwnZaSFUmjQT1svKwMqGo2GFrgJ\n4cULEp4NNj5rga8YTTZ7Xo5MblHrLpSPOmJev30KWi/BcbvtCNYNWBTg7UMzP3cK\nMQ1pGLvG2PgvFTZSRvH3QzngJRgrDYYOJ6kj9ave+6yOOFqj80ZCuH0Nugt2mMS3\nc3+Nksaw+6H3cQPsE/Gv5zjfsKleRhEFtE1gyrdUg1DMgu8o/YhKM7FAqkXUn74z\nwoRFgx3Mi5OaGTQbg+NlwJgR4sVHXCV4s9b8PjneLhzWMn353SFARF9dnO7LDBqq\ntT6WltJu1z9x2Ze0UVNZvxKGcyCkLody29O8j9/MGZ8SOSUu4U6NHrebKuuf9Fht\nn6PqQ4ppkhy6sReXeV5NVGfVpDYY5ZAKEWqTYgMULWpQ2Py4BGpFzBe07jXkyulR\npoKvz14iXeA0oq16c94DrFYX0jmrWLeU4a/TCZQLFIsCAwEAAaNCMEAwHQYDVR0O\nBBYEFEtNpg77oBHorQvi8PMKAC+sixb7MA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0P\nAQH/BAQDAgEGMA0GCSqGSIb3DQEBCwUAA4ICAQC5BU9qQSZYPcgCp2x0Juq59kMm\nXuBly094DaEnPqvtCgwwAirkv8x8/QSOxiWWiu+nveyuR+j6Gz/fJaV4u+J5QEDy\ncfk605Mw3HIcJOeZvDgk1eyOmQwUP6Z/BdQTNJmZ92Z8dcG5yWCxLBrqPH7ro3Ss\njhYq9duIJU7jfizCJCN4W8tp0D2pWBe1/CYNswP4GMs5jQ5+ZQKN/L5JFdwVTu7X\nPt8b5zfgbmmQpVmUn0oFwm3OI++Z6gEpNmW5bd/2oUIZoG96Qff2fauVMAYiWQvN\nnL3y1gkRguTOSMVUCCiGfdvwu5ygowillvV2nHb7+YibQ9N5Z2spP0o9Zlfzoat2\n7WFpyK47TiUdu/4toarLKGZP+hbA/F4xlnM/8EfZkE1DeTTI0lhN3O8yEsHrtRl1\nOuQZ/IexHO8UGU6jvn4TWo10HYeXzrGckL7oIXfGTrjPzfY62T5HDW/BAEZS+9Tk\nijz25YM0fPPz7IdlEG+k4q4YwZ82j73Y9kDEM5423mrWorq/Bq7I5Y8v0LTY9GWH\nYrpElYf0WdOXAbsfwQiT6qnRio+p82VyqlY8Jt6VVA6CDy/iHKwcj1ELEnDQfVv9\nhedoxmnQ6xe/nK8czclu9hQJRv5Lh9gk9Q8DKK2nmgzZ8SSQ+lr3mSSeY8JOMRlE\n+RKdOQIChWthTJKh7w==\n-----END CERTIFICATE-----\n",
                        ],
                    },
                    directory_server_name: "visa",
                    merchant: "acct_1MSvtgD6SqU8owGY",
                    one_click_authn: null,
                    server_transaction_id: "e7ec5fd3-026b-4331-81b1-6626418cf5c6",
                    three_d_secure_2_source: "setatt_1QTe7SD6SqU8owGYzKnpuHzS",
                    three_ds_method_url: "",
                    three_ds_optimizations: "kf",
                    type: "stripe_3ds2_fingerprint",
                },
            },
            on_behalf_of: null,
            payment_method: "pm_1QTe7JD6SqU8owGYt2BEBeGc",
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
                card: {
                    mandate_options: null,
                    network: null,
                    request_three_d_secure: "automatic",
                },
            },
            payment_method_types: [
                "card",
                "link",
                "amazon_pay",
            ],
            single_use_mandate: null,
            status: "requires_action",
            usage: "off_session",
        }
    */
    switch (setupIntent.status) {
        case 'requires_action': return {
            paymentMethodProviderCustomerId : customer.id,
            paymentMethodSetupToken         : '',
            redirectData                    : setupIntent.client_secret ?? '', // redirectData for 3DS verification (credit_card)
        } satisfies PaymentMethodSetup;
        
        
        
        case 'succeeded': {
            if (!setupIntent.payment_method || (typeof(setupIntent.payment_method) !== 'object')) throw Error('unexpected API response');
            if (!setupIntent.customer) throw Error('unexpected API response');
            
            return {
                type                            : (() => {
                    switch (setupIntent.payment_method.type) {
                        case 'card'   : return 'CARD';
                        case 'paypal' : return 'PAYPAL';
                        default       : throw Error('unexpected API response');
                    } // switch
                })(),
                
                paymentMethodProvider           : 'STRIPE',
                paymentMethodProviderId         : setupIntent.payment_method.id,
                paymentMethodProviderCustomerId : (typeof(setupIntent.customer)       === 'string') ? setupIntent.customer       : setupIntent.customer.id,
            } satisfies PaymentMethodCapture;
        }
        
        
        
        default:
            throw Error('unexpected API response');
    } // switch
}



export const stripeCaptureFund = async (paymentId: string): Promise<[PaymentDetail, PaymentMethodCapture|null]|null> => {
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
                * null                                       : Transaction creation was denied.
                * [PaymentDetail, PaymentMethodCapture|null] : Paid.
            */
            return result;
    } // switch
}
export const stripeCapturePaymentMethod = async (vaultToken: string): Promise<PaymentMethodCapture> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const setupIntent = await stripe.setupIntents.retrieve(vaultToken, {
        expand                    : [
            'payment_method',
        ],
    });
    /*
        {
            id: "seti_1QTR9DD6SqU8owGYqa15rcX0",
            object: "setup_intent",
            application: null,
            automatic_payment_methods: {
                allow_redirects: "never",
                enabled: true,
            },
            cancellation_reason: null,
            client_secret: "seti_1QTR9DD6SqU8owGYqa15rcX0_secret_RM9SjA8bnXe8S6DF4DEFtI6tKArjCk9",
            created: 1733589987,
            customer: "cus_RM0eWmwlxkogKO",
            description: null,
            flow_directions: null,
            last_setup_error: null,
            latest_attempt: "setatt_1QTR9HD6SqU8owGYY8uEGosa",
            livemode: false,
            mandate: null,
            metadata: {
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: {
                id: "pm_1QTR99D6SqU8owGYaNZzXvFG",
                object: "payment_method",
                allow_redisplay: "unspecified",
                billing_details: {
                    address: {
                        city: null,
                        country: null,
                        line1: null,
                        line2: null,
                        postal_code: null,
                        state: null,
                    },
                    email: null,
                    name: null,
                    phone: null,
                },
                card: {
                    brand: "visa",
                    checks: {
                        address_line1_check: null,
                        address_postal_code_check: null,
                        cvc_check: "pass",
                    },
                    country: "US",
                    display_brand: "visa",
                    exp_month: 3,
                    exp_year: 2029,
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
                created: 1733589983,
                customer: "cus_RM0eWmwlxkogKO",
                livemode: false,
                metadata: {
                },
                radar_options: {
                },
                type: "card",
            },
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
                card: {
                    mandate_options: null,
                    network: null,
                    request_three_d_secure: "automatic",
                },
            },
            payment_method_types: [
                "card",
                "link",
                "amazon_pay",
            ],
            single_use_mandate: null,
            status: "succeeded",
            usage: "off_session",
        }
    */
    if (setupIntent.status !== 'succeeded') throw Error('unexpected API response');
    if (!setupIntent.payment_method || (typeof(setupIntent.payment_method) !== 'object')) throw Error('unexpected API response');
    if (!setupIntent.customer) throw Error('unexpected API response');
    
    const paymentMethodProviderId = setupIntent.payment_method.id;
    const paymentMethodProviderCustomerId = (
        (typeof(setupIntent.customer) === 'string')
        ? setupIntent.customer
        : setupIntent.customer.id
    );
    return {
        type                            : (() => {
            switch (setupIntent.payment_method.type) {
                case 'card'   : return 'CARD';
                case 'paypal' : return 'PAYPAL';
                default       : throw Error('unexpected API response');
            } // switch
        })(),
        
        paymentMethodProvider : 'STRIPE',
        paymentMethodProviderId,
        paymentMethodProviderCustomerId,
    } satisfies PaymentMethodCapture;
}


export const stripeListPaymentMethods = async (stripeCustomerId: string, limitMax: number): Promise<Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    
    const paymentMethodList = await stripe.customers.listPaymentMethods(stripeCustomerId, { type: 'card', limit: limitMax });
    return new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>(
        paymentMethodList.data
        .map((paymentMethod): [string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>]|null => {
            const {
                id,
                billing_details : {
                    address : billingAddress,
                    name    : billingName,
                    phone   : billingPhone,
                },
            } = paymentMethod;
            const key = `STRIPE/${id}`;
            
            
            
            const card = paymentMethod.card;
            if (card) {
                const {
                    brand,
                    last4,
                    exp_month,
                    exp_year,
                } = card;
                
                
                
                return [
                    key,
                    {
                        type           : 'CARD',
                        
                        brand          : brand,
                        identifier     : last4,
                        expiresAt      : new Date(Date.UTC(exp_year, exp_month - 1)),
                        
                        billingAddress : (!billingAddress || !billingAddress.country || !billingAddress.state || !billingAddress.city || !billingAddress.line1) ? null : (() => {
                            const {
                                country,
                                state,
                                city,
                                postal_code,
                                line1,
                                line2,
                            } = billingAddress;
                            return {
                                country   : `${country}`.toUpperCase(),
                                state     : state ?? '',
                                city      : city  ?? '',
                                zip       : postal_code ?? '',
                                address   : (line1 ?? '') + (line2 ? ` ${line2}` : ''),
                                
                                firstName : !billingName ? '' : billingName.split(/\s+/)?.[0] ?? '',
                                lastName  : !billingName ? '' : billingName.split(/\s+/).slice(1).join(' '),
                                phone     : billingPhone ?? '',
                            };
                        })(),
                    },
                ];
            } // if
            
            
            
            return null;
        })
        .filter((item): item is Exclude<typeof item, null> => (item !== null))
    );
}
export const stripeDeletePaymentMethod = async (stripePaymentMethodId: string): Promise<void> => {
    if (!stripe) throw Error('stripe is not loaded');
    
    
    try {
        await stripe.paymentMethods.detach(stripePaymentMethodId);
    }
    catch {
        // ignore any error
    } // try
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
