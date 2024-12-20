// models:
import {
    type CreateOrderOptions,
    type AuthorizedFundData,
    type PaymentDetail,
    
    type PaymentMethodDetail,
    type PaymentMethodSetupOptions,
    type PaymentMethodSetup,
    type PaymentMethodCapture,
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

export interface PaypalSavedCard
    extends
        Pick<PaymentMethodCapture,
            |'type'
            |'paymentMethodProviderId'
        >
{
}

/**
 * @returns null                                       : Transaction creation was denied (for example due to a decline).  
 * @returns AuthorizedFundData                         : Authorized for payment.  
 * @returns [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
 */
export const paypalCreateOrder = async (savedCard : PaypalSavedCard|null, options: CreateOrderOptions): Promise<AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|null> => {
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
        
        paymentMethodProviderCustomerId : existingPaymentMethodProviderCustomerId,
    } = options;
    
    
    
    const paypalResponse = await fetch(`${paypalUrl}/v2/checkout/orders`, {
        method  : 'POST',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
            
            'Prefer'          : 'return=representation', // The server returns a complete resource representation, including the current state of the resource.
            
            // TODO: need to improve the idempotency:
            ...(savedCard ? {
                'PayPal-Request-Id' : `${savedCard.paymentMethodProviderId}:${new Date().toISOString()}`,
            } : undefined)
        },
        body    : JSON.stringify({
            // intent enum required
            // The intent to either capture payment immediately or authorize a payment for an order after order creation.
            // The possible values are: 'CAPTURE'|'AUTHORIZE'
            intent                        : (
                !savedCard
                ? 'CAPTURE'   // for presentCard, we need to capture the created_order in another api request
                // : 'AUTHORIZE' // for savedCard, do not immediately capture the payment, instead we prefer to capture the fund explicitly
                : 'CAPTURE' // for savedCard, immediately capture the payment
            ),
            
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
                    billing_address : !savedCard ? (
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
                    ) : undefined,
                    
                    
                    
                    attributes : {
                        verification : {
                            // UNCOMMENT to test 3DS scenario:
                            // method: 'SCA_ALWAYS', // triggers 3D Secure for every transaction, regardless of SCA requirements.
                            
                            method : 'SCA_WHEN_REQUIRED', // triggers 3D Secure contingency when it is a mandate in the region where you operate
                        },
                        
                        
                        
                        // save payment method during purchase:
                        customer : (
                            existingPaymentMethodProviderCustomerId
                            ? {
                                id : existingPaymentMethodProviderCustomerId, // pass the existing paypal's customerId to prevent paypal from auto_creating a new customerId
                            }
                            : undefined
                        ),
                        vault : (
                            (existingPaymentMethodProviderCustomerId !== undefined)
                            
                            /* save the customer's card to database */
                            ? {
                                store_in_vault : 'ON_SUCCESS',
                            }
                            
                            /* do not save the customer's card */
                            : undefined
                        ),
                    },
                    vault_id   : (savedCard && (savedCard.type === 'CARD')) ? savedCard.paymentMethodProviderId : undefined,
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
        example with presentCard:
        {
            id: "46H55548GU006254C",
            intent: "CAPTURE",
            status: "CREATED",
            payment_source: {
                card: {
                    billing_address: {
                        address_line_1: "Jl Monjali Gang Perkutut 25",
                        admin_area_2: "Sleman",
                        admin_area_1: "DI Yogyakarta",
                        postal_code: "55284",
                        country_code: "ID",
                    },
                },
            },
            purchase_units: [
                {
                    reference_id: "default",
                    amount: {
                        currency_code: "USD",
                        value: "61.27",
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: "60.63",
                            },
                            shipping: {
                                currency_code: "USD",
                                value: "0.64",
                            },
                        },
                    },
                    payee: {
                        email_address: "sb-ll80225278267@business.example.com",
                        merchant_id: "MJRUQCVE8CVPN",
                        display_data: {
                            brand_name: "ArtSwimwear.com",
                        },
                    },
                    items: [
                        {
                            name: "Dewata Plunge Onepiece - Dayak Woven (Sm)",
                            unit_amount: {
                                currency_code: "USD",
                                value: "60.63",
                            },
                            quantity: "1",
                            category: "PHYSICAL_GOODS",
                        },
                    ],
                    shipping: {
                        name: {
                            full_name: "Yunus Kurniawan",
                        },
                        address: {
                            address_line_1: "Jl Monjali Gang Perkutut 25",
                            admin_area_2: "Sleman",
                            admin_area_1: "DI Yogyakarta",
                            postal_code: "55284",
                            country_code: "ID",
                        },
                        type: "SHIPPING",
                    },
                },
            ],
            create_time: "2024-12-20T18:26:16Z",
            links: [
                {
                    href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                    rel: "self",
                    method: "GET",
                },
                {
                    href: "https://www.sandbox.paypal.com/checkoutnow?token=46H55548GU006254C",
                    rel: "approve",
                    method: "GET",
                },
                {
                    href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                    rel: "update",
                    method: "PATCH",
                },
                {
                    href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C/capture",
                    rel: "capture",
                    method: "POST",
                },
            ],
        }
    */
    /*
        example with savedCard with 'CAPTURE':
        {
            id: "5T710786T06567114",
            intent: "CAPTURE",
            status: "COMPLETED",
            payment_source: {
                card: {
                    name: "Budi",
                    last_digits: "0004",
                    expiry: "2029-01",
                    brand: "DISCOVER",
                    available_networks: [
                        "DINERS",
                    ],
                    type: "CREDIT",
                    bin_details: {
                        bin: "36259",
                        products: [
                            "COMMERCIAL",
                        ],
                    },
                },
            },
            purchase_units: [
                {
                    reference_id: "default",
                    amount: {
                        currency_code: "USD",
                        value: "25.07",
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: "24.43",
                            },
                            shipping: {
                                currency_code: "USD",
                                value: "0.64",
                            },
                            handling: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            insurance: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            shipping_discount: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                        },
                    },
                    payee: {
                        email_address: "sb-ll80225278267@business.example.com",
                        merchant_id: "MJRUQCVE8CVPN",
                        display_data: {
                            brand_name: "ArtSwimwear.com",
                        },
                    },
                    description: "Komodo V Cut Bottom  - Dayak Woven (Sm)",
                    soft_descriptor: "TEST STORE",
                    items: [
                        {
                            name: "Komodo V Cut Bottom  - Dayak Woven (Sm)",
                            unit_amount: {
                                currency_code: "USD",
                                value: "24.43",
                            },
                            tax: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            quantity: "1",
                            category: "PHYSICAL_GOODS",
                        },
                    ],
                    shipping: {
                        name: {
                            full_name: "Yunus Kurniawan",
                        },
                        address: {
                            address_line_1: "Jl Monjali Gang Perkutut 25",
                            admin_area_2: "Sleman",
                            admin_area_1: "DI Yogyakarta",
                            postal_code: "55284",
                            country_code: "ID",
                        },
                    },
                    payments: {
                        captures: [
                            {
                                id: "0XX3309307732590Y",
                                status: "COMPLETED",
                                amount: {
                                    currency_code: "USD",
                                    value: "25.07",
                                },
                                final_capture: true,
                                disbursement_mode: "INSTANT",
                                seller_protection: {
                                    status: "NOT_ELIGIBLE",
                                },
                                seller_receivable_breakdown: {
                                    gross_amount: {
                                        currency_code: "USD",
                                        value: "25.07",
                                    },
                                    paypal_fee: {
                                        currency_code: "USD",
                                        value: "1.52",
                                    },
                                    net_amount: {
                                        currency_code: "USD",
                                        value: "23.55",
                                    },
                                },
                                links: [
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/payments/captures/0XX3309307732590Y",
                                        rel: "self",
                                        method: "GET",
                                    },
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/payments/captures/0XX3309307732590Y/refund",
                                        rel: "refund",
                                        method: "POST",
                                    },
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/checkout/orders/5T710786T06567114",
                                        rel: "up",
                                        method: "GET",
                                    },
                                ],
                                create_time: "2024-12-20T18:48:14Z",
                                update_time: "2024-12-20T18:48:14Z",
                                network_transaction_reference: {
                                    id: "864109425517117",
                                    date: "0408",
                                    network: "DISCOVER",
                                },
                                processor_response: {
                                    avs_code: "Y",
                                    cvv_code: "M",
                                    response_code: "0000",
                                },
                            },
                        ],
                    },
                },
            ],
            create_time: "2024-12-20T18:48:14Z",
            update_time: "2024-12-20T18:48:14Z",
            links: [
                {
                    href: "https://api.sandbox.paypal.com/v2/checkout/orders/5T710786T06567114",
                    rel: "self",
                    method: "GET",
                },
            ],
        }
    */
    /*
        example with savedCard with 'AUTHORIZE':
        {
            id: "8YY60073V53512231",
            intent: "AUTHORIZE",
            status: "COMPLETED",
            payment_source: {
                card: {
                    name: "Budi",
                    last_digits: "0004",
                    expiry: "2029-01",
                    brand: "DISCOVER",
                    available_networks: [
                        "DINERS",
                    ],
                    type: "CREDIT",
                    bin_details: {
                        bin: "36259",
                        products: [
                            "COMMERCIAL",
                        ],
                    },
                },
            },
            purchase_units: [
                {
                    reference_id: "default",
                    amount: {
                        currency_code: "USD",
                        value: "24.86",
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: "24.43",
                            },
                            shipping: {
                                currency_code: "USD",
                                value: "0.43",
                            },
                            handling: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            insurance: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            shipping_discount: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                        },
                    },
                    payee: {
                        email_address: "sb-ll80225278267@business.example.com",
                        merchant_id: "MJRUQCVE8CVPN",
                        display_data: {
                            brand_name: "ArtSwimwear.com",
                        },
                    },
                    description: "Bajo Halter Neck Top - Mega Mendung (Sm)",
                    soft_descriptor: "TEST STORE",
                    items: [
                        {
                            name: "Bajo Halter Neck Top - Mega Mendung (Sm)",
                            unit_amount: {
                                currency_code: "USD",
                                value: "24.43",
                            },
                            tax: {
                                currency_code: "USD",
                                value: "0.00",
                            },
                            quantity: "1",
                            category: "PHYSICAL_GOODS",
                        },
                    ],
                    shipping: {
                        name: {
                            full_name: "Yunus Kurniawan",
                        },
                        address: {
                            address_line_1: "Jl Monjali Gang Perkutut 25",
                            admin_area_2: "Sleman",
                            admin_area_1: "DI Yogyakarta",
                            postal_code: "55284",
                            country_code: "ID",
                        },
                    },
                    payments: {
                        authorizations: [
                            {
                                status: "CREATED",
                                id: "92X28747BW716125D",
                                amount: {
                                    currency_code: "USD",
                                    value: "24.86",
                                },
                                seller_protection: {
                                    status: "NOT_ELIGIBLE",
                                },
                                processor_response: {
                                    avs_code: "Y",
                                    cvv_code: "M",
                                    response_code: "0000",
                                },
                                expiration_time: "2025-01-18T18:10:42Z",
                                links: [
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D",
                                        rel: "self",
                                        method: "GET",
                                    },
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/capture",
                                        rel: "capture",
                                        method: "POST",
                                    },
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/void",
                                        rel: "void",
                                        method: "POST",
                                    },
                                    {
                                        href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
                                        rel: "up",
                                        method: "GET",
                                    },
                                ],
                                create_time: "2024-12-20T18:10:42Z",
                                update_time: "2024-12-20T18:10:42Z",
                                network_transaction_reference: {
                                    id: "864109425517117",
                                    date: "0408",
                                    network: "DISCOVER",
                                },
                            },
                        ],
                    },
                },
            ],
            create_time: "2024-12-20T18:10:42Z",
            update_time: "2024-12-20T18:10:42Z",
            links: [
                {
                    href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
                    rel: "self",
                    method: "GET",
                },
            ],
        }
    */
    switch (paypalOrderData?.status) {
        //#region for presentCard response
        case 'CREATED': { // The order was created with the specified context.
            const paymentId = paypalOrderData?.id;
            if (!paymentId || (typeof(paymentId) !== 'string')) {
                // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            
            
            
            return {
                paymentId, // NOT prefixed with '#AUTHORIZED_', so we have a HINT to capture_the_order later (NOT to capture_the_authorized_payment later)
                redirectData : undefined, // no redirectData required but require a `paypalCaptureFund()` to capture the fund
            } satisfies AuthorizedFundData;
        }
        //#endregion for presentCard response
        
        
        
        //#region for savedCard response
        case 'COMPLETED': { // The payment was authorized or the authorized payment was captured for the order.
            const authorizedOrCapturedData = (
                // for `intent: 'AUTHORIZE'`:
                paypalOrderData?.purchase_units?.[0]?.payments?.authorizations?.[0] // https://developer.paypal.com/docs/api/orders/v2/#orders_create!c=200&path=purchase_units/payments/authorizations&t=response
                
                ?? // our payment data should be singular, so we can assume the authorization and capture never happen simultaneously // QUESTION: is my assumption correct?
                
                // for `intent: 'CAPTURE'`:
                paypalOrderData?.purchase_units?.[0]?.payments?.captures?.[0] // https://developer.paypal.com/docs/api/orders/v2/#orders_create!c=200&path=purchase_units/payments/captures&t=response
            );
            
            
            
            switch (authorizedOrCapturedData?.status) {
                case /* for `intent: 'AUTHORIZE'` */ 'CREATED': { // The authorized payment is created. No captured payments have been made for this authorized payment.
                    // const paymentId = authorizedOrCapturedData?.id; // when on `paypalCaptureFund()`, capture the authorized payment
                    const paymentId = paypalOrderData?.id; // when on `paypalCaptureFund()`, we need to get the details of the order and then capture the authorized payment
                    if (!paymentId || (typeof(paymentId) !== 'string')) {
                        // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                        console.log('unexpected response: ', paypalOrderData);
                        throw Error('unexpected API response');
                    } // if
                    
                    
                    
                    return {
                        paymentId    : `#AUTHORIZED_${paymentId}`, // prefixed with '#AUTHORIZED_', so we have a HINT to capture_the_authorized_payment later (NOT to capture_the_order later)
                        redirectData : undefined, // no redirectData required but require a `paypalCaptureFund()` to capture the fund
                    } satisfies AuthorizedFundData;
                }
                
                
                
                case /* for `intent: 'AUTHORIZE'` */ 'CAPTURED': // The authorized payment has one or more captures against it. The sum of these captured payments is greater than the amount of the original authorized payment.
                case /* for `intent: 'CAPTURE'`   */ 'COMPLETED': { // The funds for this captured payment were credited to the payee's PayPal account.
                    const paymentBreakdown = authorizedOrCapturedData?.seller_receivable_breakdown;
                    // const paymentAmountCurrency : string = paymentBreakdown?.gross_amount?.currency_code || '';
                    const amount           = Number.parseFloat(paymentBreakdown?.gross_amount?.value);
                    // const paymentFeeCurrency    : string = paymentBreakdown?.paypal_fee?.currency_code || '';
                    const fee              = Number.parseFloat(paymentBreakdown?.paypal_fee?.value);
                    // if (paymentAmountCurrency !== paymentFeeCurrency) throw Error('unexpected API response');
                    
                    
                    
                    const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
                        const paymentSource = paypalOrderData.payment_source;
                        
                        
                        
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
                    })();
                    return [
                        {
                            ...paymentDetailPartial,
                            
                            amount,
                            fee,
                        } satisfies PaymentDetail,
                        
                        
                        
                        null, // the savedCard is already saved, no need to save it again, so we don't need to pass the PaymentMethodCapture object
                    ] satisfies [PaymentDetail, PaymentMethodCapture|null];
                }
                
                
                
                case /* for `intent: 'AUTHORIZE'` */ 'DENIED': // PayPal cannot authorize funds for this authorized payment.
                case /* for `intent: 'CAPTURE'`   */ 'DECLINED': // The funds could not be captured.
                case /* for `intent: 'CAPTURE'`   */ 'FAILED': { // There was an error while capturing payment.
                    return null;
                }
                
                
                
                // never happened (the request configuration SHOULD not produce these conditions):
                case /* for `intent: 'AUTHORIZE'` */ 'PARTIALLY_CAPTURED': // A captured payment was made for the authorized payment for an amount that is less than the amount of the original authorized payment.
                case /* for `intent: 'CAPTURE'`   */ 'PARTIALLY_REFUNDED': // An amount less than this captured payment's amount was partially refunded to the payer.
                
                case /* for `intent: 'AUTHORIZE'` */ 'VOIDED': // The authorized payment was voided. No more captured payments can be made against this authorized payment.
                
                // case /* for `intent: 'AUTHORIZE'` */ 'PENDING': // The created authorization is in pending state. For more information, see status.details.
                case /* for `intent: 'CAPTURE'`   */ 'PENDING': // The funds for this captured payment was not yet credited to the payee's PayPal account. For more information, see status.details.
                
                case /* for `intent: 'CAPTURE'`   */ 'REFUNDED': // An amount greater than or equal to this captured payment's amount was refunded to the payer.
                
                default:
                    // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                    console.log('unexpected response: ', paypalOrderData);
                    throw Error('unexpected API response');
            } // switch
        }
        //#endregion for savedCard response
        
        
        
        //#region WARNING: not yet tested, just a assumtion code
        case 'PAYER_ACTION_REQUIRED': { // The order requires an action from the payer (e.g. 3DS authentication). Redirect the payer to the "rel":"payer-action" HATEOAS link returned as part of the response prior to authorizing or capturing the order. Some payment sources may not return a payer-action HATEOAS link (eg. MB WAY). For these payment sources the payer-action is managed by the scheme itself (eg. through SMS, email, in-app notification, etc).
            /*
                The merchant needs to redirect the payer back to Paypal to complete 3D Secure authentication.
                
                To trigger the authentication:
                1. Redirect the buyer to the "rel": "payer-action" HATEOAS link returned as part of the response before authorizing or capturing the order.
                2. Append "redirect_uri" to the payer-action URL so that Paypal returns the payer to the merchant's checkout page after they complete 3D Secure authentication.
                
                Sample URL:
                https://example.com/webapp/myshop?action=verify&flow=3ds&cart_id=ORDER-ID&redirect_uri=MERCHANT-LANDING-PAGE
            */
            
            
            
            const paymentId = paypalOrderData?.id;
            if (!paymentId || (typeof(paymentId) !== 'string')) {
                // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            
            const links = paypalOrderData.links;
            if (!Array.isArray(links)) {
                // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            const payerAction = links.find((link) => (link?.rel === 'payer-action'));
            const payerActionHref = payerAction?.href;
            if (!payerActionHref || (typeof(payerActionHref) !== 'string')) {
                // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            
            
            
            return {
                paymentId    : (
                    !!paypalOrderData?.purchase_units?.[0]?.payments?.authorizations?.[0]
                    ? `#AUTHORIZED_${paymentId}` // prefixed with '#AUTHORIZED_', so we have a HINT to capture_the_authorized_payment later (NOT to capture_the_order later)
                    : paymentId // NOT prefixed with '#AUTHORIZED_', so we have a HINT to capture_the_order later (NOT to capture_the_authorized_payment later)
                ),
                redirectData : payerActionHref, // requires to handle redirectData before we passed it to `paypalCaptureFund()` to capture the fund
            } satisfies AuthorizedFundData;
        }
        //#endregion WARNING: not yet tested, just a assumtion code
        
        
        
        // never happened (the request configuration SHOULD not produce these conditions):
        case 'SAVED': // The order was saved and persisted. The order status continues to be in progress until a capture is made with final_capture = true for all purchase units within the order.
        case 'APPROVED': // The customer approved the payment through the PayPal wallet or another form of guest or unbranded payment. For example, a card, bank account, or so on. // QUESTION: we sent the invoice to customer paypal account and then the customer approve the invoice?
        case 'VOIDED': // All purchase units in the order are voided.
        default:
            // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
            console.log('unexpected response: ', paypalOrderData);
            throw Error('unexpected API response');
    } // switch
}

/**
 * @returns PaymentMethodSetup                         : The authorization for saving the card for future use without deducting funds.
 */
export const paypalCreatePaymentMethodSetup = async (options: PaymentMethodSetupOptions): Promise<PaymentMethodSetup> => {
    const {
        paymentMethodProviderCustomerId : existingPaymentMethodProviderCustomerId,
        billingAddress,
    } = options;
    
    
    
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
                    billing_address : (
                        !!billingAddress
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
            
            
            
            // save payment method without charging:
            customer : (
                existingPaymentMethodProviderCustomerId
                ? {
                    id : existingPaymentMethodProviderCustomerId, // pass the existing paypal's customerId to prevent paypal from auto_creating a new customerId
                }
                : undefined
            ),
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
        // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    const {
        id : paymentMethodSetupToken,
        customer : {
            id : paymentMethodProviderCustomerId,
        },
    } = paypalOrderData;
    if (!paymentMethodSetupToken || (typeof(paymentMethodSetupToken) !== 'string') || paymentMethodProviderCustomerId || (typeof(paymentMethodProviderCustomerId) !== 'string')) {
        // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
        console.log('unexpected response: ', paypalOrderData);
        throw Error('unexpected API response');
    } // if
    return {
        paymentMethodProviderCustomerId,
        paymentMethodSetupToken,
    } satisfies PaymentMethodSetup;
}



/**
 * @returns null                                       : Transaction creation was denied (for example due to a decline).  
 * @returns [PaymentDetail, PaymentMethodCapture|null] : Paid (with optionally an authorization for saving the card for future use).
 */
export const paypalCaptureFund = async (paymentId: string): Promise<[PaymentDetail, PaymentMethodCapture|null]|null> => {
    const paypalPaymentData = (
        paymentId.startsWith('#AUTHORIZED_')
        ? await (async () => { // Get the order detail, and then capture authorized payment, and finally return the captured order detail
            paymentId = paymentId.slice(12); // remove prefix: '#AUTHORIZED_'
            
            
            
            const response = await fetch(`${paypalUrl}/v2/checkout/orders/${paymentId}`, {
                method  : 'GET',
                headers : {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Accept-Language' : 'en_US',
                    'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
                },
            });
            const paypalOrderData = await paypalHandleResponse(response);
            /*
                example:
                {
                    id: "8YY60073V53512231",
                    intent: "AUTHORIZE",
                    status: "COMPLETED",
                    payment_source: {
                        card: {
                            name: "Budi",
                            last_digits: "0004",
                            expiry: "2029-01",
                            brand: "DISCOVER",
                            available_networks: [
                                "DINERS",
                            ],
                            type: "CREDIT",
                            bin_details: {
                                bin: "36259",
                                products: [
                                    "COMMERCIAL",
                                ],
                            },
                        },
                    },
                    purchase_units: [
                        {
                            reference_id: "default",
                            amount: {
                                currency_code: "USD",
                                value: "24.86",
                                breakdown: {
                                    item_total: {
                                        currency_code: "USD",
                                        value: "24.43",
                                    },
                                    shipping: {
                                        currency_code: "USD",
                                        value: "0.43",
                                    },
                                },
                            },
                            payee: {
                                email_address: "sb-ll80225278267@business.example.com",
                                merchant_id: "MJRUQCVE8CVPN",
                                display_data: {
                                    brand_name: "ArtSwimwear.com",
                                },
                            },
                            soft_descriptor: "TEST STORE",
                            items: [
                                {
                                    name: "Bajo Halter Neck Top - Mega Mendung (Sm)",
                                    unit_amount: {
                                        currency_code: "USD",
                                        value: "24.43",
                                    },
                                    quantity: "1",
                                    category: "PHYSICAL_GOODS",
                                },
                            ],
                            shipping: {
                                name: {
                                    full_name: "Yunus Kurniawan",
                                },
                                address: {
                                    address_line_1: "Jl Monjali Gang Perkutut 25",
                                    admin_area_2: "Sleman",
                                    admin_area_1: "DI Yogyakarta",
                                    postal_code: "55284",
                                    country_code: "ID",
                                },
                                type: "SHIPPING",
                            },
                            payments: {
                                authorizations: [
                                    {
                                        status: "CREATED",
                                        id: "92X28747BW716125D",
                                        amount: {
                                            currency_code: "USD",
                                            value: "24.86",
                                        },
                                        seller_protection: {
                                            status: "NOT_ELIGIBLE",
                                        },
                                        processor_response: {
                                            avs_code: "Y",
                                            cvv_code: "M",
                                            response_code: "0000",
                                        },
                                        expiration_time: "2025-01-18T18:10:42Z",
                                        links: [
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D",
                                                rel: "self",
                                                method: "GET",
                                            },
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/capture",
                                                rel: "capture",
                                                method: "POST",
                                            },
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/void",
                                                rel: "void",
                                                method: "POST",
                                            },
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
                                                rel: "up",
                                                method: "GET",
                                            },
                                        ],
                                        create_time: "2024-12-20T18:10:42Z",
                                        update_time: "2024-12-20T18:10:42Z",
                                        network_transaction_reference: {
                                            id: "864109425517117",
                                            date: "0408",
                                            network: "DISCOVER",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    create_time: "2024-12-20T18:10:39Z",
                    update_time: "2024-12-20T18:10:42Z",
                    links: [
                        {
                            href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
                            rel: "self",
                            method: "GET",
                        },
                    ],
                }
            */
            
            
            const authorizations = paypalOrderData?.purchase_units?.[0]?.payments?.authorizations
            const authorizedId   = authorizations?.[0]?.id;
            if (!authorizedId || (typeof(authorizedId) !== 'string')) {
                // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            
            
            
            const response2 = await fetch(`${paypalUrl}/v2/payments/authorizations/${authorizedId}/capture`, {
                    method  : 'POST',
                    headers : {
                        'Content-Type'    : 'application/json',
                        'Accept'          : 'application/json',
                        'Accept-Language' : 'en_US',
                        'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
                        
                        'Prefer'          : 'return=representation', // The server returns a complete resource representation, including the current state of the resource.
                    },
                }
            );
            const paypalCapturedData = await paypalHandleResponse(response2);
            /*
                example:
                {
                    id: "1YE65299KT059304Y",
                    amount: {
                        currency_code: "USD",
                        value: "24.86",
                    },
                    final_capture: true,
                    seller_protection: {
                        status: "NOT_ELIGIBLE",
                    },
                    disbursement_mode: "INSTANT",
                    seller_receivable_breakdown: {
                        gross_amount: {
                            currency_code: "USD",
                            value: "24.86",
                        },
                        paypal_fee: {
                            currency_code: "USD",
                            value: "1.51",
                        },
                        net_amount: {
                            currency_code: "USD",
                            value: "23.35",
                        },
                    },
                    status: "COMPLETED",
                    processor_response: {
                        avs_code: "Y",
                        cvv_code: "M",
                        response_code: "0000",
                    },
                    payee: {
                        email_address: "sb-ll80225278267@business.example.com",
                        merchant_id: "MJRUQCVE8CVPN",
                    },
                    create_time: "2024-12-20T18:11:31Z",
                    update_time: "2024-12-20T18:11:31Z",
                    links: [
                        {
                            href: "https://api.sandbox.paypal.com/v2/payments/captures/1YE65299KT059304Y",
                            rel: "self",
                            method: "GET",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v2/payments/captures/1YE65299KT059304Y/refund",
                            rel: "refund",
                            method: "POST",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D",
                            rel: "up",
                            method: "GET",
                        },
                    ],
                    network_transaction_reference: {
                        id: "864109425517117",
                        date: "0408",
                        network: "DISCOVER",
                    },
                }
            */
            authorizations[0] = paypalCapturedData; // update the uncaptured authorization to captured one
            
            
            
            return paypalOrderData;
        })()
        : await (async () => { // Capture payment for order and then return the order detail
            const response = await fetch(`${paypalUrl}/v2/checkout/orders/${paymentId}/capture`, {
                    method  : 'POST',
                    headers : {
                        'Content-Type'    : 'application/json',
                        'Accept'          : 'application/json',
                        'Accept-Language' : 'en_US',
                        'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
                        
                        'Prefer'          : 'return=representation', // The server returns a complete resource representation, including the current state of the resource.
                    },
                }
            );
            const paypalCapturedData = await paypalHandleResponse(response);
            /*
                example:
                {
                    id: "46H55548GU006254C",
                    intent: "CAPTURE",
                    status: "COMPLETED",
                    payment_source: {
                        card: {
                            name: "Bambang Budiman",
                            last_digits: "5047",
                            expiry: "2025-01",
                            brand: "MASTERCARD",
                            available_networks: [
                                "MASTERCARD",
                            ],
                            type: "DEBIT",
                            attributes: {
                                vault: {
                                    id: "6ku98087c53665010",
                                    status: "VAULTED",
                                    customer: {
                                        id: "VIHhQdluoo",
                                    },
                                    links: [
                                        {
                                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/6ku98087c53665010",
                                            rel: "self",
                                            method: "GET",
                                        },
                                        {
                                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/6ku98087c53665010",
                                            rel: "delete",
                                            method: "DELETE",
                                        },
                                        {
                                            href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                                            rel: "up",
                                            method: "GET",
                                        },
                                    ],
                                },
                            },
                            bin_details: {
                                bin: "506351",
                                issuing_bank: "NCUBO CAPITAL ",
                                bin_country_code: "MX",
                            },
                        },
                    },
                    purchase_units: [
                        {
                            reference_id: "default",
                            amount: {
                                currency_code: "USD",
                                value: "61.27",
                                breakdown: {
                                    item_total: {
                                        currency_code: "USD",
                                        value: "60.63",
                                    },
                                    shipping: {
                                        currency_code: "USD",
                                        value: "0.64",
                                    },
                                    handling: {
                                        currency_code: "USD",
                                        value: "0.00",
                                    },
                                    insurance: {
                                        currency_code: "USD",
                                        value: "0.00",
                                    },
                                    shipping_discount: {
                                        currency_code: "USD",
                                        value: "0.00",
                                    },
                                },
                            },
                            payee: {
                                email_address: "sb-ll80225278267@business.example.com",
                                merchant_id: "MJRUQCVE8CVPN",
                                display_data: {
                                    brand_name: "ArtSwimwear.com",
                                },
                            },
                            description: "Dewata Plunge Onepiece - Dayak Woven (Sm)",
                            soft_descriptor: "TEST STORE",
                            items: [
                                {
                                    name: "Dewata Plunge Onepiece - Dayak Woven (Sm)",
                                    unit_amount: {
                                        currency_code: "USD",
                                        value: "60.63",
                                    },
                                    tax: {
                                        currency_code: "USD",
                                        value: "0.00",
                                    },
                                    quantity: "1",
                                    category: "PHYSICAL_GOODS",
                                },
                            ],
                            shipping: {
                                name: {
                                    full_name: "Yunus Kurniawan",
                                },
                                address: {
                                    address_line_1: "Jl Monjali Gang Perkutut 25",
                                    admin_area_2: "Sleman",
                                    admin_area_1: "DI Yogyakarta",
                                    postal_code: "55284",
                                    country_code: "ID",
                                },
                            },
                            payments: {
                                captures: [
                                    {
                                        id: "5KV02158HD8066142",
                                        status: "COMPLETED",
                                        amount: {
                                            currency_code: "USD",
                                            value: "61.27",
                                        },
                                        final_capture: true,
                                        disbursement_mode: "INSTANT",
                                        seller_protection: {
                                            status: "NOT_ELIGIBLE",
                                        },
                                        seller_receivable_breakdown: {
                                            gross_amount: {
                                                currency_code: "USD",
                                                value: "61.27",
                                            },
                                            paypal_fee: {
                                                currency_code: "USD",
                                                value: "3.00",
                                            },
                                            net_amount: {
                                                currency_code: "USD",
                                                value: "58.27",
                                            },
                                        },
                                        links: [
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/payments/captures/5KV02158HD8066142",
                                                rel: "self",
                                                method: "GET",
                                            },
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/payments/captures/5KV02158HD8066142/refund",
                                                rel: "refund",
                                                method: "POST",
                                            },
                                            {
                                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                                                rel: "up",
                                                method: "GET",
                                            },
                                        ],
                                        create_time: "2024-12-20T18:26:44Z",
                                        update_time: "2024-12-20T18:26:44Z",
                                        network_transaction_reference: {
                                            id: "VIS01106K",
                                            date: "0123",
                                            network: "MASTERCARD",
                                        },
                                        processor_response: {
                                            avs_code: "Y",
                                            cvv_code: "M",
                                            response_code: "0000",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    create_time: "2024-12-20T18:26:44Z",
                    update_time: "2024-12-20T18:26:44Z",
                    links: [
                        {
                            href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                            rel: "self",
                            method: "GET",
                        },
                    ],
                }
            */
            return paypalCapturedData;
        })()
    );
    const authorizedOrCapturedData = (
        // for `intent: 'AUTHORIZE'`:
        paypalPaymentData?.purchase_units?.[0]?.payments?.authorizations?.[0]
        
        ?? // our payment data should be singular, so we can assume the authorization and capture never happen simultaneously // QUESTION: is my assumption correct?
        
        // for `intent: 'CAPTURE'`:
        paypalPaymentData?.purchase_units?.[0]?.payments?.captures?.[0]
    );
    const paymentMethodData = (
        paypalPaymentData?.payment_source?.card?.attributes?.vault
        ??
        paypalPaymentData?.payment_source?.paypal?.attributes?.vault
    );
    
    
    
    switch (authorizedOrCapturedData?.status) {
        // case /* for `intent: 'AUTHORIZE'` */ 'COMPLETED': // The funds for this captured payment were credited to the payee's PayPal account.
        case /* for `intent: 'CAPTURE'`   */ 'COMPLETED': { // The funds for this captured payment were credited to the payee's PayPal account.
            const paymentBreakdown = authorizedOrCapturedData?.seller_receivable_breakdown;
            // const paymentAmountCurrency : string = paymentBreakdown?.gross_amount?.currency_code || '';
            const amount    = Number.parseFloat(paymentBreakdown?.gross_amount?.value);
            // const paymentFeeCurrency    : string = paymentBreakdown?.paypal_fee?.currency_code || '';
            const fee       = Number.parseFloat(paymentBreakdown?.paypal_fee?.value);
            // if (paymentAmountCurrency !== paymentFeeCurrency) throw Error('unexpected API response');
            
            
            
            const paymentDetailPartial = ((): Pick<PaymentDetail, 'type'|'brand'|'identifier'> => {
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
            })();
            return [
                {
                    ...paymentDetailPartial,
                    
                    amount,
                    fee,
                } satisfies PaymentDetail,
                
                
                
                (paymentMethodData?.id && paymentMethodData?.customer?.id)
                // needs to save the paymentMethod:
                ? {
                    type                            : (() => {
                        switch (paymentDetailPartial.type) {
                            case 'CARD'   :
                            case 'PAYPAL' : return paymentDetailPartial.type;
                            default       : throw Error('unexpected API response');
                        } // switch
                    })(),
                    
                    paymentMethodProvider           : 'PAYPAL',
                    paymentMethodProviderId         : paymentMethodData?.id           as string,
                    paymentMethodProviderCustomerId : paymentMethodData?.customer?.id as string,
                } satisfies PaymentMethodCapture
                // no need to save the paymentMethod:
                : null,
            ] satisfies [PaymentDetail, PaymentMethodCapture|null];
        }
        
        
        
        // case /* for `intent: 'AUTHORIZE'` */ 'DECLINED': // The funds could not be captured.
        case /* for `intent: 'CAPTURE'`   */ 'DECLINED': // The funds could not be captured.
        // case /* for `intent: 'AUTHORIZE'` */ 'FAILED': // There was an error while capturing payment.
        case /* for `intent: 'CAPTURE'`   */ 'FAILED': { // There was an error while capturing payment.
            return null;
        }
        
        
        
        // case /* for `intent: 'AUTHORIZE'` */ 'PARTIALLY_REFUNDED': // An amount less than this captured payment's amount was partially refunded to the payer.
        case /* for `intent: 'CAPTURE'`   */ 'PARTIALLY_REFUNDED': // An amount less than this captured payment's amount was partially refunded to the payer.
        // case /* for `intent: 'AUTHORIZE'` */ 'PENDING': // The funds for this captured payment was not yet credited to the payee's PayPal account. For more information, see status.details.
        case /* for `intent: 'CAPTURE'`   */ 'PENDING': // The funds for this captured payment was not yet credited to the payee's PayPal account. For more information, see status.details.
        // case /* for `intent: 'AUTHORIZE'` */ 'REFUNDED': // An amount greater than or equal to this captured payment's amount was refunded to the payer.
        case /* for `intent: 'CAPTURE'`   */ 'REFUNDED': // An amount greater than or equal to this captured payment's amount was refunded to the payer.
        default:
            // TODO: await logToDatabase({ level: 'ERROR', data: paypalPaymentData });
            console.log('unexpected response: ', paypalPaymentData);
            throw Error('unexpected API response');
    } // switch
}

/**
 * @returns PaymentMethodCapture                       : PaymentMethod information needs to be saved into the database, so that customers can reuse it for future use.
 */
export const paypalCapturePaymentMethod = async (vaultToken: string): Promise<PaymentMethodCapture> => {
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
        id : paymentMethodProviderId,
        customer : {
            id : paymentMethodProviderCustomerId,
        },
        payment_source : paymentSource,
    } = paypalPaymentData;
    if (!paymentMethodProviderId || (typeof(paymentMethodProviderId) !== 'string') || !paymentMethodProviderCustomerId || (typeof(paymentMethodProviderCustomerId) !== 'string')) {
        // TODO: await logToDatabase({ level: 'ERROR', data: paypalOrderData });
        console.log('unexpected response: ', paypalPaymentData);
        throw Error('unexpected API response');
    } // if
    return {
        type                            : (() => {
            if ('card'   in paymentSource) return 'CARD';
            if ('paypal' in paymentSource) return 'PAYPAL';
            throw Error('unexpected API response');
        })(),
        
        paymentMethodProvider : 'PAYPAL',
        paymentMethodProviderId,
        paymentMethodProviderCustomerId,
    } satisfies PaymentMethodCapture;
}



export const paypalListPaymentMethods = async (paypalCustomerId: string, limitMax: number): Promise<Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>> => {
    const response = await fetch(`${paypalUrl}/v3/vault/payment-tokens?page=1&page_size=${encodeURIComponent(limitMax)}&customer_id=${encodeURIComponent(paypalCustomerId)}`, {
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
    
    
    
    const paymentTokens = (paypalPaymentMethodsData.payment_tokens ?? []) as any[];
    return new Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>(
        paymentTokens
        .map((paymentToken): [string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>]|null => {
            const {
                id,
                payment_source,
            } = paymentToken;
            const key = `PAYPAL/${id}`;
            
            
            
            const card = payment_source.card;
            if (card) {
                const {
                    brand,
                    last_digits,
                    expiry,
                    
                    billing_address,
                } = card;
                
                
                
                return [
                    key,
                    {
                        type           : 'CARD',
                        
                        brand          : brand,
                        identifier     : last_digits,
                        expiresAt      : new Date(Date.parse(expiry)),
                        
                        billingAddress : !billing_address ? null : (() => {
                            const {
                                country_code,
                                admin_area_1,
                                admin_area_2,
                                postal_code,
                                address_line_1,
                                address_line_2,
                            } = billing_address;
                            return {
                                country   : `${country_code}`.toUpperCase(),
                                state     : admin_area_1,
                                city      : admin_area_2,
                                zip       : postal_code,
                                address   : address_line_1 + (address_line_2 ? ` ${address_line_2}` : ''),
                                
                                firstName : '',
                                lastName  : '',
                                phone     : '',
                            };
                        })(),
                    },
                ];
            } // if
            
            
            
            const paypal = payment_source.paypal;
            if (paypal) {
                const {
                    email_address,
                } = paypal;
                
                
                
                return [
                    key,
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
export const paypalDeletePaymentMethod = async (paypalPaymentMethodId: string): Promise<void> => {
    const response = await fetch(`${paypalUrl}/v3/vault/payment-tokens/${encodeURIComponent(paypalPaymentMethodId)}`, {
        method  : 'DELETE',
        headers : {
            'Content-Type'    : 'application/json',
            'Accept'          : 'application/json',
            'Accept-Language' : 'en_US',
            'Authorization'   : `Bearer ${await paypalCreateAccessToken()}`,
        },
    });
    if (response.status !== 204) throw Error('Unable to delete.');
}