import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'
import { createEntityAdapter } from '@reduxjs/toolkit';
import { calculateShippingCost } from '@/libs/utilities';
import Shipping from '@/models/Shipping';



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



const basePaypalURL = {
    development : 'https://api-m.sandbox.paypal.com',
    production  : 'https://api-m.paypal.com'
};
const paypalURL = basePaypalURL.development; // TODO: auto switch development vs production
// const accessTokenExpiresThreshold = 0.5;
const paymentTokenExpiresThreshold = 0.5;



/**
 * Access token is used to authenticate all REST API requests.
 */
const generateAccessToken = async () => {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${paypalURL}/v1/oauth2/token`, {
        method  : 'POST',
        body    : 'grant_type=client_credentials',
        headers : {
            Authorization: `Basic ${auth}`,
        },
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

/**
 * Call this function to create your client token (paymentToken).
 */
const generatePaymentToken = async () => {
    const accessToken = await generateAccessToken();
    const response    = await fetch(`${paypalURL}/v1/identity/generate-token`, {
        method  : 'POST',
        headers : {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language' : 'en_US',
            'Content-Type'    : 'application/json',
        },
    });
    const paymentTokenData = await response.json();
    /*
        example:
        {
            client_token: 'eyJicmFpbnRyZWUiOnsiYXV0aG9yaXphdGlvbkZpbmdlcnByaW50IjoiMjY4ZTg0NmMxNjllMzlkYjg2Zjk0ZGE4YWYzYzIxZTc3Y2VlNjBlYmJkZWY2NDM0YzZkZmI4YTg3NjMwYzkzMHxtZXJjaGFudF9pZD1yd3dua3FnMnhnNTZobTJuJnB1YmxpY19rZXk9NjNrdm4zN3Z0MjlxYjRkZiZjcmVhdGVkX2F0PTIwMjMtMDMtMTRUMDU6NTI6MDcuMjY2WiIsInZlcnNpb24iOiIzLXBheXBhbCJ9LCJwYXlwYWwiOnsiaWRUb2tlbiI6bnVsbCwiYWNjZXNzVG9rZW4iOiJBMjFBQUx0cnZYRnJ6MnZnRXZHWFdrc096RGU3WGVDQUlzR2ZTSHlIRHgwNUdzTVdwOTZDLXFFRUtwT1RpN2hUczNCUFRoYm4zZTl3Y09iVnh4Y2tJLWxkZ1llMGw0aFZBIn19',
            expires_in: 3600, // seconds
        }
    */
    console.log('created: paymentTokenData');
    // console.log('created: paymentTokenData: ', paymentTokenData);
    if (!paymentTokenData || paymentTokenData.error) throw paymentTokenData?.error_description ?? paymentTokenData?.error ?? Error('Fetch paymentToken failed.');
    return {
        paymentToken : paymentTokenData.client_token,
        expires      : Date.now() + ((paymentTokenData.expires_in ?? 3600) * 1000 * paymentTokenExpiresThreshold)
    };
}

const handlePaypalResponse = async (response: Response) => {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    } // if
    
    
    
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

const getDefaultCurrencyCode = async (): Promise<string> => {
    return 'USD';
}
const convertCurrencyIfRequired = async (from: number|undefined): Promise<number|undefined> => {
    // conditions:
    if (from === undefined) return undefined;
    
    
    
    const convertRate          = 15000
    const rawConverted         = from / convertRate;
    const smallestFractionUnit = 0.01;
    const fractions            = Math.ceil(rawConverted / smallestFractionUnit);
    return fractions * smallestFractionUnit;
}



export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET': { // intialize paymentToken
            if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            } // if
            
            
            
            return res.status(200).json( // OK
                await generatePaymentToken(),
            );
        } break;
        case 'POST': { // place the order and calculate the total price (not relying priceList on the client_side)
            if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                });
            } // if
            
            
            
            const placeOrderData = req.body;
            if (typeof(placeOrderData) !== 'object') return res.status(400).end(); // bad req
            
            
            
            // validate shipping address:
            const {
                marketingOpt = true,
                
                shippingFirstName,
                shippingLastName,
                
                shippingPhone,
                shippingEmail,
                
                shippingCountry,
                shippingAddress,
                shippingCity,
                shippingZone,
                shippingZip,
                
                shippingProvider,
            } = placeOrderData;
            if (
                (typeof(marketingOpt) !== 'boolean')
                
                || !shippingFirstName || (typeof(shippingFirstName) !== 'string')
                || !shippingLastName  || (typeof(shippingLastName) !== 'string')
                
                || !shippingPhone     || (typeof(shippingPhone) !== 'string')
                || !shippingEmail     || (typeof(shippingEmail) !== 'string') // todo validate email
                
                || !shippingAddress   || (typeof(shippingAddress) !== 'string')
                || !shippingCity      || (typeof(shippingCity) !== 'string')
                || !shippingZone      || (typeof(shippingZone) !== 'string')
                || !shippingZip       || (typeof(shippingZip) !== 'string')
                || !shippingCountry   || (typeof(shippingCountry) !== 'string') // todo validate country id
                
                || !shippingProvider  || (typeof(shippingProvider) !== 'string') // todo validate shipping provider
            ) {
                return res.status(400).end(); // bad req
            } // if
            const selectedShipping = await Shipping.findOne({
                _id: shippingProvider,
                enabled: true,
            }, { _id: false, weightStep: true, shippingRates: true });
            if (!selectedShipping) return res.status(400).end(); // bad req
            
            
            
            // validate cart items + calculate total prices + calculate shipping cost
            const items = placeOrderData.items;
            if (!items || !Array.isArray(items) || !items.length) return res.status(400).end(); // bad req
            
            interface ProductEntry {
                _id             : string
                name            : string
                price           : number
                shippingWeight ?: number
            }
            const productListAdapter = createEntityAdapter<ProductEntry>({
                selectId : (productEntry) => productEntry._id,
            });
            const productList = productListAdapter.addMany(
                productListAdapter.getInitialState(),
                await Product.find({}, { _id: true, name: true, price: true, shippingWeight: true })
            );
            
            interface ReportedProductItem {
                name                 : string
                quantity             : number
                unitPriceConverted  ?: number
                unitWeight          ?: number
            }
            const reportedProductItem : ReportedProductItem[] = [];
            let totalProductPricesConverted = 0, totalProductWeights : number|undefined = undefined;
            const defaultCurrencyCode = await getDefaultCurrencyCode();
            for (const item of items) {
                if (!item || (typeof(item) !== 'object')) return res.status(400).end(); // bad req
                const {
                    productId,
                    quantity,
                } = item;
                if (!productId || (typeof(productId) !== 'string')) return res.status(400).end(); // bad req
                if (!quantity || (typeof(quantity) !== 'number') || !isFinite(quantity) || (quantity < 0)) return res.status(400).end(); // bad req
                if ((quantity % 1)) return res.status(400).end(); // bad req
                if (quantity === 0) continue;
                
                
                
                const unitPrice          = productList.entities[productId]?.price;
                const unitPriceConverted = await convertCurrencyIfRequired(unitPrice);
                const unitWeight         = productList.entities[productId]?.shippingWeight;
                
                
                
                reportedProductItem.push({
                    name               : productList.entities[productId]?.name ?? productId,
                    quantity           : quantity,
                    unitPriceConverted : unitPriceConverted,
                    unitWeight         : unitWeight,
                });
                
                
                if (unitPriceConverted !== undefined) {
                    totalProductPricesConverted  += unitPriceConverted * quantity;
                } // if
                
                if (unitWeight !== undefined) {
                    if (totalProductWeights === undefined) totalProductWeights = 0; // contains at least 1 PHYSICAL_GOODS
                    totalProductWeights +=                                  unitWeight  * quantity;
                } // if
            } // for
            const totalShippingCostsConverted = await convertCurrencyIfRequired(calculateShippingCost(totalProductWeights, selectedShipping));
            const totalCostConverted          = totalProductPricesConverted + (totalShippingCostsConverted ?? 0);
            console.log('total bill: ', {
                totalProductPricesConverted,
                totalShippingCostsConverted,
                totalCostConverted,
            });
            
            
            
            const accessToken = await generateAccessToken();
            const url = `${paypalURL}/v2/checkout/orders`;
            const paypalResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
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
                            currency_code         : defaultCurrencyCode,
                            
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
                                    currency_code : defaultCurrencyCode,
                                    value         : totalProductPricesConverted,
                                },
                                
                                // shipping Money|undefined
                                // The shipping fee for all items within a given purchase_unit. shipping.value can not be a negative number.
                                shipping          : (totalShippingCostsConverted === undefined) ? undefined : {
                                    currency_code : defaultCurrencyCode,
                                    value         : totalShippingCostsConverted,
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
                        // The API caller-provided external ID. Used to reconcile client transactions with PayPal transactions. Appears in transaction and settlement reports but is not visible to the payer.
                        custom_id                 : undefined,
                        
                        // description string|undefined
                        // The purchase description.
                        description               : undefined,
                        
                        // items array (contains the item object)
                        // An array of items that the customer purchases from the merchant.
                        items                     : reportedProductItem.map((item) => ({
                            // name string required
                            // The item name or title.
                            name                  : item.name,
                            
                            // quantity string required
                            // The item quantity. Must be a whole number.
                            quantity              : item.quantity,
                            
                            // unit_amount Money required
                            // The item price or rate per unit.
                            unit_amount           : {
                                // currency_code string required
                                // The three-character ISO-4217 currency code that identifies the currency.
                                currency_code     : defaultCurrencyCode,
                                
                                // value string required
                                /*
                                    The value, which might be:
                                    * An integer for currencies like JPY that are not typically fractional.
                                    * A decimal fraction for currencies like TND that are subdivided into thousandths.
                                */
                                value             : item.unitPriceConverted ?? 0,
                            },
                            
                            // category enum|undefined
                            // The item category type.
                            // The possible values are: 'DIGITAL_GOODS'|'PHYSICAL_GOODS'|'DONATION'
                            category              : (item.unitWeight === undefined) ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS',
                            
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
                            // The encrypted PayPal account ID of the merchant.
                            merchant_id           : undefined,
                        },
                        
                        // shipping object|undefined
                        // The name and address of the person to whom to ship the items.
                        shipping                  : {
                            // address object|undefined
                            // The address of the person to whom to ship the items.
                            address               : {
                                // address_line_1 string|undefined
                                // The first line of the address. For example, number or street. For example, 173 Drury Lane.
                                // Required for data entry and compliance and risk checks. Must contain the full address.
                                address_line_1    : shippingAddress,
                                
                                // address_line_2 string|undefined
                                // The second line of the address. For example, suite or apartment number.
                                address_line_2    : undefined,
                                
                                // admin_area_2 string|undefined
                                // A city, town, or village.
                                admin_area_2      : shippingCity,
                                
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
                                admin_area_1      : shippingZone,
                                
                                // postal_code string
                                // The postal code, which is the zip code or equivalent. Typically required for countries with a postal code or an equivalent.
                                postal_code       : shippingZip,
                                
                                // country_code string required
                                // The two-character ISO 3166-1 code that identifies the country or region.
                                country_code      : shippingCountry,
                            },
                            
                            // name object|undefined
                            // The name of the person to whom to ship the items. Supports only the full_name property.
                            name                  : {
                                // full_name string
                                // When the party is a person, the party's full name.
                                full_name         : `${shippingFirstName} ${shippingLastName}`,
                            },
                            
                            // type enum|undefined
                            // The method by which the payer wants to get their items from the payee e.g shipping, in-person pickup. Either type or options but not both may be present.
                            // The possible values are: 'SHIPPING'|'PICKUP_IN_PERSON'
                            type                  : 'SHIPPING',
                        },
                        
                        // soft_descriptor string|undefined
                        // The soft descriptor is the dynamic text used to construct the statement descriptor that appears on a payer's card statement.
                        // If an Order is paid using the "PayPal Wallet", the statement descriptor will appear in following format on the payer's card statement: PAYPAL_prefix+(space)+merchant_descriptor+(space)+ soft_descriptor
                        soft_descriptor           : undefined,
                    }],
                }),
            });
            try {
                const paypalOrderData = await handlePaypalResponse(paypalResponse);
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
                console.log('paypalOrderData: ', paypalOrderData);
                return res.status(200).json(paypalOrderData); // OK
            }
            catch (error: any) {
                return res.status(500).send(error?.message ?? error ?? 'error');
            } // try
        } break;
        case 'PATCH': { // purchase the previously posted order
            const paypalAuthentication = req.body;
            if (typeof(paypalAuthentication) !== 'object') return res.status(400).end(); // bad req
            const orderId = paypalAuthentication.orderId
            if (!orderId)                                  return res.status(400).end(); // bad req
            /*
                example:
                {
                    authenticationReason: undefined
                    authenticationStatus: "APPROVED",
                    card: {
                        brand: "VISA",
                        card_type: "VISA",
                        last_digits: "7704",
                        type: "CREDIT",
                    },
                    liabilityShift: undefined
                    liabilityShifted: undefined
                    orderId: "1N785713SG267310M"
                }
            */
            
            
            
            const accessToken = await generateAccessToken();
            const url = `${paypalURL}/v2/checkout/orders/${orderId}/capture`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            try {
                const paypalPaymentData = await handlePaypalResponse(response);
                /*
                    example:
                    {
                        id: '1N785713SG267310M',
                        status: 'COMPLETED',
                        payment_source: {
                            card: {
                                last_digits: '7704',
                                brand: 'VISA',
                                type: 'CREDIT'
                            }
                        },
                        purchase_units: [
                            {
                                reference_id: 'default',
                                payments: [Object]
                            }
                        ],
                        links: [
                            {
                                href: 'https://api.sandbox.paypal.com/v2/checkout/orders/1N785713SG267310M',
                                rel: 'self',
                                method: 'GET'
                            }
                        ]
                    }
                */
                console.log('capture: paypalPaymentData: ', paypalPaymentData);
                const captureData = paypalPaymentData?.purchase_units?.[0]?.payments?.captures?.[0];
                console.log('captureData : ', captureData);
                console.log('captureData.status : ', captureData?.status);
                
                
                switch (captureData?.status) {
                    case 'COMPLETED': {
                        return res.status(200).json({ // payment approved
                            id: 'payment#123#approved',
                        });
                    } break;
                    case 'DECLINED': {
                        return res.status(402).json({ // payment declined
                            error: 'payment declined',
                        });
                    } break;
                    default: {
                        console.log(paypalPaymentData);
                        console.log(captureData);
                        return res.status(500).send('unknown error');
                    } break;
                } // switch
            }
            catch (error: any) {
                return res.status(500).send(error?.message ?? error ?? 'error');
            } // try
        } break;
        default:
            return res.status(400).end();
    } // switch
};
