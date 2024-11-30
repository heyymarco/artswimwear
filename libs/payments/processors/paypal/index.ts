// models:
import {
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    type PaymentMethodDetail,
    
    type PaymentMethodTokenDetail,
}                           from '@/models'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// utilities:
const paypalBaseUrl = {
    sandbox    : 'https://api-m.sandbox.paypal.com',
    production : 'https://api-m.paypal.com',
};
const paypalUrl = (paypalBaseUrl?.[(process.env.PAYPAL_ENV ?? 'sandbox') as keyof typeof paypalBaseUrl] ?? paypalBaseUrl.sandbox); // TODO: auto switch development vs production



/**
 * Access token is used to authenticate all REST API requests.
 */
const paypalCreateAccessToken  = async () => {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${paypalUrl}/v1/oauth2/token`, {
        method  : 'POST',
        headers : {
            'Authorization'   : `Basic ${auth}`,
        },
        body    : 'grant_type=client_credentials',
    });
    const accessTokenData = await response.json();
    /*
        example:
        {
            scope: 'https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/vault/payment-tokens/read https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller Braintree:Vault https://uri.paypal.com/services/payments/refund https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://uri.paypal.com/services/vault/payment-tokens/readwrite https://api.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks',
            access_token: 'A21AAJtSdh1lInhuRhSzhQrp35cEQ1Ew9imFtfvQmLCMDsBGdtCClFfWOp9p5pV4p1mkaA5Ota7KvHo7lleeyWF1nE0snjKBA',
            token_type: 'Bearer',
            app_id: 'APP-80W284485P519543T',
            expires_in: 32400, // seconds
            nonce: '2023-03-14T05:52:06Z8D_KHLLcduIuH9NK9MWNlskEse56LZtAEkvtDncxcEU'
        }
    */
    console.log('created: accessTokenData');
    // console.log('created: accessTokenData: ', accessTokenData);
    if (!accessTokenData || accessTokenData.error) throw accessTokenData?.error_description ?? accessTokenData?.error ?? Error('Fetch access token failed.');
    return accessTokenData.access_token;
}

const paypalHandleResponse       = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

export const paypalCreateOrder = async (options: CreateOrderOptions): Promise<AuthorizedFundData> => {
    const {
        currency,
        totalCostConverted,
        totalProductPriceConverted,
        totalShippingCostConverted,
        
        detailedItems,
        
        hasShippingAddress,
        shippingAddress,
        
        hasBillingAddress,
        billingAddress,
    } = options;
    
    
    
    const paypalResponse = await fetch(`${paypalUrl}/v2/checkout/orders`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
        body    : JSON.stringify({
            // intent enum required
            // The intent to either capture payment immediately or authorize a payment for an order after order creation.
            // The possible values are: 'CAPTURE'|'AUTHORIZE'
            intent                        : 'CAPTURE',
            
            // purchase_units array (contains the purchase_unit_request object) required
            purchase_units                : [{ // array of contract between a payer and the payee, in the case of this commerce order -- only ONE contract for ONE order
                // amount Money required
                amount                    : {
                    // currency_code string required
                    // The three-character ISO-4217 currency code that identifies the currency.
                    currency_code         : currency,
                    
                    // value string required
                    /*
                        The value, which might be:
                        * An integer for currencies like JPY that are not typically fractional.
                        * A decimal fraction for currencies like TND that are subdivided into thousandths.
                    */
                    value                 : totalCostConverted,
                    
                    // breakdown object|undefined
                    // The breakdown of the amount. Breakdown provides details such as total item amount, total tax amount, shipping, handling, insurance, and discounts, if any.
                    breakdown             : {
                        // discount Money|undefined
                        // The discount for all items within a given purchase_unit. discount.value can not be a negative number.
                        discount          : undefined,
                        
                        // handling Money|undefined
                        // The handling fee for all items within a given purchase_unit. handling.value can not be a negative number.
                        handling          : undefined,
                        
                        // insurance Money|undefined
                        // The insurance fee for all items within a given purchase_unit. insurance.value can not be a negative number.
                        insurance         : undefined,
                        
                        // item_total Money|undefined
                        // The subtotal for all items. Required if the request includes purchase_units[].items[].unit_amount. Must equal the sum of (items[].unit_amount * items[].quantity) for all items. item_total.value can not be a negative number.
                        item_total        : {
                            currency_code : currency,
                            value         : totalProductPriceConverted,
                        },
                        
                        // shipping Money|undefined
                        // The shipping fee for all items within a given purchase_unit. shipping.value can not be a negative number.
                        shipping          : (totalShippingCostConverted === null) ? undefined : {
                            currency_code : currency,
                            value         : totalShippingCostConverted,
                        },
                        
                        // shipping_discount Money|undefined
                        // The shipping discount for all items within a given purchase_unit. shipping_discount.value can not be a negative number
                        shipping_discount : undefined,
                        
                        // tax_total Money|undefined
                        // The total tax for all items. Required if the request includes purchase_units.items.tax. Must equal the sum of (items[].tax * items[].quantity) for all items. tax_total.value can not be a negative number.
                        tax_total         : undefined,
                    },
                },
                
                // invoice_id string|undefined
                // The API caller-provided external invoice number for this order. Appears in both the payer's transaction history and the emails that the payer receives.
                invoice_id                : undefined,
                
                // custom_id string|undefined
                // The API caller-provided external ID. Used to reconcile client transactions with Paypal transactions. Appears in transaction and settlement reports but is not visible to the payer.
                custom_id                 : undefined,
                
                // description string|undefined
                // The purchase description.
                description               : undefined,
                
                // items array (contains the item object)
                // An array of items that the customer purchases from the merchant.
                items                     : detailedItems.map((detailedItem) => ({
                    // name string required
                    // The item name or title.
                    name                  : detailedItem.productName + (!detailedItem.variantNames.length ? '' : ` (${detailedItem.variantNames.join(', ')})`),
                    
                    // unit_amount Money required
                    // The item price or rate per unit.
                    unit_amount           : {
                        // currency_code string required
                        // The three-character ISO-4217 currency code that identifies the currency.
                        currency_code     : currency,
                        
                        // value string required
                        /*
                            The value, which might be:
                            * An integer for currencies like JPY that are not typically fractional.
                            * A decimal fraction for currencies like TND that are subdivided into thousandths.
                        */
                        value             : detailedItem.priceConverted,
                    },
                    
                    // quantity string required
                    // The item quantity. Must be a whole number.
                    quantity              : detailedItem.quantity,
                    
                    // category enum|undefined
                    // The item category type.
                    // The possible values are: 'DIGITAL_GOODS'|'PHYSICAL_GOODS'|'DONATION'
                    category              : hasShippingAddress ? 'PHYSICAL_GOODS' : 'DIGITAL_GOODS',
                    
                    // description string|undefined
                    // The detailed item description.
                    description           : undefined,
                    
                    // sku string|undefined
                    // The stock keeping unit (SKU) for the item.
                    sku                   : undefined,
                    
                    // tax object|undefined
                    // The item tax for each unit.
                    tax                   : undefined,
                })),
                
                // payee object|undefined
                payee                     : {
                    // email_address string|undefined
                    // The email address of merchant.
                    email_address         : undefined,
                    
                    // merchant_id string
                    // The encrypted Paypal account ID of the merchant.
                    merchant_id           : undefined,
                },
                
                // shipping object|undefined
                // The name and address of the person to whom to ship the items.
                shipping                  : (
                    (hasShippingAddress && !!shippingAddress)
                    ? {
                        // address object|undefined
                        // The address of the person to whom to ship the items.
                        address               : {
                            // country_code string required
                            // The two-character ISO 3166-1 code that identifies the country or region.
                            country_code      : shippingAddress.country,
                            
                            // admin_area_1 string|undefined
                            // The highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision. Format for postal delivery. For example, CA and not California.
                            /*
                                Value, by country, is:
                                * UK. A county.
                                * US. A state.
                                * Canada. A province.
                                * Japan. A prefecture.
                                * Switzerland. A kanton.
                            */
                            admin_area_1      : shippingAddress.state,
                            
                            // admin_area_2 string|undefined
                            // A city, town, or village.
                            admin_area_2      : shippingAddress.city,
                            
                            // postal_code string
                            // The postal code, which is the zip code or equivalent. Typically required for countries with a postal code or an equivalent.
                            postal_code       : shippingAddress.zip,
                            
                            // address_line_1 string|undefined
                            // The first line of the address. For example, number or street. For example, 173 Drury Lane.
                            // Required for data entry and compliance and risk checks. Must contain the full address.
                            address_line_1    : shippingAddress.address,
                            
                            // address_line_2 string|undefined
                            // The second line of the address. For example, suite or apartment number.
                            address_line_2    : undefined,
                        },
                        
                        // name object|undefined
                        // The name of the person to whom to ship the items. Supports only the full_name property.
                        name                  : {
                            // full_name string
                            // When the party is a person, the party's full name.
                            full_name         : `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                        },
                        
                        // type enum|undefined
                        // The method by which the payer wants to get their items from the payee e.g shipping, in-person pickup. Either type or options but not both may be present.
                        // The possible values are: 'SHIPPING'|'PICKUP_IN_PERSON'
                        type                  : 'SHIPPING',
                    }
                    : undefined
                ),
                
                // soft_descriptor string|undefined
                // The soft descriptor is the dynamic text used to construct the statement descriptor that appears on a payer's card statement.
                // If an Order is paid using the "Paypal Wallet", the statement descriptor will appear in following format on the payer's card statement: PAYPAL_prefix+(space)+merchant_descriptor+(space)+ soft_descriptor
                soft_descriptor           : undefined,
            }],
            
            
            
            payment_source: {
                card : {
                    billing_address : (
                        (hasBillingAddress && !!billingAddress)
                        ? {
                            // country_code string required
                            // The two-character ISO 3166-1 code that identifies the country or region.
                            country_code      : billingAddress.country,
                            
                            // admin_area_1 string|undefined
                            // The highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision. Format for postal delivery. For example, CA and not California.
                            /*
                                Value, by country, is:
                                * UK. A county.
                                * US. A state.
                                * Canada. A province.
                                * Japan. A prefecture.
                                * Switzerland. A kanton.
                            */
                            admin_area_1      : billingAddress.state,
                            
                            // admin_area_2 string|undefined
                            // A city, town, or village.
                            admin_area_2      : billingAddress.city,
                            
                            // postal_code string
                            // The postal code, which is the zip code or equivalent. Typically required for countries with a postal code or an equivalent.
                            postal_code       : billingAddress.zip,
                            
                            // address_line_1 string|undefined
                            // The first line of the address. For example, number or street. For example, 173 Drury Lane.
                            // Required for data entry and compliance and risk checks. Must contain the full address.
                            address_line_1    : billingAddress.address,
                            
                            // address_line_2 string|undefined
                            // The second line of the address. For example, suite or apartment number.
                            address_line_2    : undefined,
                        }
                        : undefined
                    ),
                    
                    
                    
                    attributes : {
                        verification : {
                            // UNCOMMENT to test 3DS scenario:
                            // method: 'SCA_ALWAYS', // triggers 3D Secure for every transaction, regardless of SCA requirements.
                            
                            method : 'SCA_WHEN_REQUIRED', // triggers 3D Secure contingency when it is a mandate in the region where you operate
                        },
                        
                        
                        
                        // TODO: save payment method during purchase:
                        // customer : isExistingCustomer ? {
                        //     id : 'Paypal-generated customer id',
                        // } : undefined,
                        // vault : {
                        //     store_in_vault : 'ON_SUCCESS',
                        // },
                    },
                },
                
                
                
                // paypal : {
                //     experience_context : {
                //         // doesn't work:
                //         // shipping_preference : hasShippingAddress ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
                //         shipping_preference : 'NO_SHIPPING', // if has shipping adress => the shipping address is editable in app only
                //     },
                // },
            },
            
            
            
            application_context : {
                brand_name          : checkoutConfigServer.business.name || undefined,
                
                // doesn't work too:
                // shipping_preference : hasShippingAddress ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
                shipping_preference : 'NO_SHIPPING', // if has shipping adress => the shipping address is editable in app only
            },
        }),
    });
    const paypalOrderData = await paypalHandleResponse(paypalResponse);
    /*
        example:
        {
            id: '4AM48902TR915910H',
            status: 'CREATED',
            links: [
                {
                    href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H',
                    rel: 'self',
                    method: 'GET'
                },
                {
                    href: 'https://www.sandbox.paypal.com/checkoutnow?token=4AM48902TR915910H',
                    rel: 'approve',
                    method: 'GET'
                },
                {
                    href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H',
                    rel: 'update',
                    method: 'PATCH'
                },
                {
                    href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4AM48902TR915910H/capture',
                    rel: 'capture',
                    method: 'POST'
                }
            ]
        }
    */
    if ((paypalOrderData?.status !== 'CREATED')) {
        // TODO: log unexpected response
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    
    const paymentId   = paypalOrderData?.id;
    if ((typeof(paymentId) !== 'string') || !paymentId) {
        // TODO: log unexpected response
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    
    
    
    /*
        The merchant needs to redirect the payer back to Paypal to complete 3D Secure authentication.
        
        To trigger the authentication:
        1. Redirect the buyer to the "rel": "payer-action" HATEOAS link returned as part of the response before authorizing or capturing the order.
        2. Append "redirect_uri" to the payer-action URL so that Paypal returns the payer to the merchant's checkout page after they complete 3D Secure authentication.
        
        Sample URL:
        https://example.com/webapp/myshop?action=verify&flow=3ds&cart_id=ORDER-ID&redirect_uri=MERCHANT-LANDING-PAGE
    */
    
    
    
    return {
        paymentId,
        redirectData : undefined, // no redirectData required but require a `paypalCaptureFund()` to capture the fund
    } satisfies AuthorizedFundData;
}
export const paypalCreateSetupPayment = async (): Promise<string> => {
    const paypalResponse = await fetch(`${paypalUrl}/v3/vault/setup-tokens`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
        body    : JSON.stringify({
            payment_source: {
                card : {
                    attributes : {
                        verification : {
                            // UNCOMMENT to test 3DS scenario:
                            // method: 'SCA_ALWAYS', // triggers 3D Secure for every transaction, regardless of SCA requirements.
                            
                            method : 'SCA_WHEN_REQUIRED', // triggers 3D Secure contingency when it is a mandate in the region where you operate
                        },
                        
                        
                        
                        // TODO: save payment method during purchase:
                        // customer : isExistingCustomer ? {
                        //     id : 'Paypal-generated customer id',
                        // } : undefined,
                        // vault : {
                        //     store_in_vault : 'ON_SUCCESS',
                        // },
                    },
                },
                
                
                
                // paypal : {
                //     experience_context : {
                //         // doesn't work:
                //         // shipping_preference : hasShippingAddress ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
                //         shipping_preference : 'NO_SHIPPING', // if has shipping adress => the shipping address is editable in app only
                //     },
                // },
            },
            
            
            
            application_context : {
                brand_name          : checkoutConfigServer.business.name || undefined,
                
                // doesn't work too:
                // shipping_preference : hasShippingAddress ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
                shipping_preference : 'NO_SHIPPING', // if has shipping adress => the shipping address is editable in app only
            },
        }),
    });
    const paypalOrderData = await paypalHandleResponse(paypalResponse);
    /*
        example:
        {
            id: "3GE0311150974704P",
            customer: {
                id: "eoKqXUaRLi",
            },
            status: "CREATED",
            payment_source: {
                card: {
                },
            },
            links: [
                {
                    href: "https://api.sandbox.paypal.com/v3/vault/setup-tokens/3GE0311150974704P",
                    rel: "self",
                    method: "GET",
                    encType: "application/json",
                },
            ],
        }
    */
    if ((paypalOrderData?.status !== 'CREATED')) {
        // TODO: log unexpected response
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    const {
        id : setupToken,
    } = paypalOrderData;
    if (typeof(setupToken) !== 'string') {
        // TODO: log unexpected response
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    return setupToken;
}

export const paypalCaptureFund = async (paymentId: string): Promise<PaymentDetail|null> => {
    const response = await fetch(`${paypalUrl}/v2/checkout/orders/${paymentId}/capture`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
    });
    const paypalPaymentData = await paypalHandleResponse(response);
    /*
        example:
        {
            "id": "3VR64557R6628232K",
            "status": "COMPLETED",
            "payment_source": {
                "card": {
                    "last_digits": "8431",
                    "brand": "AMEX",
                    "type": "CREDIT"
                },
                
                // TODO: if exists and `payment_source.card.attributes.vault.status === 'VAULTED'`, store `payment_source.card.attributes.vault.id` and `payment_source.card.attributes.vault.customer.id` to the database
                // OTHERWISE, when `payment_source.card.attributes.vault.status === 'APPROVED'`, neither the `payment_source.card.attributes.vault.id` nor `payment_source.card.attributes.vault.customer.id` is not received immediately
                // The `VAULT.PAYMENT-TOKEN.CREATED` will be sent to webhook
                attributes : {
                    vault : {
                        id : 'nkq2y9g',
                        customer : {
                            id: '695922590',
                        },
                        status : 'VAULTED',
                        links : [
                            {
                                "href": "https://api-m.sandbox.paypal.com/v3/vault/payment-tokens/nkq2y9g",
                                "rel": "self",
                                "method": "GET"
                            },
                            {
                                "href": "https://api-m.sandbox.paypal.com/v3/vault/payment-tokens/nkq2y9g",
                                "rel": "delete",
                                "method": "DELETE"
                            },
                            {
                                "href": "https://api-m.sandbox.paypal.com/v2/checkout/orders/5O190127TN364715T",
                                "rel": "up",
                                "method": "GET"
                            },
                        ],
                    },
                },
            },
            "purchase_units": [
                {
                    "reference_id": "default",
                    "shipping": {
                        "name": {
                            "full_name": "Yunus Kurniawan"
                        },
                        "address": {
                            "address_line_1": "Jl Monjali Gang Temulawak no 26",
                            "admin_area_2": "Sleman",
                            "admin_area_1": "Yogyakarta",
                            "postal_code": "55284",
                            "country_code": "ID"
                        }
                    },
                    "payments": {
                        "captures": [
                            {
                                "id": "24H17413S3123762P",
                                "status": "COMPLETED",
                                "amount": {
                                    "currency_code": "USD",
                                    "value": "772.72"
                                },
                                "final_capture": true,
                                "disbursement_mode": "INSTANT",
                                "seller_protection": {
                                    "status": "NOT_ELIGIBLE"
                                },
                                "seller_receivable_breakdown": {
                                    "gross_amount": {
                                        "currency_code": "USD",
                                        "value": "772.72"
                                    },
                                    "paypal_fee": {
                                        "currency_code": "USD",
                                        "value": "32.09"
                                    },
                                    "net_amount": {
                                        "currency_code": "USD",
                                        "value": "740.63"
                                    }
                                },
                                "links": [
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/payments/captures/24H17413S3123762P",
                                        "rel": "self",
                                        "method": "GET"
                                    },
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/payments/captures/24H17413S3123762P/refund",
                                        "rel": "refund",
                                        "method": "POST"
                                    },
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/checkout/orders/3VR64557R6628232K",
                                        "rel": "up",
                                        "method": "GET"
                                    }
                                ],
                                "create_time": "2023-03-18T11:39:49Z",
                                "update_time": "2023-03-18T11:39:49Z",
                                "processor_response": {
                                    "avs_code": "A",
                                    "cvv_code": "U",
                                    "response_code": "0000"
                                }
                            }
                        ]
                    }
                }
            ],
            "links": [
                {
                    "href": "https://api.sandbox.paypal.com/v2/checkout/orders/3VR64557R6628232K",
                    "rel": "self",
                    "method": "GET"
                }
            ]
        }
        
        example:
        {
            "id": "314769333S968980X",
            "status": "COMPLETED",
            "payment_source": {
                "paypal": {
                    "email_address": "sb-fsqwb25273882@personal.example.com",
                    "account_id": "6UZV9866JZEPA",
                    "name": {
                        "given_name": "John",
                        "surname": "Doe"
                    },
                    "address": {
                        "country_code": "ID"
                    }
                }
            },
            "purchase_units": [
                {
                    "reference_id": "default",
                    "shipping": {
                        "name": {
                            "full_name": "Yunus Kurniawan"
                        },
                        "address": {
                            "address_line_1": "Jl Monjali Gang Temulawak no 26",
                            "admin_area_2": "Sleman",
                            "admin_area_1": "Yogyakarta",
                            "postal_code": "55284",
                            "country_code": "ID"
                        }
                    },
                    "payments": {
                        "captures": [
                            {
                                "id": "60C01638HN2535717",
                                "status": "COMPLETED",
                                "amount": {
                                    "currency_code": "USD",
                                    "value": "772.72"
                                },
                                "final_capture": true,
                                "disbursement_mode": "INSTANT",
                                "seller_protection": {
                                    "status": "ELIGIBLE",
                                    "dispute_categories": [
                                        "ITEM_NOT_RECEIVED",
                                        "UNAUTHORIZED_TRANSACTION"
                                    ]
                                },
                                "seller_receivable_breakdown": {
                                    "gross_amount": {
                                        "currency_code": "USD",
                                        "value": "772.72"
                                    },
                                    "paypal_fee": {
                                        "currency_code": "USD",
                                        "value": "39.05"
                                    },
                                    "net_amount": {
                                        "currency_code": "USD",
                                        "value": "733.67"
                                    }
                                },
                                "links": [
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/payments/captures/60C01638HN2535717",
                                        "rel": "self",
                                        "method": "GET"
                                    },
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/payments/captures/60C01638HN2535717/refund",
                                        "rel": "refund",
                                        "method": "POST"
                                    },
                                    {
                                        "href": "https://api.sandbox.paypal.com/v2/checkout/orders/314769333S968980X",
                                        "rel": "up",
                                        "method": "GET"
                                    }
                                ],
                                "create_time": "2023-03-18T11:36:29Z",
                                "update_time": "2023-03-18T11:36:29Z"
                            }
                        ]
                    }
                }
            ],
            "payer": {
                "name": {
                    "given_name": "John",
                    "surname": "Doe"
                },
                "email_address": "sb-fsqwb25273882@personal.example.com",
                "payer_id": "6UZV9866JZEPA",
                "address": {
                    "country_code": "ID"
                }
            },
            "links": [
                {
                    "href": "https://api.sandbox.paypal.com/v2/checkout/orders/314769333S968980X",
                    "rel": "self",
                    "method": "GET"
                }
            ]
        }
    */
    console.log('capture: paypalPaymentData: ', paypalPaymentData);
    const captureData = paypalPaymentData.purchase_units?.[0]?.payments?.captures?.[0];
    console.log('captureData : ', captureData);
    console.log('captureData.status : ', captureData?.status);
    
    
    
    // if (paymentAmountCurrency !== paymentFeeCurrency) throw Error('unexpected API response');
    
    
    
    switch (captureData?.status) {
        case 'COMPLETED' : {
            const paymentBreakdown = captureData?.seller_receivable_breakdown;
            // const paymentAmountCurrency : string = paymentBreakdown?.gross_amount?.currency_code || '';
            const amount    = Number.parseFloat(paymentBreakdown?.gross_amount?.value);
            // const paymentFeeCurrency    : string = paymentBreakdown?.paypal_fee?.currency_code || '';
            const fee       = Number.parseFloat(paymentBreakdown?.paypal_fee?.value);
            
            return {
                ...((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
                    const paymentSource = paypalPaymentData.payment_source;
                    
                    
                    
                    /* PAY WITH CARD */
                    const card = paymentSource?.card;
                    if (card) {
                        return {
                            type       : 'CARD',
                            brand      : card.brand?.toLowerCase() ?? null,
                            identifier : card.last_digits ? `ending with ${card.last_digits}` : null,
                        };
                    } // if
                    
                    
                    
                    /* PAY WITH PAYPAL */
                    const paypal = paymentSource?.paypal;
                    if (paypal) {
                        return {
                            type       : 'PAYPAL',
                            brand      : 'paypal',
                            identifier : paypal.email_address || null,
                        };
                    } // if
                    
                    
                    
                    /* PAY WITH OTHER */
                    return {
                        type       : 'CUSTOM',
                        brand      : null,
                        identifier : null,
                    };
                })(),
                
                amount,
                fee,
            } satisfies PaymentDetail;
        }
        
        case 'DECLINED'  : {
            return null;
        }
        
        default          : {
            // TODO: log unexpected response
            console.log('unexpected response: ', paypalPaymentData, captureData);
            throw Error('unexpected API response');
        }
    } // switch
}
export const paypalCapturePaymentMethod = async (vaultToken: string, paypalCustomerId?: string): Promise<PaymentMethodTokenDetail> => {
    const response = await fetch(`${paypalUrl}/v3/vault/payment-tokens`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
        body    : JSON.stringify({
            payment_source: {
                token : {
                    type : 'SETUP_TOKEN',
                    id   : vaultToken,
                },
            },
            customer : (paypalCustomerId === undefined) ? undefined : { // create a new customer -or- pass the existing customer
                id : paypalCustomerId,
            },
        }),
    });
    const paypalPaymentData = await paypalHandleResponse(response);
    /*
        {
            id: "7tc409525d432030y",
            customer: {
                id: "VecXibSgbC",
            },
            payment_source: {
                card: {
                    name: "John Doe",
                    last_digits: "6961",
                    brand: "AMEX",
                    expiry: "2025-01",
                },
            },
            links: [
                {
                    href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/7tc409525d432030y",
                    rel: "self",
                    method: "GET",
                    encType: "application/json",
                },
                {
                    href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/7tc409525d432030y",
                    rel: "delete",
                    method: "DELETE",
                    encType: "application/json",
                },
            ],
        }
    */
    const {
        id : providerPaymentMethodId,
        customer : {
            id : providerCustomerId,
        },
    } = paypalPaymentData;
    if ((typeof(providerPaymentMethodId) !== 'string') || (typeof(providerCustomerId) !== 'string')) {
        // TODO: log unexpected response
        console.log('unexpected response: ', paypalPaymentData);
        throw Error('unexpected API response');
    } // if
    return {
        providerCustomerId,
        providerPaymentMethodId,
    } satisfies PaymentMethodTokenDetail;
}


