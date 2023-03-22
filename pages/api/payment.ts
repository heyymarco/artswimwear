import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'
import { createEntityAdapter } from '@reduxjs/toolkit'
import { calculateShippingCost } from '@/libs/utilities'
import Shipping from '@/models/Shipping'
import type {
    PaymentToken,
    PlaceOrderResponse,
    MakePaymentResponse
} from '@/store/features/api/apiSlice'
import { startSession } from 'mongoose'
import DraftOrder from '@/models/DraftOrder'



interface ErrorResponse {
    error : string
}



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
const getPaymentCurrency = async (): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : 15000,
        fractionUnit : 0.01,
    };
}
const convertCurrencyIfRequired = async (from: number|undefined): Promise<number|undefined> => {
    // conditions:
    if (from === undefined) return undefined;
    
    
    
    const {rate, fractionUnit} = await getPaymentCurrency();
    const rawConverted         = from / rate;
    const fractions            = Math.ceil(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return stepped;
}
const revertCurrencyIfRequired = async (from: number|undefined): Promise<number|undefined> => {
    // conditions:
    if (from === undefined) return undefined;
    
    
    
    const {rate, fractionUnit} = await getPaymentCurrency();
    const fractions            = Math.ceil(from / fractionUnit);
    const stepped              = fractions * fractionUnit;
    const rawReverted          = stepped * rate;
    
    
    
    return rawReverted;
}



export default async (
    req : NextApiRequest,
    res : NextApiResponse
) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    switch(req.method) {
        case 'GET'   : return responseGeneratePaymentToken(req, res);
        case 'POST'  : return responsePlaceOrder(req, res);
        case 'PATCH' : return responseMakePayment(req, res)
        default      : return res.status(400).end();
    } // switch
}

/**
 * intialize paymentToken
 */
const responseGeneratePaymentToken = async (
    req : NextApiRequest,
    res : NextApiResponse<PaymentToken|ErrorResponse>
) => {
    return res.status(200).json( // OK
        await generatePaymentToken(),
    );
}

/**
 * place the order and calculate the total price (not relying priceList on the client_side)
 */
