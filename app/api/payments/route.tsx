// redux:
import {
    createEntityAdapter
}                           from '@reduxjs/toolkit'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

// models:
import type {
    Product,
    
    Customer,
    
    Payment,
    DraftOrder,
    DraftOrdersOnProducts,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// stores:
import type {
    // types:
    CountryPreview,
    PaymentToken,
    PlaceOrderResponse,
    MakePaymentResponse,
}                           from '@/store/features/api/apiSlice'

// templates:
import {
    // types:
    OrderAndData,
    
    
    
    // react components:
    OrderDataContextProviderProps,
    OrderDataContextProvider,
}                           from '@/components/Checkout/templates/orderDataContext'

// configs:
import {
    COMMERCE_CURRENCY,
    COMMERCE_CURRENCY_FRACTION_UNIT,
    COMMERCE_CURRENCY_FRACTION_ROUNDING,
    
    PAYPAL_CURRENCY,
    PAYPAL_CURRENCY_FRACTION_UNIT,
    PAYPAL_CURRENCY_FRACTION_ROUNDING,
}                           from '@/commerce.config'
import {
    checkoutConfig,
}                           from '@/checkout.config.server'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    getMatchingShipping,
    calculateShippingCost,
}                           from '@/libs/shippings'
import {
    downloadImageAsBase64,
}                           from '@/libs/images'
import {
    resolveEmailConfig,
}                           from './utilities'



// utilities:

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
const generatePaymentToken = async (): Promise<PaymentToken> => {
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
    
    const expiresIn = (paymentTokenData.expires_in ?? 3600) * 1000;
    return {
        paymentToken : paymentTokenData.client_token,
        expiresAt    : Date.now() +  expiresIn,
        refreshAt    : Date.now() + (expiresIn * paymentTokenExpiresThreshold),
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
    expires : new Date(),
    rates   : new Map<string, number>(),
};
const getCurrencyRate = async (toCurrency: string): Promise<number> => {
    if (currencyExchange.expires <= new Date()) {
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
        
        currencyExchange.expires = new Date(Date.now() + (1 * 3600 * 1000));
    } // if
    
    
    
    const toRate = currencyExchange.rates.get(toCurrency);
    if (toRate === undefined) throw Error('unknown currency');
    return 1 / toRate;
}



const getPaypalCurrencyConverter      = async (currency?: string): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(currency || PAYPAL_CURRENCY),
        fractionUnit : PAYPAL_CURRENCY_FRACTION_UNIT,
    };
}
const paypalConvertCurrencyIfRequired = async <TNumber extends number|null>(from: TNumber, currency?: string): Promise<TNumber> => {
    // conditions:
    if (typeof(from) !== 'number') return from;
    
    
    
    const {rate, fractionUnit} = await getPaypalCurrencyConverter(currency);
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
const paypalRevertCurrencyIfRequired  = async <TNumber extends number|null>(from: TNumber, currency?: string): Promise<TNumber> => {
    // conditions:
    if (typeof(from) !== 'number') return from;
    
    
    
    const {rate}       = await getPaypalCurrencyConverter(currency);
    const fractionUnit = COMMERCE_CURRENCY_FRACTION_UNIT;
    const rawReverted  = from * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[COMMERCE_CURRENCY_FRACTION_ROUNDING];
    const fractions    = rounding(rawReverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}



type CommitCustomer = Omit<Customer,
    |'id'
    |'createdAt'
    |'updatedAt'
>
type CommitDraftOrder = Omit<DraftOrder,
    |'createdAt'
    |'updatedAt'
    
    |'paypalOrderId'
> & {
    items : Omit<DraftOrdersOnProducts,
        |'id'
        
        |'draftOrderId'
    >[]
}
const commitOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], { draftOrder, customer, payment } : { draftOrder: CommitDraftOrder, customer: CommitCustomer, payment: Payment }): Promise<OrderAndData> => {
    const newOrder = await prismaTransaction.order.create({
        data   : {
            orderId          : draftOrder.orderId,
            
            items            : {
                create           : draftOrder.items,
            },
            
            customer         : {
                create           : {
                    marketingOpt : customer.marketingOpt,
                    
                    nickName     : customer.nickName,
                    email        : customer.email,
                },
            },
            
            shippingAddress  : draftOrder.shippingAddress,
            shippingCost     : draftOrder.shippingCost,
            shippingProvider : !draftOrder.shippingProviderId ? undefined : {
                connect          : {
                    id           : draftOrder.shippingProviderId,
                },
            },
            
            payment          : payment,
        },
        // select : {
        //     id : true,
        // },
        include : {
            items : {
                select : {
                    // data:
                    price          : true,
                    shippingWeight : true,
                    quantity       : true,
                    
                    // relations:
                    product        : {
                        select : {
                            name   : true,
                            images : true,
                        },
                    },
                },
            },
            shippingProvider : {
                select : {
                    name            : true, // optional for displaying email report
                    
                    weightStep      : true, // required for calculating `getMatchingShipping()`
                    
                    estimate        : true, // optional for displaying email report
                    shippingRates   : true, // required for calculating `getMatchingShipping()`
                    
                    useSpecificArea : true, // required for calculating `getMatchingShipping()`
                    countries       : true, // required for calculating `getMatchingShipping()`
                },
            },
        },
    });
    await prismaTransaction.draftOrder.delete({
        where  : {
            id : draftOrder.id,
        },
        select : {
            id : true,
        },
    });
    const shippingAddress  = newOrder.shippingAddress;
    const shippingProvider = newOrder.shippingProvider;
    return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name        : item.product.name,
                image       : item.product.images?.[0] ?? null,
                imageBase64 : undefined,
                imageId     : undefined,
            } : null,
        })),
        shippingProvider : (
            (shippingAddress && shippingProvider)
            ? getMatchingShipping(shippingProvider, { city: shippingAddress.city, zone: shippingAddress.zone, country: shippingAddress.country })
            : null
        ),
    };
}

