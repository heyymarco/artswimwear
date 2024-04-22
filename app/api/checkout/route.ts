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

// models:
import type {
    Product,
    Variant,
    VariantGroup,
    Stock,
    
    Payment,
    PaymentConfirmation,
    PreferredCurrency,
    DraftOrdersOnProducts,
    ShippingTracking,
    ShippingTrackingLog,
}                           from '@prisma/client'
import {
    DetailedItem,
    
    AuthorizedFundData,
    PaidFundData,
    
    isAuthorizedFundData,
    isPaidFundData,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// apis:
import type {
    CountryPreview,
}                           from '@/app/api/countries/route'

// templates:
import type {
    // types:
    OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'

// paypal:
import type {
    CreateOrderData,
}                           from '@paypal/paypal-js'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// internals:
import {
    // types:
    CommitCustomerOrGuest,
    
    
    
    
    sumReducer,
    
    createDraftOrder,
    cancelDraftOrder,
    createOrder,
    commitOrder,
    revertOrder,
    
    sendEmailConfirmation,
}                           from './utilities'
import {
    // types:
    PaypalPaymentToken,
    
    
    
    // utilities:
    paypalCreatePaymentToken,
    paypalCreateOrder,
    paypalCaptureFund,
}                           from './paymentProcessors.paypal'
import {
    midtransCreateOrderWithCard,
    midtransCreateOrderWithQris,
    midtransCaptureFund,
    midtransCancelOrder,
}                           from './paymentProcessors.midtrans'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'
import {
    getCurrencyRate,
    
    convertCustomerCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'
import {
    getMatchingShipping,
    calculateShippingCost,
}                           from '@/libs/shippings'
import {
    possibleTimezoneValues,
}                           from '@/components/editors/TimezoneEditor/types'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'
import {
    paymentConfig,
}                           from '@/payment.config'



// types:
export interface PaymentToken extends PaypalPaymentToken {}

export interface CartEntry {
    productId   : string
    variantIds  : string[]
    quantity    : number
}
export interface CartData {
    // cart data:
    items              : CartEntry[]
}
export interface ExtraData {
    // extra data:
    marketingOpt       : boolean
}
export interface CustomerData {
    // customer data:
    customerName       : string
    customerEmail      : string
}
export interface ShippingData {
    // shipping data:
    shippingFirstName  : string
    shippingLastName   : string
    
    shippingPhone      : string
    
    shippingAddress    : string
    shippingCity       : string
    shippingZone       : string
    shippingZip        : string
    shippingCountry    : string
    
    shippingProvider  ?: string
}
export interface BillingData {
    // billing data:
    billingFirstName   : string
    billingLastName    : string
    
    billingPhone       : string
    
    billingAddress     : string
    billingCity        : string
    billingZone        : string
    billingZip         : string
    billingCountry     : string
}

export interface PlaceOrderOptions extends Omit<Partial<CreateOrderData>, 'paymentSource'> {
    paymentSource ?: Partial<CreateOrderData>['paymentSource']|'manual'|'midtransCard'|'midtransQris'
    cardToken     ?: string
    acquirer      ?: string
    simulateOrder ?: boolean
    captcha       ?: string
}
export interface CurrencyOptions {
    preferredCurrency ?: PreferredCurrency['currency']
}
export interface PlaceOrderDataBasic
    extends
        CartData,              // cart item(s)
        
        Partial<ExtraData>,    // extra data
        Partial<CustomerData>, // customer data
        
        PlaceOrderOptions,     // options: pay manually | paymentSource
        CurrencyOptions        // options: preferredCurrency
{
}
export interface PlaceOrderDataWithShippingAddress
    extends
        PlaceOrderDataBasic,
        ShippingData // shippings
{
}
export interface PlaceOrderDataWithBillingAddress
    extends
        PlaceOrderDataBasic,
        BillingData // billings
{
}
export type PlaceOrderData =
    |PlaceOrderDataBasic
    |PlaceOrderDataWithShippingAddress
    |PlaceOrderDataWithBillingAddress
    |(PlaceOrderDataWithShippingAddress & PlaceOrderDataWithBillingAddress)
export interface DraftOrderDetail
{
    orderId      : string
    redirectData : string|undefined
}

export interface MakePaymentOptions {
    cancelOrder ?: true
}
export interface MakePaymentDataBasic
    extends
        ExtraData,         // extra data
        CustomerData,      // customer data
        
        Omit<MakePaymentOptions, 'cancelOrder'> // options: empty yet
{
    orderId : string
}
export interface MakePaymentDataWithBillingAddress
    extends
        MakePaymentDataBasic,
        BillingData  // billing data
{
}
export interface MakePaymentDataWithCancelation
    extends
        Pick<MakePaymentDataBasic, 'orderId'>,
        Required<Pick<MakePaymentOptions, 'cancelOrder'>>
{
}
export type MakePaymentData =
    |MakePaymentDataBasic
    |MakePaymentDataWithBillingAddress
    |MakePaymentDataWithCancelation
export interface PaymentDetail
    extends
        Omit<Payment,
            |'billingAddress'
        >
{
}
export interface PaymentDeclined {
    error : string
}

export interface PaymentConfirmationRequest {
    paymentConfirmation : Partial<PaymentConfirmationDetail> & {
        token : string
    }
}
export interface PaymentConfirmationDetail
    extends
        Pick<PaymentConfirmation,
            |'reportedAt'
            |'reviewedAt'
            
            |'amount'
            |'payerName'
            |'paymentDate'
            |'preferredTimezone'
            
            |'originatingBank'
            |'destinationBank'
            
            |'rejectionReason'
        >
{
    currency : string
}

export interface ShippingTrackingRequest {
    shippingTracking : Partial<Pick<ShippingTrackingDetail, 'preferredTimezone'>> & {
        token : string
    }
}
export interface ShippingTrackingDetail
    extends
        Pick<ShippingTracking,
            |'shippingCarrier'
            |'shippingNumber'
            
            |'preferredTimezone'
        >
{
    shippingTrackingLogs : Omit<ShippingTrackingLog, 'id'|'shippingTrackingId'>[]
}

export interface LimitedStockItem {
    productId   : string
    variantIds  : string[]
    stock       : number
}
class OutOfStockError extends Error {
    limitedStockItems : LimitedStockItem[];
    constructor(limitedStockItems : LimitedStockItem[]) {
        super('out of stock');
        this.limitedStockItems = limitedStockItems;
    }
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
    const paymentToken : PaypalPaymentToken = await paypalCreatePaymentToken();
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
    
    
    
    //#region validate options
    const {
        preferredCurrency : preferredCurrencyRaw = paymentConfig.defaultPaymentCurrency,
        paymentSource, // options: pay manually | paymentSource
        simulateOrder = false,
    } = placeOrderData;
    if ((typeof(preferredCurrencyRaw) !== 'string') || !paymentConfig.paymentCurrencyOptions.includes(preferredCurrencyRaw)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const preferredCurrency : string = preferredCurrencyRaw;
    
    if ((paymentSource !== undefined) && ((typeof(paymentSource) !== 'string') || !paymentSource)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((simulateOrder !== undefined) && (typeof(simulateOrder) !== 'boolean')) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    const usePaypalGateway   = !simulateOrder && !['manual', 'midtransCard', 'midtransQris'].includes(paymentSource); // if undefined || not 'manual' => use paypal gateway
    const useMidtransGateway = !simulateOrder &&  ['midtransCard', 'midtransQris'].includes(paymentSource);
    
    if (usePaypalGateway && !paymentConfig.paymentProcessors.paypal.supportedCurrencies.includes(preferredCurrency)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (useMidtransGateway && !paymentConfig.paymentProcessors.midtrans.supportedCurrencies.includes(preferredCurrency)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    let cardToken : string|null = null;
    let acquirer  : string|null = null;
    if (useMidtransGateway) {
        const {
            cardToken: cardTokenRaw,
            acquirer : acquirerRaw,
        } = placeOrderData;
        
        if (paymentSource === 'midtransCard') {
            if ((typeof(cardTokenRaw) !== 'string') || !cardTokenRaw) {
                return NextResponse.json({
                    error: 'Invalid data.',
                }, { status: 400 }); // handled with error
            } // if
            cardToken = cardTokenRaw;
        } // if
        
        if (paymentSource === 'midtransQris') {
            if ((typeof(acquirerRaw) !== 'string') || !acquirerRaw) {
                return NextResponse.json({
                    error: 'Invalid data.',
                }, { status: 400 }); // handled with error
            } // if
            acquirer = acquirerRaw;
        } // if
    } // if
    //#endregion validate options
    
    
    
    //#region validate customer data & extra
    const {
        // marketings:
        marketingOpt,
        
        
        
        // customers:
        customerName,
        customerEmail,
    } = placeOrderData;
    if (!simulateOrder) {
        if (
            ((marketingOpt !== undefined) && (typeof(marketingOpt) !== 'boolean'))
            
            || !customerName || (typeof(customerName) !== 'string')
            || !customerEmail    || (typeof(customerEmail) !== 'string') // TODO: validate email
        ) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate customer data & extra
    
    
    
    //#region validate captcha for manual payment
    if (paymentSource === 'manual') {
        const captcha = placeOrderData.captcha;
        if (!captcha || (typeof(captcha) !== 'string') || !captcha) {
            return NextResponse.json({
                error: 'Invalid captcha.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        // validate captcha:
        try {
            const response = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${captcha}`
            );
            if (!response.ok) {
                return NextResponse.json({
                    error: 'Invalid captcha.',
                }, { status: 400 }); // handled with error
            } // if
            
            const json = await response.json();
            /*
                invalid:
                { success: false, 'error-codes': [ 'invalid-input-response' ] }
                
                valid:
                { success: true, challenge_ts: '2024-01-01T04:24:34Z', hostname: 'localhost' }
            */
            if (!json.success) {
                return NextResponse.json({
                    error: 'Invalid captcha.',
                }, { status: 400 }); // handled with error
            } // if
        }
        catch {
            return NextResponse.json({
                error: 'Invalid captcha.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate captcha for manual payment
    
    
    
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
    const hasShippingAddress = (
        !!shippingFirstName ||
        !!shippingLastName ||
        
        !!shippingPhone ||
        
        !!shippingAddress ||
        !!shippingCity ||
        !!shippingZone ||
        !!shippingZip ||
        !!shippingCountry ||
        
        !!shippingProviderId
    );
    if (hasShippingAddress) {
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
    } // if
    //#endregion validate shipping address
    
    
    
    //#region validate billing address
    const {
        // billings:
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = placeOrderData;
    const hasBillingAddress = (
        !!billingFirstName ||
        !!billingLastName ||
        
        !!billingPhone ||
        
        !!billingAddress ||
        !!billingCity ||
        !!billingZone ||
        !!billingZip ||
        !!billingCountry
    );
    if (hasBillingAddress) {
        if (
               !billingFirstName || (typeof(billingFirstName) !== 'string')
            || !billingLastName  || (typeof(billingLastName) !== 'string')
            
            || !billingPhone     || (typeof(billingPhone) !== 'string')
            
            || !billingAddress   || (typeof(billingAddress) !== 'string')
            || !billingCity      || (typeof(billingCity) !== 'string')
            || !billingZone      || (typeof(billingZone) !== 'string')
            || !billingZip       || (typeof(billingZip) !== 'string')
            || !billingCountry   || (typeof(billingCountry) !== 'string') // todo validate country id
        ) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate billing address
    
    
    
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
    const validFormattedItems : RequiredNonNullable<Pick<DraftOrdersOnProducts, 'productId'|'variantIds'|'quantity'>>[] = [];
    for (const item of items) {
        // validations:
        if (!item || (typeof(item) !== 'object'))                               throw 'INVALID_JSON';
        const {
            productId,
            variantIds,
            quantity,
        } = item;
        if (typeof(productId) !== 'string')                                     throw 'INVALID_JSON';
        if (!productId.length)                                                  throw 'INVALID_JSON';
        if (!Array.isArray(variantIds))                                         throw 'INVALID_JSON';
        if (!variantIds.every((variantId) => (typeof(variantId) === 'string'))) throw 'INVALID_JSON';
        if (typeof(quantity)  !== 'number')                                     throw 'INVALID_JSON';
        if (!isFinite(quantity) || (quantity < 1))                              throw 'INVALID_JSON';
        if ((quantity % 1))                                                     throw 'INVALID_JSON';
        
        
        
        // collects:
        validFormattedItems.push({
            productId,
            variantIds,
            quantity,
        });
    } // for
    //#endregion validate cart items: check format
    
    
    
    //#region generate a unique orderId
    const nanoid = !simulateOrder ? customAlphabet('0123456789', 16) : null;
    const tempOrderId = (await nanoid?.()) ?? '';
    //#endregion generate a unique orderId
    
    
    
    let orderId                  : string|undefined;
    let authorizedOrPaidFundData : AuthorizedFundData|PaidFundData|undefined;
    let paymentDetail            : PaymentDetail|undefined;
    let newOrder                 : OrderAndData|undefined = undefined;
    try {
        ({orderId, authorizedOrPaidFundData, paymentDetail, newOrder} = await prisma.$transaction(async (prismaTransaction): Promise<{ orderId: string|undefined, authorizedOrPaidFundData: AuthorizedFundData|PaidFundData|undefined, paymentDetail: PaymentDetail|undefined, newOrder : OrderAndData|undefined }> => {
            //#region batch queries
            const [selectedShipping, validExistingProducts, foundOrderIdInDraftOrder, foundOrderIdInOrder] = await Promise.all([
                (!simulateOrder && hasShippingAddress) ? prismaTransaction.shippingProvider.findUnique({
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
                }) : null,
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
                        
                        variantGroups : {
                            select : {
                                hasDedicatedStocks : true,
                                variants           : {
                                    where    : {
                                        visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                    },
                                    select : {
                                        id             : true,
                                        
                                        name           : true,
                                        
                                        price          : true,
                                        shippingWeight : true,
                                    },
                                    orderBy : {
                                        sort : 'asc',
                                    },
                                },
                            },
                            orderBy : {
                                sort : 'asc',
                            },
                        },
                        
                        stocks : {
                            select : {
                                id         : true,
                                
                                variantIds : true,
                                value      : true,
                            },
                        },
                    },
                }),
                !simulateOrder ? prismaTransaction.draftOrder.count({
                    where : {
                        orderId : tempOrderId,
                    },
                    take  : 1,
                }) : null,
                !simulateOrder ? prismaTransaction.order.count({
                    where : {
                        orderId : tempOrderId,
                    },
                    take  : 1,
                }) : null,
            ]);
            //#endregion batch queries
            
            
            
            //#region re-generate a unique orderId
            const orderId = !simulateOrder ? await (async (): Promise<string> => {
                if (!foundOrderIdInDraftOrder && !foundOrderIdInOrder) {
                    return tempOrderId;
                }
                else {
                    for (let attempts = 10; attempts > 0; attempts--) {
                        const tempOrderId = await nanoid?.() ?? '';
                        const [foundOrderIdInDraftOrder, foundOrderIdInOrder] = await Promise.all([
                            prismaTransaction.draftOrder.count({
                                where : {
                                    orderId : tempOrderId,
                                },
                                take  : 1,
                            }),
                            prismaTransaction.order.count({
                                where : {
                                    orderId : tempOrderId,
                                },
                                take  : 1,
                            }),
                        ]);
                        if (!foundOrderIdInDraftOrder && !foundOrderIdInOrder) return tempOrderId;
                    } // for
                    console.log('INTERNAL ERROR AT GENERATE UNIQUE ID');
                    throw 'INTERNAL_ERROR';
                } // if
            })() : '';
            //#endregion re-generate a unique orderId
            
            
            
            //#region validate shipping
            if (!simulateOrder && hasShippingAddress && !selectedShipping) throw 'BAD_SHIPPING';
            
            const matchingShipping = (
                (!simulateOrder && hasShippingAddress && !!selectedShipping)
                ? getMatchingShipping(selectedShipping, { city: shippingCity, zone: shippingZone, country: shippingCountry })
                : null
            );
            if (!simulateOrder && hasShippingAddress && !matchingShipping) throw 'BAD_SHIPPING';
            //#endregion validate shipping
            
            
            
            //#region validate cart items: check existing products => check product quantities => create detailed items
            const detailedItems    : DetailedItem[] = [];
            /**
             * Contains non_nullable product stocks to be reduced from current stock
             */
            const reduceStockItems : (RequiredNonNullable<Pick<DraftOrdersOnProducts, 'productId'>> & { stockId: string, quantity: number })[] = [];
            let totalProductPriceConverted = 0, totalProductWeight : number|null = null;
            {
                const productListAdapter = createEntityAdapter<
                    & Pick<Product,
                        |'id'
                        |'name'
                        |'price'
                        |'shippingWeight'
                    >
                    & {
                        variantGroups : (
                            & Pick<VariantGroup, 'hasDedicatedStocks'>
                            & {
                                variants : Pick<Variant, 'id'|'name'|'price'|'shippingWeight'>[]
                            }
                        )[],
                        
                        stocks : Pick<Stock, 'id'|'variantIds'|'value'>[],
                    }
                >({
                    selectId : (productData) => productData.id,
                });
                const productList = productListAdapter.addMany(
                    productListAdapter.getInitialState(),
                    validExistingProducts
                ).entities;
                
                
                
                const limitedStockItems : LimitedStockItem[] = [];
                for (const { productId, variantIds, quantity } of validFormattedItems) {
                    const product = productList[productId];
                    // unknown productId => invalid product:
                    if (!product) {
                        limitedStockItems.push({
                            productId,
                            variantIds,
                            stock: 0,
                        });
                        continue;
                    } // if
                    
                    
                    
                    const validExistingVariantGroups = product.variantGroups;
                    if (variantIds.length !== validExistingVariantGroups.length) {
                        // invalid required variantIds => invalid product:
                        limitedStockItems.push({
                            productId,
                            variantIds,
                            stock: 0,
                        });
                        continue;
                    } // if
                    
                    
                    
                    // get selected variant by variantGroup:
                    const selectedVariants = (
                        validExistingVariantGroups
                        .map(({hasDedicatedStocks, variants: validVariants}) => {
                            const validVariant = validVariants.find(({id: validVariantId}) =>
                                variantIds.includes(validVariantId)
                            );
                            if (validVariant === undefined) return undefined;
                            return {
                                ...validVariant,
                                hasDedicatedStocks,
                            };
                        })
                    );
                    if (!selectedVariants.every((selectedVariant): selectedVariant is Exclude<typeof selectedVariant, undefined> => (selectedVariants !== undefined))) {
                        // one/some required variants are not selected => invalid product:
                        limitedStockItems.push({
                            productId,
                            variantIds,
                            stock: 0,
                        });
                        continue;
                    } // if
                    const selectedVariantIds          = selectedVariants.map(({id}) => id);
                    const selectedVariantWithStockIds = selectedVariants.filter(({hasDedicatedStocks}) => hasDedicatedStocks).map(({id}) => id);
                    
                    
                    
                    const currentStock = (
                        product.stocks
                        .find(({variantIds}) =>
                            (variantIds.length === selectedVariantWithStockIds.length)
                            &&
                            (variantIds.every((variantId) => selectedVariantWithStockIds.includes(variantId)))
                        )
                    );
                    if (currentStock === undefined) {
                        // if happened (which it shouldn't), we've a invalid database => invalid product:
                        limitedStockItems.push({
                            productId,
                            variantIds,
                            stock: 0,
                        });
                        continue;
                    } // if
                    
                    
                    
                    const stock = currentStock.value;
                    if (typeof(stock) === 'number') {
                        // insufficient requested product stock => invalid product stock:
                        if (quantity > stock) {
                            limitedStockItems.push({
                                productId,
                                variantIds,
                                stock,
                            });
                        } // if
                        
                        
                        
                        // product validation passed => will be used to reduce current product stock:
                        reduceStockItems.push({
                            productId,
                            stockId : currentStock.id,
                            quantity,
                        });
                    } // if
                    
                    
                    
                    const unitPriceParts          = (
                        [
                            // base price:
                            product.price,
                            
                            // additional prices, based on selected variants:
                            ...selectedVariants.map(({price}) => price),
                        ]
                        .filter((pricePart): pricePart is Exclude<typeof pricePart, null> => (pricePart !== null))
                    );
                    const unitPricePartsConverted = await Promise.all(
                        unitPriceParts
                        .map(async (unitPricePart): Promise<number> => {
                            const unitPricePartAsCustomerCurrency = (
                                await convertCustomerCurrencyIfRequired(unitPricePart, preferredCurrency)
                            );
                            
                            // const unitPricePartAsPaypalCurrency = (
                            //     !!usePaypalGateway
                            //     ? await convertPaypalCurrencyIfRequired(unitPricePartAsCustomerCurrency, preferredCurrency ?? commerceConfig.defaultCurrency)
                            //     : unitPricePartAsCustomerCurrency
                            // );
                            
                            return unitPricePartAsCustomerCurrency;
                        })
                    );
                    const unitPriceConverted      = (
                        unitPricePartsConverted
                        .reduce(sumReducer, 0) // may produces ugly_fractional_decimal
                    );
                    const unitWeight              = (
                        [
                            // base shippingWeight:
                            product.shippingWeight,
                            
                            // additional shippingWeight, based on selected variants:
                            ...selectedVariants.map(({shippingWeight}) => shippingWeight),
                        ]
                        .reduce<number|null>((accum, value): number|null => {
                            if (value === null) return accum;
                            if (accum === null) return value;
                            return (accum + value);
                        }, null)
                    );
                    
                    
                    
                    detailedItems.push({
                        productId      : productId,
                        variantIds     : selectedVariantIds,
                        productName    : product.name,
                        variantNames   : selectedVariants.map(({name}) => name),
                        
                        priceConverted : unitPriceConverted,
                        shippingWeight : unitWeight,
                        quantity       : quantity,
                    });
                    
                    
                    
                    totalProductPriceConverted  += unitPriceConverted * quantity;          // may produces ugly_fractional_decimal
                    totalProductPriceConverted   = trimNumber(totalProductPriceConverted); // decimalize accumulated numbers to avoid producing ugly_fractional_decimal
                    
                    
                    
                    if (unitWeight !== null) {
                        if (totalProductWeight === null) totalProductWeight = 0; // contains at least 1 PHYSICAL_GOODS
                        
                        totalProductWeight      += unitWeight         * quantity;          // may produces ugly_fractional_decimal
                        totalProductWeight       = trimNumber(totalProductWeight);         // decimalize accumulated numbers to avoid producing ugly_fractional_decimal
                    } // if
                } // for
                if (limitedStockItems.length) throw new OutOfStockError(limitedStockItems);
                if (simulateOrder) return {
                    orderId                  : '', // empty string => simulateOrder
                    authorizedOrPaidFundData : undefined,
                    paymentDetail            : undefined,
                    newOrder                 : undefined,
                };
            }
            if ((totalProductWeight != null) !== hasShippingAddress) throw 'BAD_SHIPPING'; // must have shipping address if contains at least 1 PHYSICAL_GOODS -or- must not_have shipping address if all DIGITAL_GOODS
            const totalShippingCost          = matchingShipping ? calculateShippingCost(totalProductWeight, matchingShipping) : null;
            const totalShippingCostConverted = await (async (): Promise<number|null> => {
                const totalShippingCostAsCustomerCurrency = (
                    await convertCustomerCurrencyIfRequired(totalShippingCost, preferredCurrency)
                );
                
                // const totalShippingCostAsPaypalCurrency = (
                //     !!usePaypalGateway
                //     ? await convertPaypalCurrencyIfRequired(totalShippingCostAsCustomerCurrency, preferredCurrency ?? commerceConfig.defaultCurrency)
                //     : totalShippingCostAsCustomerCurrency
                // );
                
                return totalShippingCostAsCustomerCurrency;
            })();
            const totalCostConverted         = trimNumber(                                 // decimalize summed numbers to avoid producing ugly_fractional_decimal
                totalProductPriceConverted + (totalShippingCostConverted ?? 0)             // may produces ugly_fractional_decimal
            );
            //#endregion validate cart items: check existing products => check product quantities => create detailed items
            
            
            
            //#region decrease product stock
            const decreaseStocksPromise = Promise.all(
                reduceStockItems
                .map(({stockId, quantity}) =>
                    prismaTransaction.stock.update({
                        where  : {
                            id : stockId,
                        },
                        data   : {
                            value : { decrement : quantity },
                        },
                        select : {
                            id : true,
                        },
                    })
                )
            );
            //#endregion decrease product stock
            
            
            
            //#region fetch payment gateway API
            let authorizedOrPaidFundData : AuthorizedFundData|PaidFundData|undefined = undefined;
            if (usePaypalGateway) {
                authorizedOrPaidFundData = await paypalCreateOrder({
                    preferredCurrency,
                    totalCostConverted,
                    totalProductPriceConverted,
                    totalShippingCostConverted,
                    
                    hasShippingAddress,
                    shippingFirstName,
                    shippingLastName,
                    shippingPhone,
                    shippingAddress,
                    shippingCity,
                    shippingZone,
                    shippingZip,
                    shippingCountry,
                    
                    detailedItems,
                });
            }
            else if (cardToken) {
                const authorizedOrPaidFundDataOrDeclined = await midtransCreateOrderWithCard(cardToken, orderId, {
                    preferredCurrency,
                    totalCostConverted,
                    totalProductPriceConverted,
                    totalShippingCostConverted,
                    
                    hasShippingAddress,
                    shippingFirstName,
                    shippingLastName,
                    shippingPhone,
                    shippingAddress,
                    shippingCity,
                    shippingZone,
                    shippingZip,
                    shippingCountry,
                    
                    hasBillingAddress,
                    billingFirstName,
                    billingLastName,
                    billingPhone,
                    billingAddress,
                    billingCity,
                    billingZone,
                    billingZip,
                    billingCountry,
                    
                    detailedItems,
                });
                
                if (authorizedOrPaidFundDataOrDeclined === null) {
                    // payment DECLINED:
                    
                    return {
                        orderId                  : undefined, // undefined => declined
                        authorizedOrPaidFundData : undefined,
                        paymentDetail            : undefined,
                        newOrder                 : undefined,
                    };
                }
                else {
                    authorizedOrPaidFundData = authorizedOrPaidFundDataOrDeclined;
                } // if
            }
            else if (acquirer) {
                const authorizedOrPaidFundDataOrDeclined = await midtransCreateOrderWithQris(acquirer as any, orderId, {
                    preferredCurrency,
                    totalCostConverted,
                    totalProductPriceConverted,
                    totalShippingCostConverted,
                    
                    hasShippingAddress,
                    shippingFirstName,
                    shippingLastName,
                    shippingPhone,
                    shippingAddress,
                    shippingCity,
                    shippingZone,
                    shippingZip,
                    shippingCountry,
                    
                    hasBillingAddress,
                    billingFirstName,
                    billingLastName,
                    billingPhone,
                    billingAddress,
                    billingCity,
                    billingZone,
                    billingZip,
                    billingCountry,
                    
                    detailedItems,
                });
                
                if (authorizedOrPaidFundDataOrDeclined === null) {
                    // payment DECLINED:
                    
                    return {
                        orderId                  : undefined, // undefined => declined
                        authorizedOrPaidFundData : undefined,
                        paymentDetail            : undefined,
                        newOrder                 : undefined,
                    };
                }
                else {
                    authorizedOrPaidFundData = authorizedOrPaidFundDataOrDeclined;
                } // if
            }
            else if (paymentSource === 'manual') {
                authorizedOrPaidFundData = {
                    paymentSource : {
                        manual : {},
                    },
                    paymentAmount : 0,
                    paymentFee    : 0,
                } satisfies PaidFundData;
            } // if
            //#endregion fetch payment gateway API
            
            
            
            //#region create a new(Draft|Real)Order
            let savingCurrency   = preferredCurrency || commerceConfig.defaultCurrency;
            const orderItemsData = detailedItems.map((detailedItem) => {
                return {
                    productId      : detailedItem.productId,
                    variantIds     : detailedItem.variantIds,
                    
                    price          : detailedItem.priceConverted,
                    shippingWeight : detailedItem.shippingWeight,
                    quantity       : detailedItem.quantity,
                };
            });
            const preferredCurrencyData = (
                (savingCurrency === commerceConfig.defaultCurrency)
                ? null
                : {
                    currency       : savingCurrency,
                    rate           : await getCurrencyRate(savingCurrency),
                }
            );
            const shippingAddressData = (
                !hasShippingAddress
                ? null
                : {
                    firstName      : shippingFirstName,
                    lastName       : shippingLastName,
                    
                    phone          : shippingPhone,
                    
                    address        : shippingAddress,
                    city           : shippingCity,
                    zone           : shippingZone,
                    zip            : shippingZip,
                    country        : shippingCountry.toUpperCase(),
                }
            );
            const shippingCostData = (
                !hasShippingAddress
                ? null
                : totalShippingCostConverted
            );
            
            const customerOrGuest : CommitCustomerOrGuest = {
                name                 : customerName,
                email                : customerEmail,
                preference           : {
                    marketingOpt     : marketingOpt,
                },
            };
            const paymentDetail : PaymentDetail|null = (
                isPaidFundData(authorizedOrPaidFundData)  // is PaidFundData
                ? ((): PaymentDetail => {
                    const card = authorizedOrPaidFundData.paymentSource?.card;
                    if (card) {
                        return {
                            type       : 'CARD',
                            brand      : card.brand?.toLowerCase() ?? null,
                            identifier : card.last_digits ? `ending with ${card.last_digits}` : null,
                            
                            amount     : authorizedOrPaidFundData.paymentAmount,
                            fee        : authorizedOrPaidFundData.paymentFee,
                        };
                    } // if
                    
                    const manual = authorizedOrPaidFundData.paymentSource?.manual;
                    if (manual) {
                        return {
                            type       : 'MANUAL',
                            brand      : null,
                            identifier : null,
                            
                            amount     : 0,
                            fee        : 0,
                        };
                    } // if
                    
                    return {
                        type       : 'CUSTOM',
                        brand      : null,
                        identifier : null,
                        
                        amount     : authorizedOrPaidFundData.paymentAmount,
                        fee        : authorizedOrPaidFundData.paymentFee,
                    };
                })()
                : null
            );
            const billingAddressData = (
                !hasBillingAddress
                ? null
                : {
                    firstName      : billingFirstName,
                    lastName       : billingLastName,
                    
                    phone          : billingPhone,
                    
                    address        : billingAddress,
                    city           : billingCity,
                    zone           : billingZone,
                    zip            : billingZip,
                    country        : billingCountry.toUpperCase(),
                }
            );
            
            
            
            const createNewDraftOrderPromise = (
                isAuthorizedFundData(authorizedOrPaidFundData) // is AuthorizedFundData
                // pending_paid => create new (draft)Order:
                ? createDraftOrder(prismaTransaction, {
                    // temporary data:
                    expiresAt                : new Date(Date.now() + (1 * 60 * 1000)),
                    paymentId                : authorizedOrPaidFundData.paymentId,
                    
                    // primary data:
                    orderId                  : orderId,
                    items                    : orderItemsData,
                    preferredCurrency        : preferredCurrencyData,
                    shippingAddress          : shippingAddressData,
                    shippingCost             : shippingCostData,
                    shippingProviderId       : !hasShippingAddress ? null : (shippingProviderId ?? null) as string|null,
                })
                : null
            );
            const createNewOrderPromise = (
                isPaidFundData(authorizedOrPaidFundData)  // is PaidFundData
                // paid_immediately => crate new (real)Order:
                ? createOrder(prismaTransaction, {
                    // primary data:
                    orderId                  : orderId,
                    items                    : orderItemsData,
                    preferredCurrency        : preferredCurrencyData,
                    shippingAddress          : shippingAddressData,
                    shippingCost             : shippingCostData,
                    shippingProviderId       : !hasShippingAddress ? null : (shippingProviderId ?? null) as string|null,
                    
                    // extended data:
                    customerOrGuest          : customerOrGuest,
                    payment                  : {
                        ...paymentDetail!,
                        billingAddress       : billingAddressData,
                    } satisfies Payment,
                    paymentConfirmationToken : null, // no need for `paymentConfirmation`, because the order is paid_immediately
                })
                : null
            );
            //#endregion create a new(Draft|Real)Order
            
            
            
            await Promise.all([
                decreaseStocksPromise,
                createNewDraftOrderPromise,
                createNewOrderPromise,
            ]);
            
            
            
            // report the createOrder result:
            return {
                orderId,
                authorizedOrPaidFundData,
                paymentDetail : paymentDetail ?? undefined,
                newOrder : (await createNewOrderPromise) ?? undefined,
            };
        }));
        
        
        
        // send email confirmation:
        if (paymentDetail && newOrder) {
            // TODO: duplicate on `PATCH`:
            const customerOrGuest : CommitCustomerOrGuest = {
                name                 : customerName,
                email                : customerEmail,
                preference           : {
                    marketingOpt     : marketingOpt,
                },
            };
            
            
            
            //#region related data
            const allCountries = await prisma.country.findMany({
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
            
            
            
            const isPaid = (paymentSource !== 'manual');
            const paymentConfirmationToken = (
                isPaid
                ? undefined
                : await (async (): Promise<string> => {
                    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                    let tempToken = await nanoid();
                    
                    for (let attempts = 10; attempts > 0; attempts--) {
                        const foundDuplicate = await prisma.paymentConfirmation.count({
                            where : {
                                token : tempToken,
                            },
                            take : 1,
                        });
                        if (!foundDuplicate) return tempToken;
                    } // for
                    console.log('INTERNAL ERROR AT GENERATE UNIQUE TOKEN');
                    throw 'INTERNAL_ERROR';
                })()
            );
            
            
            
            await sendEmailConfirmation({
                customerEmail,
                
                customerOrGuest,
                newOrder,
                
                countryList,
                
                isPaid,
                paymentConfirmationToken,
            });
        } // if
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
            * Unable to generate `paypalGenerateAccessToken()` (invalid `NEXT_PUBLIC_PAYPAL_ID` and/or invalid `PAYPAL_SECRET`).
            * Configured currency is not supported by PayPal.
            * Invalid API_request body JSON (programming bug).
            * unexpected API response (programming bug).
        */
        
        if (error instanceof OutOfStockError) {
            return NextResponse.json({
                error             : 'OUT_OF_STOCK',
                limitedStockItems : error.limitedStockItems,
            }, { status: 409 }); // handled with error conflict
        } // if
        
        switch (error) {
            case 'BAD_SHIPPING'               :
            case 'INVALID_JSON'               :
            // case 'INVALID_PRODUCT_ID'         :
            // case 'INSUFFICIENT_PRODUCT_STOCK' :
            {
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
    if (orderId === '') { // empty string => simulateOrder
        // simulateOrder:
        const draftOrderDetail : DraftOrderDetail = {
            orderId      : '',
            redirectData : undefined,
        };
        return NextResponse.json(draftOrderDetail); // handled with success
    } // if
    
    if (orderId === undefined) { // undefined => declined
        // payment rejected:
        const paymentDeclined : PaymentDeclined = {
            error  : 'payment declined',
        };
        return NextResponse.json(paymentDeclined, {
            status : 402 // payment DECLINED
        });
    } // if
    
    if (paymentDetail) {  // is PaidFundData
        // payment approved:
        return NextResponse.json(paymentDetail, {
            status : 200 // payment APPROVED
        });
    } // if
    
    const draftOrderDetail : DraftOrderDetail = {
        orderId      : (
            !isAuthorizedFundData(authorizedOrPaidFundData)
            ? orderId
            : (() => {
                let prefix = '';
                
                if      (usePaypalGateway  ) prefix = '#PAYPAL_';
                else if (useMidtransGateway) prefix = '#MIDTRANS_';
                
                return `${prefix}${authorizedOrPaidFundData.paymentId}`;
            })()
        ),
        redirectData : isAuthorizedFundData(authorizedOrPaidFundData) ? authorizedOrPaidFundData.redirectData : undefined,
    };
    return NextResponse.json(draftOrderDetail); // handled with success
})

/**
 * purchase the previously posted order
 */
.patch(async (req) => {
    // await new Promise<void>((resolved) => {
    //     setTimeout(() => {
    //         resolved();
    //     }, 2000);
    // });
    
    
    
    const paymentData = await req.json();
    console.log('paymentData: ', paymentData);
    if (typeof(paymentData) !== 'object') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const paymentConfirmation = paymentData.paymentConfirmation;
    if (paymentConfirmation !== undefined) {
        if ((typeof(paymentConfirmation) !== 'object')) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        const paymentConfirmationToken = paymentConfirmation.token;
        if (!paymentConfirmationToken || (typeof(paymentConfirmationToken) !== 'string')) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        const {
            amount,
            payerName,
            paymentDate,
            preferredTimezone,
            
            originatingBank,
            destinationBank,
        } = paymentConfirmation;
        if ((amount !== undefined) && ((typeof(amount) !== 'number') || (amount < 0) || !isFinite(amount))) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        if (((payerName !== undefined) && (payerName !== null)) && ((typeof(payerName) !== 'string') || (payerName.length < 2) || (payerName.length > 50))) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        let paymentDateAsDate : Date|undefined = undefined;
        if ((paymentDate !== undefined) && (paymentDate !== null) && ((typeof(paymentDate) !== 'string') || !paymentDate.length || !(paymentDateAsDate = ((): Date|undefined => {
            try {
                return new Date(paymentDate);
            }
            catch {
                return undefined;
            } // try
        })()))) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        if ((preferredTimezone !== undefined) && (preferredTimezone !== null) && (typeof(preferredTimezone) !== 'number') && !isFinite(preferredTimezone) && !possibleTimezoneValues.includes(preferredTimezone)) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        if (((originatingBank !== undefined) && (originatingBank !== null)) && ((typeof(originatingBank) !== 'string') || (originatingBank.length < 2) || (originatingBank.length > 50))) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        if (((destinationBank !== undefined) && (destinationBank !== null)) && ((typeof(destinationBank) !== 'string') || (destinationBank.length < 2) || (destinationBank.length > 50))) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        const select = {
            reportedAt        : true,
            reviewedAt        : true,
            
            amount            : true,
            payerName         : true,
            paymentDate       : true,
            preferredTimezone : true,
            
            originatingBank   : true,
            destinationBank   : true,
            
            rejectionReason   : true,
            
            // relations:
            order : {
                select : {
                    preferredCurrency : true
                },
            },
        };
        const paymentConfirmationDetailRaw = (
            (amount === undefined)
            ? await prisma.paymentConfirmation.findUnique({
                where  : {
                    token : paymentConfirmationToken,
                },
                select : select,
            })
            : await (async() => {
                try {
                    return await prisma.paymentConfirmation.update({
                        where  : {
                            token : paymentConfirmationToken,
                            
                            OR : [
                                { reviewedAt      : { equals : null  } }, // never approved or rejected
                                { reviewedAt      : { isSet  : false } }, // never approved or rejected
                                
                                /* -or- */
                                
                                { rejectionReason : { not    : null  } }, // has reviewed as rejected (prevents to confirm the *already_approved_payment_confirmation*)
                            ],
                        },
                        data   : {
                            reportedAt : new Date(), // set the confirmation date
                            reviewedAt : null, // reset for next review
                            
                            amount,
                            payerName,
                            paymentDate      : paymentDateAsDate ?? new Date(paymentDate),
                            preferredTimezone,
                            
                            originatingBank,
                            destinationBank,
                            
                            rejectionReason : null, // reset for next review
                        },
                        select : select,
                    });
                }
                catch (error: any) {
                    console.log('ERROR: ', error, {amount, paymentConfirmationToken});
                    if (error?.code === 'P2025') return 'ALREADY_APPROVED';
                    throw error;
                } // try
            })()
        );
        if (paymentConfirmationDetailRaw === 'ALREADY_APPROVED') {
            return NextResponse.json({
                error:
`The previous payment confirmation has been approved.

Updating the confirmation is not required.`,
            }, { status: 409 }); // handled with conflict error
        }
        if (!paymentConfirmationDetailRaw) {
            return NextResponse.json({
                error: 'Invalid payment confirmation token.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        const {
            // relations:
            order,
            
            
            
            // data:
            ...restPaymentConfirmationDetail
        } = paymentConfirmationDetailRaw;
        return NextResponse.json({
            ...restPaymentConfirmationDetail,
            currency : order.preferredCurrency?.currency ?? commerceConfig.defaultCurrency,
        } satisfies PaymentConfirmationDetail); // handled with success
    } // if
    
    
    
    const shippingTracking = paymentData.shippingTracking;
    if (shippingTracking !== undefined) {
        if ((typeof(shippingTracking) !== 'object')) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        const shippingTrackingToken = shippingTracking.token;
        if (!shippingTrackingToken || (typeof(shippingTrackingToken) !== 'string')) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        const {
            preferredTimezone,
        } = shippingTracking;
        if ((preferredTimezone !== undefined) && (preferredTimezone !== null) && (typeof(preferredTimezone) !== 'number') && !isFinite(preferredTimezone) && !possibleTimezoneValues.includes(preferredTimezone)) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        const select = {
            shippingCarrier    : true,
            shippingNumber     : true,
            preferredTimezone  : true,
            shippingTrackingLogs : {
                select : {
                    reportedAt : true,
                    log        : true,
                },
            },
        };
        const shippingTrackingDetail : ShippingTrackingDetail|null = (
            (preferredTimezone === undefined)
            ? await prisma.shippingTracking.findUnique({
                where  : {
                    token : shippingTrackingToken,
                },
                select : select,
            })
            : await prisma.shippingTracking.update({
                where  : {
                    token : shippingTrackingToken,
                },
                data   : {
                    preferredTimezone,
                },
                select : select,
            })
        );
        if (!shippingTrackingDetail) {
            return NextResponse.json({
                error: 'Invalid shipping tracking token.',
            }, { status: 400 }); // handled with error
        } // if
        
        // sort the log by reported date:
        shippingTrackingDetail.shippingTrackingLogs.sort(({reportedAt: a}, {reportedAt: b}) => {
            if ((a === null) || (b === null)) return 0;
            return a.valueOf() - b.valueOf();
        });
        
        return NextResponse.json(shippingTrackingDetail); // handled with success
    } // if
    
    
    
    const rawOrderId = paymentData.orderId;
    if (typeof(rawOrderId) !== 'string') {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let orderId           : string|null = null;
    let paymentId         : string|null = null;
    let paypalPaymentId   : string|null = null;
    let midtransPaymentId : string|null = null;
    if (rawOrderId.startsWith('#PAYPAL_')) {
        paymentId = rawOrderId.slice(8); // remove prefix #PAYPAL_
        if (!paymentId.length) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        paypalPaymentId = paymentId;
    }
    else if (rawOrderId.startsWith('#MIDTRANS_')) {
        paymentId = rawOrderId.slice(10); // remove prefix #MIDTRANS_
        if (!paymentId.length) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        midtransPaymentId = paymentId;
    }
    else {
        orderId = rawOrderId;
    } // if
    
    
    
    //#region validate options
    const {
        cancelOrder,
    } = paymentData;
    if ((cancelOrder !== undefined) && (cancelOrder !== true)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate options
    
    
    
    //#region cancel the payment
    if (cancelOrder) {
        const orderDeletedFromDatabase = await prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
            // draftOrder DELETED => restore the `Product` stock and delete the `draftOrder`:
            return await cancelDraftOrder(prismaTransaction, { orderId, paymentId });
        });
        
        
        
        if (orderDeletedFromDatabase) {
            try {
                if (paypalPaymentId) {
                    // no need an order cancelation for paypal
                }
                else if (midtransPaymentId) {
                    await midtransCancelOrder(midtransPaymentId);
                } // if
            }
            catch {
                // ignore any error
            } // try
        } // if
        
        
        
        return NextResponse.json({
            canceled: true,
        });
    };
    //#endregion cancel the payment
    
    
    
    //#region validate customer data & extra
    const {
        // marketings:
        marketingOpt,
        
        
        
        // customers:
        customerName,
        customerEmail,
    } = paymentData;
    if (
        ((marketingOpt !== undefined) && (typeof(marketingOpt) !== 'boolean'))
        
        || !customerName || (typeof(customerName) !== 'string')
        || !customerEmail    || (typeof(customerEmail) !== 'string') // TODO: validate email
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate customer data & extra
    
    
    
    //#region validate billing address
    const {
        // billings:
        billingFirstName,
        billingLastName,
        
        billingPhone,
        
        billingAddress,
        billingCity,
        billingZone,
        billingZip,
        billingCountry,
    } = paymentData;
    const hasBillingAddress = (
        !!billingFirstName ||
        !!billingLastName ||
        
        !!billingPhone ||
        
        !!billingAddress ||
        !!billingCity ||
        !!billingZone ||
        !!billingZip ||
        !!billingCountry
    );
    if (hasBillingAddress) {
        if (
               !billingFirstName || (typeof(billingFirstName) !== 'string')
            || !billingLastName  || (typeof(billingLastName) !== 'string')
            
            || !billingPhone     || (typeof(billingPhone) !== 'string')
            
            || !billingAddress   || (typeof(billingAddress) !== 'string')
            || !billingCity      || (typeof(billingCity) !== 'string')
            || !billingZone      || (typeof(billingZone) !== 'string')
            || !billingZip       || (typeof(billingZip) !== 'string')
            || !billingCountry   || (typeof(billingCountry) !== 'string') // todo validate country id
        ) {
            return NextResponse.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate billing address
    
    
    
    let paymentResponse          : PaymentDetail|PaymentDeclined;
    let paymentConfirmationToken : string|undefined = undefined;
    let newOrder                 : OrderAndData|undefined = undefined;
    let countryList              : EntityState<CountryPreview>;
    try {
        // TODO: duplicate on `POST`:
        const customerOrGuest : CommitCustomerOrGuest = {
            name                 : customerName,
            email                : customerEmail,
            preference           : {
                marketingOpt     : marketingOpt,
            },
        };
        
        ([paymentResponse, paymentConfirmationToken, newOrder, countryList] = await prisma.$transaction(async (prismaTransaction): Promise<readonly [PaymentDetail|PaymentDeclined, string|undefined, OrderAndData|undefined, EntityState<CountryPreview>]> => {
            //#region verify draftOrder_id
            const requiredSelect = {
                id                     : true,
                expiresAt              : true,
                
                orderId                : true,
                
                preferredCurrency      : true,
                
                shippingAddress        : true,
                shippingCost           : true,
                shippingProviderId     : true,
                
                items : {
                    select : {
                        productId      : true,
                        variantIds     : true,
                        
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
                        orderId : orderId,
                    },
                    select  : requiredSelect,
                })
                : !!paymentId
                ? await prismaTransaction.draftOrder.findUnique({
                    where : {
                        paymentId : paymentId,
                    },
                    select : requiredSelect,
                })
                : null
            );
            if (!draftOrder) throw 'DRAFT_ORDER_NOT_FOUND';
            
            
            
            if (draftOrder.expiresAt <= new Date()) {
                // draftOrder EXPIRED => restore the `Product` stock and delete the `draftOrder`:
                await revertOrder(prismaTransaction, { draftOrder });
                
                
                
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
            let paymentResponse : PaymentDetail|PaymentDeclined;
            let paymentConfirmationToken : string|undefined = undefined;
            if (paypalPaymentId) {
                const paidFundData = await paypalCaptureFund(paypalPaymentId);
                if (paidFundData === null) {
                    // payment DECLINED:
                    
                    paymentResponse = {
                        error     : 'payment declined',
                    };
                }
                else {
                    // payment APPROVED:
                    
                    const {
                        paymentSource,
                        paymentAmount,
                        paymentFee,
                    } = paidFundData;
                    
                    paymentResponse = ((): Omit<Payment, 'billingAddress'> => {
                        const card = paymentSource?.card;
                        if (card) {
                            return {
                                type       : 'CARD',
                                brand      : card.brand?.toLowerCase() ?? null,
                                identifier : card.last_digits ? `ending with ${card.last_digits}` : null,
                                
                                amount     : paymentAmount,
                                fee        : paymentFee,
                            };
                        } //if
                        
                        const paypal = paymentSource?.paypal;
                        if (paypal) {
                            return {
                                type       : 'PAYPAL',
                                brand      : 'paypal',
                                identifier : paypal.email_address || null,
                                
                                amount     : paymentAmount,
                                fee        : paymentFee,
                            };
                        } //if
                        
                        return {
                            type       : 'CUSTOM',
                            brand      : null,
                            identifier : null,
                            
                            amount     : paymentAmount,
                            fee        : paymentFee,
                        };
                    })();
                } // if
            }
            else if (midtransPaymentId) {
                const paidFundData = await midtransCaptureFund(midtransPaymentId);
                if (!paidFundData) {
                    // payment DECLINED:
                    
                    paymentResponse = {
                        error     : 'payment declined',
                    };
                }
                else {
                    // payment APPROVED:
                    
                    const {
                        paymentSource,
                        paymentAmount,
                        paymentFee,
                    } = paidFundData;
                    
                    paymentResponse = ((): Omit<Payment, 'billingAddress'> => {
                        const card = paymentSource?.card;
                        if (card) {
                            return {
                                type       : 'CARD',
                                brand      : card.brand?.toLowerCase() ?? null,
                                identifier : card.last_digits ? `ending with ${card.last_digits}` : null,
                                
                                amount     : paymentAmount,
                                fee        : paymentFee,
                            };
                        } //if
                        
                        return {
                            type       : 'CUSTOM',
                            brand      : null,
                            identifier : null,
                            
                            amount     : paymentAmount,
                            fee        : paymentFee,
                        };
                    })();
                } // if
            }
            else {
                // paylater APPROVED (we waiting for your payment confirmation within xx days):
                paymentResponse = {
                    type       : 'MANUAL',
                    brand      : null,
                    identifier : null,
                    
                    amount     : 0,
                    fee        : 0,
                };
                
                
                
                paymentConfirmationToken = await (async (): Promise<string> => {
                    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                    let tempToken = await nanoid();
                    
                    for (let attempts = 10; attempts > 0; attempts--) {
                        const foundDuplicate = await prismaTransaction.paymentConfirmation.count({
                            where : {
                                token : tempToken,
                            },
                            take : 1,
                        });
                        if (!foundDuplicate) return tempToken;
                    } // for
                    console.log('INTERNAL ERROR AT GENERATE UNIQUE TOKEN');
                    throw 'INTERNAL_ERROR';
                })();
            } // if
            //#endregion process the payment
            
            
            
            //#region save the database
            let newOrder : OrderAndData|undefined = undefined;
            const paymentDetail = !('error' in paymentResponse) ? paymentResponse : undefined;
            if (paymentDetail) {
                // const isBillingAddressRequired = (paymentDetail.type === 'CARD');
                
                // payment APPROVED => move the `draftOrder` to `order`:
                newOrder = await commitOrder(prismaTransaction, {
                    draftOrder         : draftOrder,
                    customerOrGuest    : customerOrGuest,
                    payment            : {
                        ...paymentDetail,
                        billingAddress : hasBillingAddress ? {
                            firstName  : billingFirstName,
                            lastName   : billingLastName,
                            
                            phone      : billingPhone,
                            
                            address    : billingAddress,
                            city       : billingCity,
                            zone       : billingZone,
                            zip        : billingZip,
                            country    : billingCountry,
                        } : null,
                    },
                    paymentConfirmationToken,
                });
            }
            else {
                // payment DECLINED => restore the `Product` stock and delete the `draftOrder`:
                await revertOrder(prismaTransaction, { draftOrder });
            } // if
            //#endregion save the database
            
            
            
            // report the payment result:
            return [paymentResponse, paymentConfirmationToken, newOrder, countryList];
        }));
        
        
        
        // send email confirmation:
        if (newOrder) {
            await sendEmailConfirmation({
                customerEmail,
                
                customerOrGuest,
                newOrder,
                
                countryList,
                
                isPaid : !('error' in paymentResponse) && (paymentResponse.type !== 'MANUAL'),
                paymentConfirmationToken,
            });
        } // if
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
            * Unable to generate `paypalGenerateAccessToken()` (invalid `NEXT_PUBLIC_PAYPAL_ID` and/or invalid `PAYPAL_SECRET`).
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
