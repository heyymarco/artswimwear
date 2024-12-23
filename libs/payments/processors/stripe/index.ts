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
 * @returns undefined                                  : (never happened) Transaction not found.  
 * @returns null                                       : Transaction creation was denied (for example due to a decline).  
 * @returns 0                                          : Transaction is being processed (may be processed on customer_side or stripe_side).  
 * @returns AuthorizedFundData                         : Authorized for payment.  
 * @returns [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
 * @returns false                                      : Transaction was deleted due to canceled.  
 * @returns empty_string                               : (never happened) Transaction was deleted due to expired.  
 */
export const stripeTranslateData    = async (paymentIntent: Stripe.PaymentIntent, options?: StripeTranslateDataOptions): Promise<undefined|0|null|AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|false> => {
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
                sample responses:
                './sample-responses/sample-paymentIntent-succeeded.js'
            */
            
            
            
            const [paymentMethod, paymentDetail] = await extractPaymentMethodAndDetail(paymentIntent);
            return [
                paymentDetail,
                
                
                
                (paymentMethod && paymentMethod.customer && paymentIntent.setup_future_usage) // the `setup_future_usage` prop is set
                // needs to save the paymentMethod:
                ? ((): PaymentMethodCapture => {
                    const {
                        type     : paymentMethodType,
                        id       : paymentMethodProviderId,
                        customer : paymentMethodCustomer,
                    } = paymentMethod;
                    const paymentMethodProviderCustomerId = (typeof(paymentMethodCustomer) === 'string') ? paymentMethodCustomer : paymentMethodCustomer.id;
                    return {
                        type : ((): PaymentMethodCapture['type'] => {
                            switch (paymentMethodType) {
                                case 'card'   : return 'CARD';
                                case 'paypal' : return 'PAYPAL';
                                default       : throw Error('unexpected API response');
                            } // switch
                        })(),
                        
                        paymentMethodProvider : 'STRIPE',
                        paymentMethodProviderId,
                        paymentMethodProviderCustomerId,
                    } satisfies PaymentMethodCapture;
                })()
                // no need to save the paymentMethod:
                : null,
            ] satisfies [PaymentDetail, PaymentMethodCapture|null];
        }
        
        
        
        default                        : {
            console.log('unexpected response: ', paymentIntent);
            throw Error('unexpected API response');
        }
    } // switch
}

const extractPaymentDetailPartial   = (paymentMethod: Stripe.PaymentMethod|undefined): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
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
}
const extractPaymentMethodAndDetail = async (paymentIntent: Stripe.PaymentIntent, options?: StripeTranslateDataOptions): Promise<[Stripe.PaymentMethod|undefined, PaymentDetail]> => {
    // options:
    const {
        resolveMissingFee           = false, // false by default because the operation may take quite long time
        resolveMissingPaymentMethod = true,  // true  by default because the operation can be done quickly
    } = options ?? {};
    
    
    
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
    
    
    
    return [
        paymentMethod,
        
        
        
        {
            ...extractPaymentDetailPartial(paymentMethod),
            
            amount : revertCurrencyFromStripeNominal(amount, currency),
            fee    : revertCurrencyFromStripeNominal(fee   , currency),
        } satisfies PaymentDetail,
    ] satisfies [Stripe.PaymentMethod|undefined, PaymentDetail];
}

export const stripeGetPaymentFee    = async (charge: Stripe.Charge): Promise<number|undefined> => {
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



export interface StripeSavedCard
    extends
        Pick<PaymentMethodCapture,
            |'paymentMethodProviderId'
        >
{
}

/**
 * @returns null                                       : Transaction creation was denied (for example due to a decline).  
 * @returns AuthorizedFundData                         : Authorized for payment.  
 * @returns [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
 */
export const stripeCreateOrder = async (paymentMethodOrConfirmationOrSavedCard: string|StripeSavedCard, orderId: string, options: CreateOrderOptions): Promise<AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|null> => {
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
    
    
    
    const paymentMethodToken = (
        ((typeof(paymentMethodOrConfirmationOrSavedCard) === 'string') && paymentMethodOrConfirmationOrSavedCard.startsWith('pm_'))
        ? paymentMethodOrConfirmationOrSavedCard
        : (
            (typeof(paymentMethodOrConfirmationOrSavedCard) === 'object')
            ? (paymentMethodOrConfirmationOrSavedCard satisfies StripeSavedCard).paymentMethodProviderId // a paymentMethod id wrapped in `StripeSavedCard`
            : undefined
        )
    );
    const confirmationToken  = (
        ((typeof(paymentMethodOrConfirmationOrSavedCard) === 'string') && paymentMethodOrConfirmationOrSavedCard.startsWith('ctoken_'))
        ? paymentMethodOrConfirmationOrSavedCard
        : undefined
    );
    const isUsingSavedCard   = !!paymentMethodOrConfirmationOrSavedCard && (typeof(paymentMethodOrConfirmationOrSavedCard) === 'object');
    
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
            
            
            
            capture_method            : (
                isUsingSavedCard
                ? 'automatic' // capture immediately when using savedCard
                : (paymentMethodToken ? 'manual' : undefined) // the fund must be captured on server_side
            ),
            // confirmation_method       : isConfirmationToken  ? 'manual' : undefined, // the fund must be captured on server_side // DOESN'T WORK
            
            confirm                   : true, // auto confirm because the payment_method is already provided
            payment_method            : paymentMethodToken,
            automatic_payment_methods : {
                enabled         : true,
                allow_redirects : 'never',
            },
            confirmation_token        : confirmationToken,
            return_url                : confirmationToken  ? `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${encodeURIComponent(orderId)}` : undefined,
            
            
            
            // save payment method during purchase:
            customer                  : customer?.id,
            setup_future_usage        : (customer && !isUsingSavedCard) ? 'off_session' : undefined,
            
            
            
            expand                    : [
                'latest_charge.balance_transaction',
                'payment_method',
            ],
        });
    }
    catch (error: any) {
        /*
            sample responses:
            './sample-responses/sample-paymentIntent-declined.js'
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
                * [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
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
        sample responses:
        './sample-responses/sample-setupIntent-succeeded.js'
        './sample-responses/sample-setupIntent-succeeded-3ds.js'
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
                * [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
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
        sample responses:
        './sample-responses/sample-getSetupIntent.js'
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