const responsePlaceOrder = async (
    req : NextApiRequest,
    res : NextApiResponse<PlaceOrderResponse|ErrorResponse>
) => {
    const placeOrderData = req.body;
    if (typeof(placeOrderData) !== 'object') return res.status(400).end(); // bad req
    
    
    
    // validate shipping address:
    const {
        marketingOpt = true,
        
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        shippingEmail,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
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
        id                   : string
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
            id                 : productId,
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
    
    
    
    try {
        let paypalOrderId : string|undefined = undefined;
        if (placeOrderData.paymentSource !== 'manual') {
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
            if ((paypalOrderData?.status !== 'CREATED') || (typeof(paypalOrderData?.id) !== 'string')) {
                // TODO: log unexpected response
                console.log('unexpected response: ', paypalOrderData);
                throw Error('unexpected API response');
            } // if
            paypalOrderId = paypalOrderData?.id;
        } // if
        
        
        
        let orderId : string|undefined = undefined;
        const session = await startSession();
        try {
            await session.withTransaction(async (): Promise<void> => {
                const newDraftOrder = await DraftOrder.create({
                    items              : await Promise.all(reportedProductItem.map(async (productItem) => {
                        //#regon update product stock
                        const product = await Product.findById(productItem.id, { stock: true });
                        if (!product) throw Error('product not found');
                        const stock = product.stock;
                        console.log(`stock of ${productItem.name}: `, (stock !== undefined) ? stock : 'unlimited');
                        if ((stock !== undefined) && isFinite(stock)) {
                            product.stock = (stock - productItem.quantity);
                            await product.save();
                        } // if
                        //#endregon update product stock
                        
                        
                        
                        return {
                            product        : productItem.id,
                            price          : await revertCurrencyIfRequired(productItem.unitPriceConverted),
                            shippingWeight : productItem.unitWeight,
                            quantity       : productItem.quantity,
                        };
                    })),
                    
                    shipping           : {
                        firstName      : shippingFirstName,
                        lastName       : shippingLastName,
                        
                        phone          : shippingPhone,
                        
                        address        : shippingAddress,
                        city           : shippingCity,
                        zone           : shippingZone,
                        zip            : shippingZip,
                        country        : shippingCountry.toUpperCase(),
                    },
                    shippingProvider   : shippingProvider,
                    shippingCost       : await revertCurrencyIfRequired(totalShippingCostsConverted),
                    
                    paypalOrderId      : paypalOrderId,
                });
                orderId = `#ORDER#${newDraftOrder._id}`;
            });
        }
        catch (error: any) {
            orderId = undefined;
            session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        } // try
        if (!orderId) throw Error('unkown error');
        
        
        
        return res.status(200).json({ // OK
            orderId: paypalOrderId ?? orderId,
        });
    }
    catch (error: any) {
        /*
            Possible errors:
            * Network error.
            * Unable to generate accessToken (invalid `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and/or invalid `PAYPAL_SECRET`).
            * Configured currency is not supported by PayPal.
            * Invalid API_request body JSON (programming bug).
            * unexpected API response (programming bug).
        */
        // TODO: log internal error
        console.log('internal error: ', error);
        return res.status(500).json({error: 'internal server error'});
    } // try
}

/**
 * purchase the previously posted order
 */
const responseMakePayment = async (
    req : NextApiRequest,
    res : NextApiResponse<MakePaymentResponse|ErrorResponse>
) => {
    const paymentData = req.body;
    console.log('paymentData: ', paymentData);
    if (typeof(paymentData) !== 'object')  return res.status(400).end(); // bad req
    const rawOrderId = paymentData.orderId;
    if (typeof(rawOrderId) !== 'string')   return res.status(400).end(); // bad req
    
    
    
    let draftOrderId  : string|undefined = undefined;
    let paypalOrderId : string|undefined = undefined;
    if (rawOrderId.startsWith('#ORDER#')) {
        draftOrderId = rawOrderId.slice(7);
        if (!draftOrderId.length)          return res.status(400).end(); // bad req
    }
    else {
        paypalOrderId = rawOrderId;
    } // if
    
    
    
    const draftOrder = (
        !!draftOrderId
        ? await DraftOrder.findById(draftOrderId, {})
        : !!paypalOrderId
        ? await DraftOrder.findOne({ paypalOrderId }, {})
        : undefined
    );
    console.log('draftOrder: ', draftOrder);
    if (!draftOrder) return res.status(400).end(); // bad req
    
    
    
    let isPaymentSuccess : boolean|undefined = undefined;
    try {
        if (paypalOrderId) {
            console.log('paypalOrderId: ', paypalOrderId);
            const accessToken = await generateAccessToken();
            const url = `${paypalURL}/v2/checkout/orders/${paypalOrderId}/capture`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const paypalPaymentData = await handlePaypalResponse(response);
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
            const captureData = paypalPaymentData?.purchase_units?.[0]?.payments?.captures?.[0];
            console.log('captureData : ', captureData);
            console.log('captureData.status : ', captureData?.status);
            
            
            
            switch (captureData?.status) {
                case 'COMPLETED' :  {
                    isPaymentSuccess = true;
                    return res.status(200).json({ // payment APPROVED
                        paymentMethod : (() => {
                            const payment_source = paypalPaymentData?.payment_source;
                            
                            const card = payment_source?.card;
                            if (card) {
                                return {
                                    type       : 'card',
                                    brand      : card.brand?.toLowerCase() ?? undefined,
                                    identifier : card.last_digits ? `ending with ${card.last_digits}` : undefined,
                                };
                            } //if
                            
                            const paypal = payment_source?.paypal;
                            if (paypal) {
                                return {
                                    type       : 'paypal',
                                    brand      : 'paypal',
                                    identifier : paypal.email_address || undefined,
                                };
                            } //if
                            
                            return {
                                type       : 'CUSTOM',
                                brand      : undefined,
                                identifier : undefined,
                            };
                        })(),
                        // @ts-ignore:
                        extra: paypalPaymentData,
                    });
                }; break;
                case 'DECLINED'  : {
                    isPaymentSuccess = false;
                    return res.status(402).json({  // payment DECLINED
                        error     : 'payment declined',
                    });
                }; break;
                default          :
                    // TODO: log unexpected response
                    console.log('unexpected response: ', paypalPaymentData, captureData);
                    throw Error('unexpected API response');
            } // switch
        }
        else {
            isPaymentSuccess = true;
            return res.status(200).json({ // paylater APPROVED (we waiting for your payment confirmation within xx days)
                paymentMethod : {
                    type: 'manual',
                },
            });
        } // if
    }
    catch (error: any) {
        /*
            Possible errors:
            * Network error.
            * Unable to generate accessToken (invalid `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and/or invalid `PAYPAL_SECRET`).
            * Invalid API_request headers (programming bug).
            * unexpected API response (programming bug).
        */
        // TODO: log internal error
        console.log('internal error: ', error);
        return res.status(500).json({error: 'internal server error'});
    }
    finally {
        if (isPaymentSuccess) {
            // todo: delete draftOrder
        } // if
    } // try
}