export const paypalListPaymentMethods = async (paypalCustomerId: string): Promise<Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>> => {
    const response = await fetch(`${paypalUrl}/v3/vault/payment-tokens?page=1&page_size=20&customer_id=${encodeURIComponent(paypalCustomerId)}`, {
        method  : 'GET',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
    });
    const paypalPaymentMethodsData = await paypalHandleResponse(response);
    /*
        example:
        {
            "customer": {
                "id": "BygeLlrpZF",
                "merchant_customer_id": "customer@merchant.com"
            },
            "payment_tokens": [
                {
                    "id": "8kk8451t",
                    "customer": {
                        "id": "BygeLlrpZF"
                    },
                    "payment_source": {
                        "card": {
                            "name": "John Doe",
                            "brand": "VISA",
                            "last_digits": "1111",
                            "expiry": "2027-02",
                            "billing_address": {
                                "id": "kk",
                                "address_line_1": "2211 N First Street",
                                "address_line_2": "17.3.160",
                                "admin_area_2": "San Jose",
                                "admin_area_1": "CA",
                                "postal_code": "95131",
                                "country_code": "US"
                            }
                        }
                    },
                    "links": [
                        {
                            "rel": "self",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk8451t",
                            "method": "GET",
                            "encType": "application/json"
                        },
                        {
                            "rel": "delete",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk8451t",
                            "method": "DELETE",
                            "encType": "application/json"
                        }
                    ]
                },
                {
                    "id": "fgh6561t",
                    "customer": {
                        "id": "BygeLlrpZF"
                    },
                    "payment_source": {
                        "paypal": {
                            "description": "Description for PayPal to be shown to PayPal payer",
                            "email_address": "john.doe@example.com",
                            "account_id": "VYYFH3WJ4JPJQ",
                            "shipping": {
                                "name": {
                                    "full_name": "John Doe"
                                },
                                "address": {
                                    "address_line_1": "2211 N First Street",
                                    "address_line_2": "17.3.160",
                                    "admin_area_2": "San Jose",
                                    "admin_area_1": "CA",
                                    "postal_code": "95131",
                                    "country_code": "US"
                                }
                            },
                            "usage_pattern": "IMMEDIATE",
                            "usage_type": "MERCHANT",
                            "customer_type": "CONSUMER",
                            "name": {
                                "given_name": "John",
                                "surname": "Doe"
                            },
                            "address": {
                                "address_line_1": "2211 N First Street",
                                "address_line_2": "17.3.160",
                                "admin_area_2": "San Jose",
                                "admin_area_1": "CA",
                                "postal_code": "95131",
                                "country_code": "US"
                            }
                        }
                    },
                    "links": [
                        {
                            "rel": "self",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/fgh6561t",
                            "method": "GET",
                            "encType": "application/json"
                        },
                        {
                            "rel": "delete",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/fgh6561t",
                            "method": "DELETE",
                            "encType": "application/json"
                        }
                    ]
                },
                {
                    "id": "hg654s1t",
                    "customer": {
                        "id": "BygeLlrpZF"
                    },
                    "payment_source": {
                        "venmo": {
                            "description": "Description for Venmo to be shown to Venmo payer",
                            "shipping": {
                                "name": {
                                    "full_name": "John Doe"
                                },
                                "address": {
                                    "address_line_1": "2211 N First Street",
                                    "address_line_2": "17.3.160",
                                    "admin_area_2": "San Jose",
                                    "admin_area_1": "CA",
                                    "postal_code": "95131",
                                    "country_code": "US"
                                }
                            },
                            "usage_pattern": "IMMEDIATE",
                            "usage_type": "MERCHANT",
                            "customer_type": "CONSUMER",
                            "email_address": "john.doe@example.com",
                            "user_name": "johndoe",
                            "name": {
                                "given_name": "John",
                                "surname": "Doe"
                            },
                            "account_id": "VYYFH3WJ4JPJQ",
                            "address": {
                                "address_line_1": "PayPal",
                                "address_line_2": "2211 North 1st Street",
                                "admin_area_1": "CA",
                                "admin_area_2": "San Jose",
                                "postal_code": "96112",
                                "country_code": "US"
                            }
                        }
                    },
                    "links": [
                        {
                            "rel": "self",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/hg654s1t",
                            "method": "GET",
                            "encType": "application/json"
                        },
                        {
                            "rel": "delete",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/hg654s1t",
                            "method": "DELETE",
                            "encType": "application/json"
                        }
                    ]
                },
                {
                    "id": "8kk8457",
                    "payment_source": {
                        "apple_pay": {
                            "card": {
                                "name": "John Doe",
                                "last_digits": "1111",
                                "type": "CREDIT",
                                "brand": "VISA",
                                "billing_address": {
                                    "address_line_1": "2211 N First Street",
                                    "address_line_2": "17.3.160",
                                    "admin_area_1": "CA",
                                    "admin_area_2": "San Jose",
                                    "postal_code": "95131",
                                    "country_code": "US"
                                }
                            }
                        }
                    },
                    "links": [
                        {
                            "rel": "self",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk845",
                            "method": "GET"
                        },
                        {
                            "rel": "delete",
                            "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk845",
                            "method": "DELETE"
                        }
                    ]
                }
            ],
            "links": [
                {
                    "rel": "self",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
                    "method": "GET",
                    "encType": "application/json"
                },
                {
                    "rel": "first",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
                    "method": "GET",
                    "encType": "application/json"
                },
                {
                    "rel": "last",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
                    "method": "GET",
                    "encType": "application/json"
                }
            ]
        }
    */
    
    
    
    const paymentTokens = paypalPaymentMethodsData.payment_tokens as any[];
    return new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>(
        paymentTokens
        .map((paymentToken): [string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>]|null => {
            const {
                id,
                payment_source,
            } = paymentToken;
            const identifier = `PAYPAL/${id}`;
            
            
            
            const card = payment_source.card;
            if (card) {
                const {
                    brand,
                    last_digits,
                    expiry,
                    
                    billing_address : {
                        country_code,
                        admin_area_1,
                        admin_area_2,
                        postal_code,
                        address_line_1,
                        address_line_2,
                    },
                } = card;
                
                
                
                return [
                    identifier,
                    {
                        type           : 'CARD',
                        
                        brand          : brand,
                        identifier     : last_digits,
                        expiresAt      : new Date(Date.parse(expiry)),
                        
                        billingAddress : {
                            country   : `${country_code}`.toUpperCase(),
                            state     : admin_area_1,
                            city      : admin_area_2,
                            zip       : postal_code,
                            address   : address_line_1 + (address_line_2 ? ` ${address_line_2}` : ''),
                            
                            firstName : '',
                            lastName  : '',
                            phone     : '',
                        },
                    },
                ];
            } // if
            
            
            
            const paypal = payment_source.paypal;
            if (paypal) {
                const {
                    email_address,
                } = paypal;
                
                
                
                return [
                    identifier,
                    {
                        type           : 'PAYPAL',
                        
                        brand          : 'paypal',
                        identifier     : email_address,
                        expiresAt      : null,
                        
                        billingAddress : null,
                    },
                ];
            } // if
            
            
            
            return null;
        })
        .filter((item): item is Exclude<typeof item, null> => (item !== null))
    );
}