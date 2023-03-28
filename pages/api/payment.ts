import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import Product from '@/models/Product'
import { createEntityAdapter } from '@reduxjs/toolkit'
import { calculateShippingCost } from '@/libs/utilities'
import { default as Shipping, ShippingSchema } from '@/models/Shipping'
import type {
    PaymentToken,
    PlaceOrderResponse,
    MakePaymentResponse,
    PaymentMethod,
} from '@/store/features/api/apiSlice'
import { ClientSession, startSession, Types } from 'mongoose'
import DraftOrder from '@/models/DraftOrder'
import Order, { PaymentMethodSchema } from '@/models/Order'
import type { AddressSchema } from '@/models/Address'
import type { CustomerSchema } from '@/models/Customer'
import { CartEntrySchema } from '@/models/CartEntry'
import { trimNumber } from '@/libs/formatters'
import {
    COMMERCE_CURRENCY,
    COMMERCE_CURRENCY_FRACTION_UNIT,
    COMMERCE_CURRENCY_FRACTION_ROUNDING,
    
    PAYPAL_CURRENCY,
    PAYPAL_CURRENCY_FRACTION_UNIT,
    PAYPAL_CURRENCY_FRACTION_ROUNDING,
} from '../../commerce.config'



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



const currencyExchange = {
    expires : 0,
    rates   : new Map<string, number>(),
};
const getCurrencyRate = async (toCurrency: string): Promise<number> => {
    if (currencyExchange.expires <= Date.now()) {
        const rates = currencyExchange.rates;
        rates.clear();
        
        //#region fetch https://www.exchangerate-api.com
        const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATEAPI_KEY}/latest/${COMMERCE_CURRENCY}`);
        if (exchangeRateResponse.status !== 200) throw Error('api error');
        const data = await exchangeRateResponse.json();
        const apiRates = data?.conversion_rates;
        if (typeof(apiRates) !== 'object') throw Error('api error');
        for (const currency in apiRates) {
            rates.set(currency, apiRates[currency]);
        } // for
        //#endregion fetch https://www.exchangerate-api.com
        
        currencyExchange.expires = Date.now() + (1 * 3600 * 1000);
    } // if
    
    
    
    const toRate = currencyExchange.rates.get(toCurrency);
    if (toRate === undefined) throw Error('unknown currency');
    return 1 / toRate;
}



const getPaypalCurrencyConverter      = async (): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(PAYPAL_CURRENCY),
        fractionUnit : PAYPAL_CURRENCY_FRACTION_UNIT,
    };
}
const paypalConvertCurrencyIfRequired = async <TNumber extends number|undefined>(from: TNumber): Promise<TNumber> => {
    // conditions:
    if (typeof(from) !== 'number') return from;
    
    
    
    const {rate, fractionUnit} = await getPaypalCurrencyConverter();
    const rawConverted         = from / rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[PAYPAL_CURRENCY_FRACTION_ROUNDING];
    const fractions            = rounding(rawConverted / fractionUnit);
    const stepped              = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
const paypalRevertCurrencyIfRequired  = async (from: number|undefined): Promise<number|undefined> => {
    // conditions:
    if (from === undefined) return undefined;
    
    
    
    const {rate}       = await getPaypalCurrencyConverter();
    const fractionUnit = COMMERCE_CURRENCY_FRACTION_UNIT;
    const rawReverted  = from * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[COMMERCE_CURRENCY_FRACTION_ROUNDING];
    const fractions    = rounding(rawReverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped);
}



const commitOrder = async (session: ClientSession, { draftOrder, customer, billing, paymentMethod } : { draftOrder: any, customer: CustomerSchema, billing: AddressSchema|undefined, paymentMethod: PaymentMethodSchema }) => {
    await Order.create([{
        customer         : customer,
        
        items            : draftOrder.items,
        
        shipping         : draftOrder.shipping,
        shippingProvider : draftOrder.shippingProvider,
        shippingCost     : draftOrder.shippingCost,
        
        billing          : billing,
        
        paymentMethod    : paymentMethod,
    }], { session });
    await draftOrder.deleteOne({}, { session });
}
const revertOrder = async (session: ClientSession, { draftOrder } : { draftOrder: any }) => {
    for (const item of draftOrder.items) {
        const product = await Product.findById(item.product, { stock: true }, { session });
        const productStock = product.stock;
        if ((productStock !== undefined) && isFinite(productStock)) {
            //#regon increase product stock
            product.stock = (productStock + item.quantity);
            await product.save({ session });
            //#endregon increase product stock
        } // if
    } // for
    await draftOrder.deleteOne({}, { session });
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
        // cart item(s):
        items,
        
        
        
        // shippings:
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        shippingProvider,
        
        
        
        // options: pay manually | paymentSource
        paymentSource,
    } = placeOrderData;
    if (
           !shippingFirstName || (typeof(shippingFirstName) !== 'string')
        || !shippingLastName  || (typeof(shippingLastName) !== 'string')
        
        || !shippingPhone     || (typeof(shippingPhone) !== 'string')
        
        || !shippingAddress   || (typeof(shippingAddress) !== 'string')
        || !shippingCity      || (typeof(shippingCity) !== 'string')
        || !shippingZone      || (typeof(shippingZone) !== 'string')
        || !shippingZip       || (typeof(shippingZip) !== 'string')
        || !shippingCountry   || (typeof(shippingCountry) !== 'string') // todo validate country id
        
        || !shippingProvider  || (typeof(shippingProvider) !== 'string') // todo validate shipping provider
    ) {
        return res.status(400).end(); // bad req
    } // if
    
    
    
    // validate cart items + calculate total prices + calculate shipping cost
    if (!items || !Array.isArray(items) || !items.length) return res.status(400).end(); // bad req
    
    
    
    let orderId       : string|undefined = undefined;
    let paypalOrderId : string|undefined = undefined;
    const session = await startSession();
    try {
        await session.withTransaction(async (): Promise<void> => {
            //#region verify shipping
            const selectedShipping = await Shipping.findOne<Pick<ShippingSchema, 'weightStep'|'shippingRates'|'useSpecificArea'|'countries'>>({
                _id     : shippingProvider,
                enabled : true,
            }, { _id: false, weightStep: true, shippingRates: true, useSpecificArea: true, countries: true });
            if (!selectedShipping) throw 'BAD_SHIPPING';
            
            let shippingRates = selectedShipping.shippingRates;
            const matchingCountry = (selectedShipping.useSpecificArea ?? false) && selectedShipping.countries?.find((coverageCountry) => (coverageCountry.country.toLowerCase() === shippingCountry.toLowerCase()));
            if (matchingCountry) {
                if (matchingCountry.shippingRates?.length) shippingRates = matchingCountry.shippingRates;
                
                const matchingZone = (matchingCountry.useSpecificArea ?? false) && matchingCountry.zones?.find((coverageZone) => (coverageZone.zone.toLowerCase() === shippingZone.toLowerCase()));
                if (matchingZone) {
                    if (matchingZone.shippingRates?.length) shippingRates = matchingZone.shippingRates;
                    
                    const matchingCity = (matchingZone.useSpecificArea ?? false) && matchingZone.cities?.find((coverageCity) => (coverageCity.city.toLowerCase() === shippingCity.toLowerCase()));
                    if (matchingCity) {
                        if (matchingCity.shippingRates?.length) shippingRates = matchingCity.shippingRates;
                    } // if
                } // if
            } // if
            //#endregion verify shipping
            
            
            
            //#region fetch valid products
            interface ProductEntry {
                _id             : string
                name            : string
                price           : number
                shippingWeight ?: number
                stock          ?: number
                
                save            : (options?: object) => Promise<void>
            }
            const productListAdapter = createEntityAdapter<ProductEntry>({
                selectId : (productEntry) => productEntry._id,
            });
            const productList = productListAdapter.addMany(
                productListAdapter.getInitialState(),
                await Product.find({}, { _id: true, name: true, price: true, shippingWeight: true, stock: true }, { session })
            );
            //#endregion fetch valid products
            
            
            
            const usePaypal = (paymentSource !== 'manual');
            
            
            
            //#region verify & convert items
            const itemsConverted : CartEntrySchema[] = [];
            let totalProductPricesConverted = 0, totalProductWeights : number|undefined = undefined;
            for (const item of items) {
                if (!item || (typeof(item) !== 'object')) throw 'INVALID_JSON';
                const {
                    productId,
                    quantity,
                } = item;
                if (!productId || (typeof(productId) !== 'string')) throw 'INVALID_JSON';
                if (!quantity || (typeof(quantity) !== 'number') || !isFinite(quantity) || (quantity < 0)) throw 'INVALID_JSON';
                if ((quantity % 1)) throw 'INVALID_JSON';
                if (quantity === 0) continue;
                
                
                
                const product            = productList.entities[productId];
                if (!product) throw 'INVALID_PRODUCT_ID';
                const productStock       = product.stock;
                if ((productStock !== undefined) && isFinite(productStock)) {
                    if (productStock < quantity) throw 'INSUFFICIENT_PRODUCT_STOCK';
                    
                    //#regon decrease product stock
                    product.stock = (productStock - quantity);
                    await product.save({ session });
                    //#endregon decrease product stock
                } // if
                
                
                
                const unitPrice          = product.price;
                const unitPriceConverted = usePaypal ? (await paypalConvertCurrencyIfRequired(unitPrice)) : unitPrice;
                const unitWeight         = product.shippingWeight;
                
                
                
                itemsConverted.push({
                    product        : new Types.ObjectId(productId) as any,
                    price          : unitPriceConverted,
                    shippingWeight : unitWeight,
                    quantity       : quantity,
                });
                
                
                
                totalProductPricesConverted += unitPriceConverted * quantity;
                totalProductPricesConverted  = trimNumber(totalProductPricesConverted);
                
                
                
                if (unitWeight !== undefined) {
                    if (totalProductWeights === undefined) totalProductWeights = 0; // contains at least 1 PHYSICAL_GOODS
                    
                    totalProductWeights     += unitWeight         * quantity;
                    totalProductWeights      = trimNumber(totalProductWeights);
                } // if
            } // for
            const totalShippingCost          = calculateShippingCost(totalProductWeights, { weightStep: selectedShipping.weightStep, shippingRates: shippingRates ?? ([] as any) });
            const totalShippingCostConverted = usePaypal ? (await paypalConvertCurrencyIfRequired(totalShippingCost)) : totalShippingCost;
            const totalCostConverted         = trimNumber(totalProductPricesConverted + (totalShippingCostConverted ?? 0));
            //#endregion verify & convert items
            
            
            
            //#region fetch paypal API
            if (usePaypal) {
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
                                currency_code         : PAYPAL_CURRENCY,
                                
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
                                        currency_code : PAYPAL_CURRENCY,
                                        value         : totalProductPricesConverted,
                                    },
                                    
                                    // shipping Money|undefined
                                    // The shipping fee for all items within a given purchase_unit. shipping.value can not be a negative number.
                                    shipping          : (totalShippingCostConverted === undefined) ? undefined : {
                                        currency_code : PAYPAL_CURRENCY,
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
                            // The API caller-provided external ID. Used to reconcile client transactions with PayPal transactions. Appears in transaction and settlement reports but is not visible to the payer.
                            custom_id                 : undefined,
                            
                            // description string|undefined
                            // The purchase description.
                            description               : undefined,
                            
                            // items array (contains the item object)
                            // An array of items that the customer purchases from the merchant.
                            items                     : itemsConverted.map((itemConverted) => ({
                                // name string required
                                // The item name or title.
                                name                  : productList.entities[`${itemConverted.product}`]?.name ?? `${itemConverted.product}`,
                                
                                // unit_amount Money required
                                // The item price or rate per unit.
                                unit_amount           : {
                                    // currency_code string required
                                    // The three-character ISO-4217 currency code that identifies the currency.
                                    currency_code     : PAYPAL_CURRENCY,
                                    
                                    // value string required
                                    /*
                                        The value, which might be:
                                        * An integer for currencies like JPY that are not typically fractional.
                                        * A decimal fraction for currencies like TND that are subdivided into thousandths.
                                    */
                                    value             : itemConverted.price,
                                },
                                
                                // quantity string required
                                // The item quantity. Must be a whole number.
                                quantity              : itemConverted.quantity,
                                
                                // category enum|undefined
                                // The item category type.
                                // The possible values are: 'DIGITAL_GOODS'|'PHYSICAL_GOODS'|'DONATION'
                                category              : (itemConverted.shippingWeight === undefined) ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS',
                                
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
            //#endregion fetch paypal API
            
            
            
            //#region create a newDraftOrder
            const newDraftOrders = await DraftOrder.create([{
                items              : await Promise.all(itemsConverted.map(async (itemConverted) => {
                    return {
                        product        : itemConverted.product,
                        price          : usePaypal ? (await paypalRevertCurrencyIfRequired(itemConverted.price)) : itemConverted.price,
                        shippingWeight : itemConverted.shippingWeight,
                        quantity       : itemConverted.quantity,
                    };
                })),
                
                shipping               : {
                    firstName          : shippingFirstName,
                    lastName           : shippingLastName,
                    
                    phone              : shippingPhone,
                    
                    address            : shippingAddress,
                    city               : shippingCity,
                    zone               : shippingZone,
                    zip                : shippingZip,
                    country            : shippingCountry.toUpperCase(),
                },
                shippingProvider       : shippingProvider,
                shippingCost           : usePaypal ? (await paypalRevertCurrencyIfRequired(totalShippingCostConverted)) : totalShippingCostConverted,
                
                expires                : (Date.now() + 60 * 1000),
                
                paypalOrderId          : paypalOrderId,
            }], { session });
            orderId = `#ORDER#${newDraftOrders[0]._id}`;
            //#endregion create a newDraftOrder
        }, { readConcern: 'majority', writeConcern: { w: 'majority' } });
    }
    catch (error: any) {
        // await session.abortTransaction(); // already implicitly aborted
        
        
        
        /*
            Possible client errors:
            * bad shipping
            * bad request JSON
            * invalid product id
            * insufficient product stock
        */
        /*
            Possible server errors:
            * Network error.
            * Unable to generate accessToken (invalid `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and/or invalid `PAYPAL_SECRET`).
            * Configured currency is not supported by PayPal.
            * Invalid API_request body JSON (programming bug).
            * unexpected API response (programming bug).
        */
        switch (error) {
            case 'BAD_SHIPPING'               :
            case 'INVALID_JSON'               :
            case 'INVALID_PRODUCT_ID'         :
            case 'INSUFFICIENT_PRODUCT_STOCK' : {
                return res.status(400).json({error: error});
            } break;
            
            default                           : {
                return res.status(500).json({error: 'internal server error'});
            } break;
        } // switch
    }
    finally {
        await session.endSession();
    } // try
    if (!orderId) throw Error('unkown error');
    
    
    
    // draftOrder created:
    return res.status(200).json({
        orderId: paypalOrderId ?? orderId,
    });
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
    
    
    
    const {
        // marketings:
        marketingOpt,
        
        
        
        // customers:
        customerNickName,
        customerEmail,
        
        
        
        // bilings:
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = paymentData;
    if (
        ((marketingOpt !== undefined) && (typeof(marketingOpt) !== 'boolean'))
        
        || !customerNickName || (typeof(customerNickName) !== 'string')
        || !customerEmail    || (typeof(customerEmail) !== 'string') // TODO: validate email
    ) {
        return res.status(400).end(); // bad req
    } // if
    
    
    
    let paymentResponse : MakePaymentResponse|ErrorResponse|undefined = undefined;
    const session = await startSession();
    try {
        await session.withTransaction(async (): Promise<void> => {
            //#region verify draftOrder_id
            const draftOrder = (
                !!draftOrderId
                ? await DraftOrder.findById(draftOrderId)
                : !!paypalOrderId
                ? await DraftOrder.findOne({ paypalOrderId })
                : undefined
            );
            if (!draftOrder) throw 'DRAFT_ORDER_NOT_FOUND';
            if (draftOrder.expires <= Date.now()) {
                // draftOrder EXPIRED => restore the `Product` stock and delete the `draftOrder`:
                const restoreSession = await startSession();
                try {
                    await restoreSession.withTransaction(async (): Promise<void> => {
                        await revertOrder(restoreSession, { draftOrder });
                    }, { readConcern: 'majority', writeConcern: { w: 'majority' } });
                }
                catch (error: any) {
                    console.log('error: ', error);
                    /* ignore any error */
                }
                finally {
                    await restoreSession.endSession();
                } // try
                
                throw 'DRAFT_ORDER_EXPIRED';
            } // if
            //#endregion verify draftOrder_id
            
            
            
            //#region process the payment
            if (paypalOrderId) {
                const accessToken = await generateAccessToken();
                const url = `${paypalURL}/v2/checkout/orders/${paypalOrderId}/capture`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type'  : 'application/json',
                        'Authorization' : `Bearer ${accessToken}`,
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
                    case 'COMPLETED' : {
                        paymentResponse = { // payment APPROVED
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
                        };
                    }; break;
                    case 'DECLINED'  : {
                        paymentResponse = {  // payment DECLINED
                            error     : 'payment declined',
                        };
                    }; break;
                    default          : {
                        // TODO: log unexpected response
                        console.log('unexpected response: ', paypalPaymentData, captureData);
                        throw Error('unexpected API response');
                    }; break;
                } // switch
            }
            else {
                paymentResponse = { // paylater APPROVED (we waiting for your payment confirmation within xx days)
                    paymentMethod : {
                        type: 'manual',
                    },
                };
            } // if
            //#endregion process the payment
            
            
            
            //#region save the database
            const paymentMethod = (paymentResponse as MakePaymentResponse)?.paymentMethod;
            if (paymentMethod) {
                // payment APPROVED => move the `draftOrder` to `order`:
                await commitOrder(session, {
                    draftOrder       : draftOrder,
                    customer         : {
                        marketingOpt : marketingOpt,
                        
                        nickName     : customerNickName,
                        email        : customerEmail,
                    },
                    billing          : {
                        firstName    : billingFirstName,
                        lastName     : billingLastName,
                        
                        phone        : billingPhone,
                        
                        address      : billingAddress,
                        city         : billingCity,
                        zone         : billingZone,
                        zip          : billingZip,
                        country      : billingCountry,
                    },
                    paymentMethod    : paymentMethod,
                });
            }
            else {
                // payment DECLINED => restore the `Product` stock and delete the `draftOrder`:
                await revertOrder(session, { draftOrder });
            } // if
            //#endregion save the database
        }, { readConcern: 'majority', writeConcern: { w: 'majority' } });
    }
    catch (error: any) {
        // await session.abortTransaction(); // already implicitly aborted
        
        
        
        /*
            Possible client errors:
            * draftOrder_id is not found
            * draftOrder    is expired
        */
        /*
            Possible server errors:
            * Network error.
            * Unable to generate accessToken (invalid `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and/or invalid `PAYPAL_SECRET`).
            * Invalid API_request headers (programming bug).
            * unexpected API response (programming bug).
        */
        switch (error) {
            case 'DRAFT_ORDER_NOT_FOUND' :
            case 'DRAFT_ORDER_EXPIRED'   : {
                return res.status(400).json({error: error});
            } break;
            
            default                      : {
                return res.status(500).json({error: 'internal server error'});
            } break;
        } // switch
    }
    finally {
        await session.endSession();
    } // try
    if (!paymentResponse) throw Error('unkown error');
    
    
    
    // payment approved -or- rejected:
    return res.status(
        (paymentResponse as ErrorResponse)?.error
        ? 402 // payment DECLINED
        : 200 // payment APPROVED
    ).json(paymentResponse);
}

export default nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
})
.get<NextApiRequest, NextApiResponse>(responseGeneratePaymentToken)
.post<NextApiRequest, NextApiResponse>(responsePlaceOrder)
.patch<NextApiRequest, NextApiResponse>(responseMakePayment);