type RevertDraftOrder = Pick<DraftOrder,
    |'id'
    
    |'orderId'
> & {
    items : Pick<DraftOrdersOnProducts,
        |'productId'
        
        |'quantity'
    >[]
}
const revertOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], { draftOrder } : { draftOrder: RevertDraftOrder }) => {
    for (const {productId, quantity} of draftOrder.items) {
        if (!productId) continue;
        
        
        
        await prismaTransaction.product.update({
            where  : {
                id : productId,
            },
            data   : {
                stock : { decrement: quantity }
            },
            select : {
                id : true,
            },
        });
    } // for
    await prismaTransaction.draftOrder.delete({
        where  : {
            id : draftOrder.id,
        },
        select : {
            id : true,
        },
    });
}



// types:
interface ErrorResponse {
    error : string
}



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    // handler as PUT,
    handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router

/**
 * intialize paymentToken
 */
.get(async (req) => {
    const paymentToken : PaymentToken = await generatePaymentToken();
    return NextResponse.json(paymentToken); // handled with success
})

/**
 * place the order and calculate the total price (not relying priceList on the client_side)
 */
.post(async (req) => {
    const placeOrderData = await req.json();
    if (typeof(placeOrderData) !== 'object') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    //#region validate shipping address
    const {
        // shippings:
        shippingFirstName,
        shippingLastName,
        
        shippingPhone,
        
        shippingAddress,
        shippingCity,
        shippingZone,
        shippingZip,
        shippingCountry,
        
        shippingProvider : shippingProviderId,
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
        
        || !shippingProviderId  || (typeof(shippingProviderId) !== 'string') // todo validate shipping provider
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate shipping address
    
    
    
    //#region validate cart items: check format
    const {
        // cart item(s):
        items,
    } = placeOrderData;
    if (!items || !Array.isArray(items) || !items.length) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    type RequiredNonNullable<T> = {
        [P in keyof T]: NonNullable<T[P]>
    };
    const validFormattedItems : RequiredNonNullable<Pick<DraftOrdersOnProducts, 'productId'|'quantity'>>[] = [];
    for (const item of items) {
        // validations:
        if (!item || (typeof(item) !== 'object'))  throw 'INVALID_JSON';
        const {
            productId,
            quantity,
        } = item;
        if (typeof(productId) !== 'string')        throw 'INVALID_JSON';
        if (!productId.length)                     throw 'INVALID_JSON';
        if (typeof(quantity)  !== 'number')        throw 'INVALID_JSON';
        if (!isFinite(quantity) || (quantity < 1)) throw 'INVALID_JSON';
        if ((quantity % 1))                        throw 'INVALID_JSON';
        
        
        
        // collects:
        validFormattedItems.push({
            productId,
            quantity,
        });
    } // for
    //#endregion validate cart items: check format
    
    
    
    //#region generate a unique orderId
    const nanoid = customAlphabet('0123456789', 16);
    const tempOrderId = await nanoid();
    //#endregion generate a unique orderId
    
    
    
    let orderId       : string;
    let paypalOrderId : string|null;
    try {
        ({orderId, paypalOrderId} = await prisma.$transaction(async (prismaTransaction): Promise<{ orderId: string, paypalOrderId: string|null }> => {
            //#region batch queries
            const [selectedShipping, validExistingProducts, foundOrderIdInDraftOrder, foundOrderIdInOrder] = await Promise.all([
                prismaTransaction.shippingProvider.findUnique({
                    where  : {
                        id      : shippingProviderId,
                        enabled : true,
                    },
                    select : {
                        weightStep      : true,
                        
                        shippingRates   : true,
                        
                        useSpecificArea : true,
                        countries       : true,
                    },
                }),
                prismaTransaction.product.findMany({
                    where  : {
                        id         : { in : validFormattedItems.map((item) => item.productId) },
                        visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                    },
                    select : {
                        id             : true,
                        
                        name           : true,
                        
                        price          : true,
                        shippingWeight : true,
                        
                        stock          : true,
                    },
                }),
                prismaTransaction.draftOrder.count({
                    where : {
                        orderId : tempOrderId,
                    },
                    take : 1,
                }),
                prismaTransaction.order.count({
                    where : {
                        orderId : tempOrderId,
                    },
                    take : 1,
                }),
            ]);
            //#endregion batch queries
            
            
            
            //#region re-generate a unique orderId
            const orderId = await (async (): Promise<string> => {
                if (!foundOrderIdInDraftOrder && !foundOrderIdInOrder) {
                    return tempOrderId;
                }
                else {
                    for (let attempts = 10; attempts > 0; attempts--) {
                        const tempOrderId = await nanoid();
                        const [foundOrderIdInDraftOrder, foundOrderIdInOrder] = await Promise.all([
                            prismaTransaction.draftOrder.count({
                                where : {
                                    orderId : tempOrderId,
                                },
                                take : 1,
                            }),
                            prismaTransaction.order.count({
                                where : {
                                    orderId : tempOrderId,
                                },
                                take : 1,
                            }),
                        ]);
                        if (!foundOrderIdInDraftOrder && !foundOrderIdInOrder) return tempOrderId;
                    } // for
                    console.log('INTERNAL ERROR AT GENERATE UNIQUE ID');
                    throw 'INTERNAL_ERROR';
                } // if
            })();
            //#endregion re-generate a unique orderId
            
            
            
            //#region validate shipping
            if (!selectedShipping) throw 'BAD_SHIPPING';
            
            const matchingShipping = getMatchingShipping(selectedShipping, { city: shippingCity, zone: shippingZone, country: shippingCountry });
            if (!matchingShipping) throw 'BAD_SHIPPING';
            //#endregion validate shipping
            
            
            
            //#region validate cart items: check existing products => check product quantities => create detailed items
            const {
                // options: pay manually | paymentSource
                paymentSource,
            } = placeOrderData;
            const usePaypal = (paymentSource !== 'manual');
            
            
            
            const detailedItems    : (Omit<DraftOrdersOnProducts, 'id'|'draftOrderId'> & { productName: string })[] = [];
            const reduceStockItems : (RequiredNonNullable<Pick<DraftOrdersOnProducts, 'productId'>> & { quantity: number })[] = [];
            let totalProductPricesConverted = 0, totalProductWeights : number|null = null;
            {
                const productListAdapter = createEntityAdapter<
                    Pick<Product,
                        |'id'
                        |'name'
                        |'price'
                        |'shippingWeight'
                        |'stock'
                    >
                >({
                    selectId : (productData) => productData.id,
                });
                const productList = productListAdapter.addMany(
                    productListAdapter.getInitialState(),
                    validExistingProducts
                ).entities;
                
                
                
                for (const { productId, quantity } of validFormattedItems) {
                    const product = productList[productId];
                    if (!product) throw 'INVALID_PRODUCT_ID';
                    
                    
                    
                    const stock = productList[productId]?.stock;
                    if (typeof(stock) === 'number') {
                        if (quantity > stock) throw 'INSUFFICIENT_PRODUCT_STOCK';
                        
                        reduceStockItems.push({
                            productId      : productId,
                            quantity       : quantity,
                        });
                    } // if
                    
                    
                    
                    const unitPrice          = product.price;
                    const unitPriceConverted = usePaypal ? (await paypalConvertCurrencyIfRequired(unitPrice)) : unitPrice;
                    const unitWeight         = product.shippingWeight ?? null;
                    
                    
                    
                    detailedItems.push({
                        productId      : productId,
                        productName    : product.name,
                        
                        price          : unitPriceConverted,
                        shippingWeight : unitWeight,
                        quantity       : quantity,
                    });
                    
                    
                    
                    totalProductPricesConverted += unitPriceConverted * quantity;
                    totalProductPricesConverted  = trimNumber(totalProductPricesConverted);
                    
                    
                    
                    if (unitWeight !== null) {
                        if (totalProductWeights === null) totalProductWeights = 0; // contains at least 1 PHYSICAL_GOODS
                        
                        totalProductWeights     += unitWeight         * quantity;
                        totalProductWeights      = trimNumber(totalProductWeights);
                    } // if
                } // for
            }
            const totalShippingCost          = calculateShippingCost(totalProductWeights, matchingShipping);
            const totalShippingCostConverted = usePaypal ? (await paypalConvertCurrencyIfRequired(totalShippingCost)) : totalShippingCost;
            const totalCostConverted         = trimNumber(totalProductPricesConverted + (totalShippingCostConverted ?? 0));
            //#endregion validate cart items: check existing products => check product quantities => create detailed items
            
            
            
            //#region decrease product stock
            for (const {productId, quantity} of reduceStockItems) {
                await prismaTransaction.product.update({
                    where  : {
                        id : productId,
                    },
                    data   : {
                        stock : { decrement: quantity }
                    },
                    select : {
                        id : true,
                    },
                });
            } // for
            //#endregion decrease product stock
            
            
            
            //#region fetch paypal API
            let paypalOrderId : string|null;
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
                                    shipping          : (totalShippingCostConverted === null) ? undefined : {
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
                            items                     : detailedItems.map((detailedItem) => ({
                                // name string required
                                // The item name or title.
                                name                  : detailedItem.productName,
                                
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
                                    value             : detailedItem.price,
                                },
                                
                                // quantity string required
                                // The item quantity. Must be a whole number.
                                quantity              : detailedItem.quantity,
                                
                                // category enum|undefined
                                // The item category type.
                                // The possible values are: 'DIGITAL_GOODS'|'PHYSICAL_GOODS'|'DONATION'
                                category              : (typeof(detailedItem.shippingWeight) === 'number') ? 'PHYSICAL_GOODS' : 'DIGITAL_GOODS',
                                
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
            }
            else {
                paypalOrderId = null;
            } // if
            //#endregion fetch paypal API
            
            
            
            //#region create a newDraftOrder
            await prismaTransaction.draftOrder.create({
                data : {
                    expiresAt                  : new Date(Date.now() + (1 * 60 * 1000)),
                    
                    orderId                    : orderId,
                    paypalOrderId              : paypalOrderId,
                    
                    items                      : {
                        create                 : await Promise.all(detailedItems.map(async (detailedItem) => {
                            return {
                                product        : {
                                    connect    : {
                                        id     : detailedItem.productId,
                                    },
                                },
                                
                                price          : usePaypal ? (await paypalRevertCurrencyIfRequired(detailedItem.price)) : detailedItem.price,
                                shippingWeight : detailedItem.shippingWeight,
                                quantity       : detailedItem.quantity,
                            };
                        })),
                    },
                    
                    shippingAddress            : {
                        firstName              : shippingFirstName,
                        lastName               : shippingLastName,
                        
                        phone                  : shippingPhone,
                        
                        address                : shippingAddress,
                        city                   : shippingCity,
                        zone                   : shippingZone,
                        zip                    : shippingZip,
                        country                : shippingCountry.toUpperCase(),
                    },
                    shippingCost               : usePaypal ? (await paypalRevertCurrencyIfRequired(totalShippingCostConverted)) : totalShippingCostConverted,
                    shippingProvider           : {
                        connect                : {
                            id                 : shippingProviderId,
                        },
                    },
                },
                select : {
                    id : true,
                },
            });
            //#endregion create a newDraftOrder
            
            
            
            // report the createOrder result:
            return {
                orderId,
                paypalOrderId,
            };
        }));
    }
    catch (error: any) {
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
                console.log('ERROR: ', error);
                return NextResponse.json({
                    error: error,
                }, { status: 400 }); // handled with error
            } break;
            
            default                           : {
                console.log('ERROR: ', error);
                return NextResponse.json({
                    error: 'internal server error',
                }, { status: 500 }); // handled with error
            } break;
        } // switch
    } // try
    
    
    
    // draftOrder created:
    const placeOrderResponse : PlaceOrderResponse = {
        orderId: paypalOrderId ?? `#ORDER_${orderId}`,
    };
    return NextResponse.json(placeOrderResponse); // handled with success
})

/**
 * purchase the previously posted order
 */
.patch(async (req) => {
    const paymentData = await req.json();
    console.log('paymentData: ', paymentData);
    if (typeof(paymentData) !== 'object') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    const rawOrderId = paymentData.orderId;
    if (typeof(rawOrderId) !== 'string') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let orderId       : string|null = null;
    let paypalOrderId : string|null = null;
    if (rawOrderId.startsWith('#ORDER_')) {
        orderId = rawOrderId.slice(7);
        if (!orderId.length) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
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
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let paymentResponse : MakePaymentResponse|ErrorResponse;
    let newOrder        : OrderAndData|undefined = undefined;
    let countryList     : EntityState<CountryPreview>;
    try {
        const newCustomer : CommitCustomer = {
            marketingOpt  : marketingOpt,
            
            nickName      : customerNickName,
            email         : customerEmail,
        };
        
        ([paymentResponse, newOrder, countryList] = await prisma.$transaction(async (prismaTransaction): Promise<readonly [MakePaymentResponse|ErrorResponse, OrderAndData|undefined, EntityState<CountryPreview>]> => {
            //#region verify draftOrder_id
            const requiredSelect = {
                id                     : true,
                expiresAt              : true,
                
                orderId                : true,
                
                shippingAddress        : true,
                shippingCost           : true,
                shippingProviderId     : true,
                
                items : {
                    select : {
                        productId      : true,
                        
                        price          : true,
                        shippingWeight : true,
                        quantity       : true,
                    },
                },
            };
            const draftOrder = (
                !!orderId
                ? await prismaTransaction.draftOrder.findUnique({
                    where  : {
                        orderId       : orderId,
                    },
                    select  : requiredSelect,
                })
                : !!paypalOrderId
                ? await prismaTransaction.draftOrder.findUnique({
                    where : {
                        paypalOrderId : paypalOrderId
                    },
                    select : requiredSelect,
                })
                : null
            );
            if (!draftOrder) throw 'DRAFT_ORDER_NOT_FOUND';
            
            
            
            if (draftOrder.expiresAt <= new Date()) {
                // draftOrder EXPIRED => restore the `Product` stock and delete the `draftOrder`:
                try {
                        await revertOrder(prismaTransaction, { draftOrder });
                }
                catch (error: any) {
                    console.log('error: ', error);
                    /* ignore any error */
                } // try
                
                throw 'DRAFT_ORDER_EXPIRED';
            } // if
            //#endregion verify draftOrder_id
            
            
            
            //#region related data
            const allCountries = await prismaTransaction.country.findMany({
                select : {
                    name    : true,
                    
                    code    : true,
                },
                // enabled: true
            });
            const countryListAdapter = createEntityAdapter<CountryPreview>({
                selectId : (countryEntry) => countryEntry.code,
            });
            const countryList = countryListAdapter.addMany(
                countryListAdapter.getInitialState(),
                allCountries
            );
            //#endregion related data
            
            
            
            //#region process the payment
            let paymentResponse : MakePaymentResponse|ErrorResponse;
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
                const paymentBreakdown      = captureData?.seller_receivable_breakdown;
                const paymentAmountCurrency : string = paymentBreakdown?.gross_amount?.currency_code || '';
                const paymentAmount         = Number.parseFloat(paymentBreakdown?.gross_amount?.value);
                const paymentFeeCurrency    : string = paymentBreakdown?.paypal_fee?.currency_code || '';
                const paymentFee            = Number.parseFloat(paymentBreakdown?.paypal_fee?.value);
                
                
                
                switch (captureData?.status) {
                    case 'COMPLETED' : {
                        paymentResponse = { // payment APPROVED
                            payment : await (async (): Promise<Omit<Payment, 'billingAddress'>> => {
                                const payment_source = paypalPaymentData?.payment_source;
                                
                                const card = payment_source?.card;
                                if (card) {
                                    return {
                                        type       : 'CARD',
                                        brand      : card.brand?.toLowerCase() ?? null,
                                        identifier : card.last_digits ? `ending with ${card.last_digits}` : null,
                                        
                                        amount     : await paypalRevertCurrencyIfRequired(paymentAmount, paymentAmountCurrency),
                                        fee        : await paypalRevertCurrencyIfRequired(paymentFee   , paymentFeeCurrency),
                                    };
                                } //if
                                
                                const paypal = payment_source?.paypal;
                                if (paypal) {
                                    return {
                                        type       : 'PAYPAL',
                                        brand      : 'paypal',
                                        identifier : paypal.email_address || null,
                                        
                                        amount     : await paypalRevertCurrencyIfRequired(paymentAmount, paymentAmountCurrency),
                                        fee        : await paypalRevertCurrencyIfRequired(paymentFee   , paymentFeeCurrency),
                                    };
                                } //if
                                
                                return {
                                    type       : 'CUSTOM',
                                    brand      : null,
                                    identifier : null,
                                    
                                    amount     : await paypalRevertCurrencyIfRequired(paymentAmount, paymentAmountCurrency),
                                    fee        : await paypalRevertCurrencyIfRequired(paymentFee   , paymentFeeCurrency),
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
                    payment : {
                        type       : 'MANUAL',
                        brand      : null,
                        identifier : null,
                        
                        amount     : 0,
                        fee        : 0,
                    },
                };
            } // if
            //#endregion process the payment
            
            
            
            //#region save the database
            let newOrder : OrderAndData|undefined = undefined;
            const paymentPartial = !('error' in paymentResponse) ? paymentResponse.payment : undefined;
            if (paymentPartial) {
                // payment APPROVED => move the `draftOrder` to `order`:
                newOrder = await commitOrder(prismaTransaction, {
                    draftOrder         : draftOrder,
                    customer           : newCustomer,
                    payment            : {
                        ...paymentPartial,
                        billingAddress : {
                            firstName  : billingFirstName,
                            lastName   : billingLastName,
                            
                            phone      : billingPhone,
                            
                            address    : billingAddress,
                            city       : billingCity,
                            zone       : billingZone,
                            zip        : billingZip,
                            country    : billingCountry,
                        },
                    },
                });
            }
            else {
                // payment DECLINED => restore the `Product` stock and delete the `draftOrder`:
                await revertOrder(prismaTransaction, { draftOrder });
            } // if
            //#endregion save the database
            
            
            
            // report the payment result:
            return [paymentResponse, newOrder, countryList];
        }));
        
        
        
        //#region send email confirmation
        if (newOrder) {
            //#region download image url to base64
            const newOrderItems = newOrder.items;
            const imageUrls     = newOrderItems.map((item) => item.product?.image);
            const imageBase64s  = await Promise.all(
                imageUrls.map(async (imageUrl): Promise<string|undefined> => {
                    if (!imageUrl) return undefined;
                    const resolvedImageUrl = resolveMediaUrl(imageUrl);
                    if (!resolvedImageUrl) return undefined;
                    try {
                        return await downloadImageAsBase64(resolvedImageUrl, 64);
                    }
                    catch (error: any) { // silently ignore the error and resulting as undefined:
                        console.log('ERROR DOWNLOADING IMAGE: ', error);
                        return undefined;
                    } // if
                })
            );
            console.log('downloaded images: ', imageBase64s);
            imageBase64s.forEach((imageBase64, index) => {
                if (!imageBase64) return;
                const itemProduct = newOrderItems[index].product;
                if (!itemProduct) return;
                itemProduct.imageBase64 = imageBase64;
                itemProduct.imageId     = `i${index}`;
            });
            //#endregion download image url to base64
            
            
            
            try {
                const customerOrderConfirmation = await resolveEmailConfig(checkoutConfig.emails.customerOrderConfirmation);
                
                
                
                const { renderToStaticMarkup } = await import('react-dom/server');
                const orderDataContextProviderProps : OrderDataContextProviderProps = {
                    // data:
                    order       : newOrder,
                    customer    : newCustomer,
                    isPaid      : !('error' in paymentResponse) && (paymentResponse.payment.type !== 'MANUAL'),
                    
                    
                    
                    // relation data:
                    countryList : countryList,
                };
                
                
                
                const transporter = nodemailer.createTransport({
                    host     :  process.env.EMAIL_CHECKOUT_SERVER_HOST ?? '',
                    port     : Number.parseInt(process.env.EMAIL_CHECKOUT_SERVER_PORT ?? '465'),
                    secure   : (process.env.EMAIL_CHECKOUT_SERVER_SECURE === 'true'),
                    auth     : {
                        user :  process.env.EMAIL_CHECKOUT_SERVER_USERNAME,
                        pass :  process.env.EMAIL_CHECKOUT_SERVER_PASSWORD,
                    },
                });
                try {
                    console.log('sending email...');
                    await transporter.sendMail({
                        from        : process.env.EMAIL_CHECKOUT_FROM, // sender address
                        to          : customerEmail, // list of receivers
                        subject     : renderToStaticMarkup(
                            <OrderDataContextProvider {...orderDataContextProviderProps}>
                                {customerOrderConfirmation.subject}
                            </OrderDataContextProvider>
                        ),
                        html        : renderToStaticMarkup(
                            <OrderDataContextProvider {...orderDataContextProviderProps}>
                                {customerOrderConfirmation.message}
                            </OrderDataContextProvider>
                        ),
                        attachments : (
                            newOrderItems
                            .filter(({product}) => !!product && !!product.imageBase64 && !!product.imageId)
                            .map(({product}) => ({
                                path : product?.imageBase64,
                                cid  : product?.imageId,
                            }))
                        ),
                    });
                    console.log('email sent.');
                }
                finally {
                    transporter.close();
                } // try
            }
            catch (error: any) {
                console.log('ERROR: ', error);
                // ignore send email error
            } // try
        } // if
        //#endregion send email confirmation
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
                return NextResponse.json({
                    error: error,
                }, { status: 400 }); // handled with error
            } break;
            
            default                      : {
                console.log('UNKNOWN ERROR: ',  error)
                return NextResponse.json({
                    error: 'internal server error',
                }, { status: 500 }); // handled with error
            } break;
        } // switch
    } // try
    
    
    
    // payment approved -or- rejected:
    return NextResponse.json(paymentResponse, {
        status : (
            ('error' in paymentResponse)
            ? 402 // payment DECLINED
            : 200 // payment APPROVED
        ),
    });
});
