// redux:
import {
    createEntityAdapter,
}                           from '@reduxjs/toolkit'

// next-js:
import {
    type NextRequest,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    z,
}                           from 'zod'
import {
    // types:
    type Product,
    type ProductPreview,
    type Variant,
    type VariantGroup,
    type Stock,
    
    type CreateOrderDataBasic,
    type OrderCurrencyDetail,
    type DraftOrderItem,
    
    type ShippingAddressDetail,
    type BillingAddressDetail,
    
    type DetailedItem,
    
    type AuthorizedFundData,
    type PaymentDetail,
    
    type FinishedOrderState,
    
    type CustomerConnectData,
    type GuestCreateData,
    type CustomerOrGuestPreferenceDetail,
    type GuestDetail,
    
    type PlaceOrderDetail,
    type PaymentDeclined,
    type LimitedStockItem,
    
    type PaymentMethodProvider,
    type PaymentMethodCapture,
    
    
    
    // schemas:
    GuestDetailSchema,
    
    
    
    // utilities:
    commitDraftOrderSelect,
    revertDraftOrderSelect,
    
    isAuthorizedFundData,
    isPaymentDetailWithCapture,
    
    defaultShippingOriginSelect,
    
    OutOfStockError,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// templates:
import {
    // types:
    type OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// internals:
import {
    // utilities:
    createDraftOrder,
    findDraftOrderById,
    
    createOrder,
    commitDraftOrder,
    revertDraftOrder,
}                           from '@/libs/order-utilities'
import {
    sendConfirmationEmail,
}                           from '@/libs/email-utilities'
import {
    // utilities:
    paypalCreateOrder,
    paypalCaptureFund,
}                           from '@/libs/payments/processors/paypal'
import {
    stripeCreateOrder,
    
    stripeCaptureFund,
    stripeCancelOrder,
}                           from '@/libs/payments/processors/stripe'
import {
    midtransCreateOrderWithCard,
    midtransCreateOrderWithQris,
    midtransCreateOrderWithGopay,
    midtransCreateOrderWithShopeepay,
    midtransCreateOrderWithIndomaret,
    midtransCreateOrderWithAlfamart,
    
    midtransCaptureFund,
    midtransCancelOrder,
}                           from '@/libs/payments/processors/midtrans'
import {
    getMatchingShippings,
}                           from '@/libs/shippings/processors/easypost'

// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'
import {
    getCurrencyRate,
    
    convertCustomerCurrencyIfRequired,
}                           from '@/libs/currencyExchanges'
import {
    sumReducer,
}                           from '@/libs/numbers'
import {
    type MatchingShipping,
    testMatchingShipping,
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for many & complex transactions

const paypalPaymentEnabled   = checkoutConfigServer.payment.processors.paypal.enabled;
const stripePaymentEnabled   = checkoutConfigServer.payment.processors.stripe.enabled;
const midtransPaymentEnabled = checkoutConfigServer.payment.processors.midtrans.enabled;



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
    handler as PUT,
    handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router


.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (session) (req as any).session = session;
    
    
    
    // not_authenticated|authenticated => next:
    return await next();
})

/**
 * place the order and calculate the total price (not relying priceList on the client_side)
 */
.post(async (req) => {
    const placeOrderData = await req.json();
    if (typeof(placeOrderData) !== 'object') {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    //#region validate options
    const {
        currency : currencyRaw = checkoutConfigServer.payment.defaultCurrency,
        paymentSource, // options: pay manually | paymentSource
        simulateOrder = false,
    } = placeOrderData;
    if ((typeof(currencyRaw) !== 'string') || !checkoutConfigServer.payment.currencyOptions.includes(currencyRaw)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const currency : string = currencyRaw;
    
    if ((paymentSource !== undefined) && ((typeof(paymentSource) !== 'string') || !paymentSource)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((simulateOrder !== undefined) && (typeof(simulateOrder) !== 'boolean')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const usePaypalGateway   = !simulateOrder && (['paypalCard'].includes(paymentSource) || !['manual', 'savedCard', 'stripeCard', 'stripeExpress', 'midtransCard', 'midtransQris', 'gopay', 'shopeepay', 'indomaret', 'alfamart'].includes(paymentSource)); // if undefined || not 'manual' => use paypal gateway
    const useStripeGateway   = !simulateOrder && ['stripeCard', 'stripeExpress'].includes(paymentSource);
    const useMidtransGateway = !simulateOrder && ['midtransCard', 'midtransQris', 'gopay', 'shopeepay', 'indomaret', 'alfamart'].includes(paymentSource);
    const useSavedCard       = !simulateOrder && (paymentSource === 'savedCard');
    
    if      (usePaypalGateway   && (!paypalPaymentEnabled   || !checkoutConfigServer.payment.processors.paypal.supportedCurrencies.includes(currency))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    else if (useStripeGateway   && (!stripePaymentEnabled   || !checkoutConfigServer.payment.processors.stripe.supportedCurrencies.includes(currency))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    else if (useMidtransGateway && (!midtransPaymentEnabled || !checkoutConfigServer.payment.processors.midtrans.supportedCurrencies.includes(currency))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    }
    else if (!usePaypalGateway && !useStripeGateway && !useMidtransGateway && !useSavedCard && !simulateOrder && (paymentSource !== 'manual')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let cardToken : string|null = null;
    if (useStripeGateway) {
        const {
            cardToken: cardTokenRaw,
        } = placeOrderData;
        
        if ((paymentSource === 'stripeCard') || (paymentSource === 'stripeExpress')) {
            if ((typeof(cardTokenRaw) !== 'string') || !cardTokenRaw) {
                return Response.json({
                    error: 'Invalid data.',
                }, { status: 400 }); // handled with error
            } // if
            cardToken = cardTokenRaw;
        } // if
    }
    else if (useMidtransGateway) {
        const {
            cardToken: cardTokenRaw,
        } = placeOrderData;
        
        if (paymentSource === 'midtransCard') {
            if ((typeof(cardTokenRaw) !== 'string') || !cardTokenRaw) {
                return Response.json({
                    error: 'Invalid data.',
                }, { status: 400 }); // handled with error
            } // if
            cardToken = cardTokenRaw;
        } // if
    }
    else if (useSavedCard) {
        const {
            cardToken: cardTokenRaw,
        } = placeOrderData;
        
        if ((typeof(cardTokenRaw) !== 'string') || !cardTokenRaw) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        
        cardToken = cardTokenRaw;
    }
    
    
    
    let saveCard : boolean = false;
    if (['card', 'paypalCard', 'stripeCard', 'midtransCard'].includes(paymentSource)) {
        const {
            saveCard: saveCardRaw = false,
        } = placeOrderData;
        if (typeof(saveCardRaw) !== 'boolean') {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        saveCard = saveCardRaw;
    } // if
    //#endregion validate options
    
    
    
    //#region validate customer data & extra
    const customerAndExtraData = await (async () => {
        try {
            return {
                marketingOpt : simulateOrder ? true      : z.boolean().parse(placeOrderData?.marketingOpt),
                guest        : simulateOrder ? undefined : GuestDetailSchema.optional().parse(placeOrderData?.customer),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (customerAndExtraData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        marketingOpt,
        guest,
    } = customerAndExtraData;
    //#endregion validate customer data & extra
    
    
    
    //#region authenticating
    const session = (req as any).session as Session|undefined;
    const customerId = session?.user?.id;
    if (customerId) {
        if (guest !== undefined) { // BOTH customers and guests exist => ambiguous => invalid
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    }
    else {
        if (guest === undefined) { // both customers and guests NOT exist => MAYBE invalid
            if (!simulateOrder) {  // invalid EXCEPT when ON simulateOrder
                return Response.json({
                    error: 'Invalid data.',
                }, { status: 400 }); // handled with error
            } // if
        } // if
    } // if
    //#endregion authenticating
    
    
    
    //#region find existing paymentMethodProviderCustomerId
    const paymentMethodProviderCustomerIds = (saveCard && customerId) ? await prisma.customer.findUnique({
        where  : {
            id : customerId, // important: the signedIn customerId
        },
        select : {
            paypalCustomerId   : true,
            stripeCustomerId   : true,
            midtransCustomerId : true,
        },
    }) : undefined;
    //#endregion find existing paymentMethodProviderCustomerId
    
    
    
    //#region validate captcha for manual payment
    if (['manual', 'indomaret', 'alfamart'].includes(paymentSource)) {
        const captcha = placeOrderData.captcha;
        if (!captcha || (typeof(captcha) !== 'string') || !captcha) {
            return Response.json({
                error: 'Invalid captcha.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        // validate captcha:
        try {
            const response = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${captcha}`
            );
            if (!response.ok) {
                return Response.json({
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
                return Response.json({
                    error: 'Invalid captcha.',
                }, { status: 400 }); // handled with error
            } // if
        }
        catch {
            return Response.json({
                error: 'Invalid captcha.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate captcha for manual payment
    
    
    
    //#region validate cardToken when useSavedCard
    if (useSavedCard && !customerId) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate cardToken when useSavedCard
    
    
    
    //#region validate shipping address
    const {
        // shippings:
        shippingAddress,
        
        shippingProviderId,
    } = placeOrderData;
    const hasShippingAddress = !!shippingAddress;
    if (hasShippingAddress) {
        if (
               !shippingAddress.country   || (typeof(shippingAddress.country) !== 'string') // todo validate country id
            || !shippingAddress.state     || (typeof(shippingAddress.state) !== 'string')
            || !shippingAddress.city      || (typeof(shippingAddress.city) !== 'string')
            || !shippingAddress.zip       || (typeof(shippingAddress.zip) !== 'string')
            || !shippingAddress.address   || (typeof(shippingAddress.address) !== 'string')
            
            || !shippingAddress.firstName || (typeof(shippingAddress.firstName) !== 'string')
            || !shippingAddress.lastName  || (typeof(shippingAddress.lastName) !== 'string')
            || !shippingAddress.phone     || (typeof(shippingAddress.phone) !== 'string')
            
            || !shippingProviderId  || (typeof(shippingProviderId) !== 'string') // todo validate shipping provider
        ) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate shipping address
    
    
    
    //#region validate billing address
    const {
        // billings:
        billingAddress,
    } = placeOrderData;
    const hasBillingAddress = !!billingAddress;
    if (hasBillingAddress) {
        if (
               !billingAddress.country   || (typeof(billingAddress.country) !== 'string') // todo validate country id
            || !billingAddress.state     || (typeof(billingAddress.state) !== 'string')
            || !billingAddress.city      || (typeof(billingAddress.city) !== 'string')
            || !billingAddress.zip       || (typeof(billingAddress.zip) !== 'string')
            || !billingAddress.address   || (typeof(billingAddress.address) !== 'string')
            
            || !billingAddress.firstName || (typeof(billingAddress.firstName) !== 'string')
            || !billingAddress.lastName  || (typeof(billingAddress.lastName) !== 'string')
            || !billingAddress.phone     || (typeof(billingAddress.phone) !== 'string')
            
        ) {
            return Response.json({
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    type RequiredNonNullable<T> = {
        [P in keyof T]: NonNullable<T[P]>
    };
    const validFormattedItems : RequiredNonNullable<Pick<DraftOrderItem, 'productId'|'variantIds'|'quantity'>>[] = [];
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
    
    
    
    // performing complex transactions:
    let savedPaymentMethodName : string|null = null;
    const authorizedOrPaidOrDeclinedOrSimulatedOrError = await (async (): Promise<AuthorizedFundData|PaymentDetail|null|0|Response> => {
        try {
            const isPaid = !['manual', 'indomaret', 'alfamart'].includes(paymentSource);
            const paymentConfirmationToken = (
                isPaid
                ? null // no need for `paymentConfirmation`, because the order is paid_immediately
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
            
            
            
            const transactionResult = await prisma.$transaction(async (prismaTransaction): Promise<AuthorizedFundData|[PaymentDetail, OrderAndData]|null|0> => {
                //#region batch queries
                const [selectedShipping, validExistingProducts, foundOrderIdInDraftOrder, foundOrderIdInOrder] = await Promise.all([
                    (!simulateOrder && hasShippingAddress) ? prismaTransaction.shippingProvider.findUnique({
                        where  : {
                            id         : shippingProviderId,
                            visibility : { not: 'DRAFT' }, // allows access to ShippingProvider with visibility: 'PUBLISHED' but NOT 'DRAFT'
                        },
                        select : {
                            // records:
                            id         : true, // required for identifier
                            
                            
                            
                            // data:
                            name       : true, // required for identifier
                            
                            weightStep : true, // required for calculate_shipping_cost algorithm
                            rates      : {     // required for calculate_shipping_cost algorithm
                                select : {
                                    // data:
                                    start : true,
                                    rate  : true,
                                },
                            },
                            
                            useZones   : true, // required for matching_shipping algorithm
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
                
                
                
                //#region validate cart items: check existing products => check product quantities => create detailed items
                const detailedItems    : DetailedItem[] = [];
                /**
                 * Contains non_nullable product stocks to be reduced from current stock
                 */
                const reduceStockItems : (RequiredNonNullable<Pick<DraftOrderItem, 'productId'>> & { stockId: string, quantity: number })[] = [];
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
                    , string>({
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
                            .map(async (unitPricePart): Promise<number> =>
                                convertCustomerCurrencyIfRequired(unitPricePart, currency)
                            )
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
                            // relations:
                            productId      : productId,
                            variantIds     : selectedVariantIds,
                            
                            // readable:
                            productName    : product.name,
                            variantNames   : selectedVariants.map(({name}) => name),
                            
                            // data:
                            priceConverted : unitPriceConverted,
                            shippingWeight : unitWeight,
                            quantity       : quantity,
                        });
                        
                        
                        
                        totalProductPriceConverted  += unitPriceConverted * quantity;          // may produces ugly_fractional_decimal
                        totalProductPriceConverted   = trimNumber(totalProductPriceConverted); // decimalize accumulated numbers to avoid producing ugly_fractional_decimal
                        
                        
                        
                        if (unitWeight !== null) {
                            if (totalProductWeight === null) totalProductWeight = 0;           // has a/some physical products => reset the counter from zero if null
                            
                            totalProductWeight      += unitWeight         * quantity;          // may produces ugly_fractional_decimal
                            totalProductWeight       = trimNumber(totalProductWeight);         // decimalize accumulated numbers to avoid producing ugly_fractional_decimal
                        } // if
                    } // for
                    
                    
                    
                    if (limitedStockItems.length) throw new OutOfStockError(limitedStockItems);
                    if (simulateOrder) return 0; // result of `0` => simulateOrder
                }
                if (!hasShippingAddress) {
                    if (totalProductWeight !== null) throw 'BAD_SHIPPING'; // if NO  shippingAddress => should have NO PHYSICAL_GOODS
                }
                else {
                    if (totalProductWeight === null) throw 'BAD_SHIPPING'; // if HAS shippingAddress => should HAVE PHYSICAL_GOODS
                } // if
                //#endregion validate cart items: check existing products => check product quantities => create detailed items
                
                
                
                //#region validate shipping
                if (!simulateOrder && hasShippingAddress && !selectedShipping) throw 'BAD_SHIPPING';
                
                const matchingShipping = (
                    (!simulateOrder && hasShippingAddress && !!selectedShipping)
                    ? (
                        await testMatchingShipping(prismaTransaction, selectedShipping, shippingAddress)
                        ??
                        await (async (): Promise<MatchingShipping|null> => {
                            const [shippingOrigin, shippingProviders] = await Promise.all([
                                prismaTransaction.defaultShippingOrigin.findFirst({
                                    select : defaultShippingOriginSelect,
                                }),
                                
                                prismaTransaction.shippingProvider.findMany({
                                    where  : {
                                        visibility : { not: 'DRAFT' }, // allows access to ShippingProvider with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                    },
                                    select : {
                                        // records:
                                        id         : true, // required for identifier
                                        
                                        
                                        
                                        // data:
                                        name       : true, // required for identifier
                                        
                                        weightStep : true, // required for calculate_shipping_cost algorithm
                                        eta        : {     // optional for matching_shipping algorithm
                                            select : {
                                                // data:
                                                min : true,
                                                max : true,
                                            },
                                        },
                                        rates      : {     // required for calculate_shipping_cost algorithm
                                            select : {
                                                // data:
                                                start : true,
                                                rate  : true,
                                            },
                                        },
                                        
                                        useZones   : true, // required for matching_shipping algorithm
                                    },
                                }),
                            ]);
                            if (!shippingOrigin) return null;
                            if (!shippingProviders.length) return null;
                            
                            
                            
                            const externalShippingRates = await getMatchingShippings(shippingProviders, {
                                originAddress      : shippingOrigin,
                                shippingAddress    : {
                                    country   : shippingAddress.country,
                                    state     : shippingAddress.state,
                                    city      : shippingAddress.city,
                                    zip       : shippingAddress.zip,
                                    address   : shippingAddress.address,
                                    
                                    firstName : shippingAddress.firstName,
                                    lastName  : shippingAddress.lastName,
                                    phone     : shippingAddress.phone,
                                },
                                totalProductWeight : totalProductWeight ?? 0,
                                prismaTransaction,
                            });
                            return (
                                externalShippingRates
                                .find(({id}) => (id === selectedShipping.id))
                                ??
                                null
                            );
                        })()
                    )
                    : null
                );
                if (!simulateOrder && hasShippingAddress && !matchingShipping) throw 'BAD_SHIPPING';
                
                
                
                const totalShippingCost          = matchingShipping ? calculateShippingCost(matchingShipping, totalProductWeight) : null;
                const totalShippingCostConverted = await convertCustomerCurrencyIfRequired(totalShippingCost, currency);
                const totalCostConverted         = trimNumber(                                 // decimalize summed numbers to avoid producing ugly_fractional_decimal
                    totalProductPriceConverted + (totalShippingCostConverted ?? 0)             // may produces ugly_fractional_decimal
                );
                //#endregion validate shipping
                
                
                
                //#region fetch payment gateway API
                const gatewayResult = await(async (): Promise<AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|null> => {
                    if (usePaypalGateway) {
                        return paypalCreateOrder(null, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                            
                            paymentMethodProviderCustomerId : paymentMethodProviderCustomerIds?.paypalCustomerId, // save payment method during purchase (if opted)
                        });
                    }
                    else if (cardToken) {
                        if (useStripeGateway) {
                            return stripeCreateOrder(cardToken, orderId, {
                                currency,
                                totalCostConverted,
                                totalProductPriceConverted,
                                totalShippingCostConverted,
                                
                                hasShippingAddress,
                                shippingAddress,
                                
                                hasBillingAddress,
                                billingAddress,
                                
                                detailedItems,
                                
                                paymentMethodProviderCustomerId : paymentMethodProviderCustomerIds?.stripeCustomerId, // save payment method during purchase (if opted)
                            });
                        }
                        else if (useMidtransGateway) {
                            return midtransCreateOrderWithCard(cardToken, orderId, {
                                currency,
                                totalCostConverted,
                                totalProductPriceConverted,
                                totalShippingCostConverted,
                                
                                hasShippingAddress,
                                shippingAddress,
                                
                                hasBillingAddress,
                                billingAddress,
                                
                                detailedItems,
                                
                                paymentMethodProviderCustomerId : paymentMethodProviderCustomerIds?.midtransCustomerId, // save payment method during purchase (if opted)
                            });
                        }
                        else if (useSavedCard) {
                            const savedPaymentMethod = await prismaTransaction.paymentMethod.findUnique({
                                where  : {
                                    id       : cardToken,
                                    parentId : customerId, // important: the signedIn customerId
                                    provider : { in: [
                                        ...(paypalPaymentEnabled   ? (['PAYPAL'  ] satisfies PaymentMethodProvider[]) : []),
                                        ...(stripePaymentEnabled   ? (['STRIPE'  ] satisfies PaymentMethodProvider[]) : []),
                                        ...(midtransPaymentEnabled ? (['MIDTRANS'] satisfies PaymentMethodProvider[]) : []),
                                    ]},
                                },
                                select : {
                                    type                       : true,
                                    provider                   : true,
                                    providerPaymentMethodId    : true,
                                    
                                    parent                     : {
                                        select : {
                                            paypalCustomerId   : true,
                                            stripeCustomerId   : true,
                                            midtransCustomerId : true,
                                        },
                                    },
                                },
                            });
                            if (!savedPaymentMethod) return null; // savedPaymentMethod not found (or disabled) in database => payment declined
                            
                            
                            
                            savedPaymentMethodName = savedPaymentMethod.provider;
                            switch (savedPaymentMethod.provider) {
                                case 'PAYPAL'   : return paypalCreateOrder({ type: savedPaymentMethod.type, paymentMethodProviderId: savedPaymentMethod.providerPaymentMethodId }, {
                                    currency,
                                    totalCostConverted,
                                    totalProductPriceConverted,
                                    totalShippingCostConverted,
                                    
                                    hasShippingAddress,
                                    shippingAddress,
                                    
                                    hasBillingAddress,
                                    billingAddress,
                                    
                                    detailedItems,
                                    
                                    paymentMethodProviderCustomerId : savedPaymentMethod.parent.paypalCustomerId,
                                });
                                case 'STRIPE'   : return stripeCreateOrder({ paymentMethodProviderId: savedPaymentMethod.providerPaymentMethodId }, orderId, {
                                    currency,
                                    totalCostConverted,
                                    totalProductPriceConverted,
                                    totalShippingCostConverted,
                                    
                                    hasShippingAddress,
                                    shippingAddress,
                                    
                                    hasBillingAddress,
                                    billingAddress,
                                    
                                    detailedItems,
                                    
                                    paymentMethodProviderCustomerId : savedPaymentMethod.parent.stripeCustomerId,
                                });
                                case 'MIDTRANS' : return midtransCreateOrderWithCard({ paymentMethodProviderId: savedPaymentMethod.providerPaymentMethodId }, orderId, {
                                    currency,
                                    totalCostConverted,
                                    totalProductPriceConverted,
                                    totalShippingCostConverted,
                                    
                                    hasShippingAddress,
                                    shippingAddress,
                                    
                                    hasBillingAddress,
                                    billingAddress,
                                    
                                    detailedItems,
                                    
                                    paymentMethodProviderCustomerId : savedPaymentMethod.parent.midtransCustomerId,
                                });
                                
                                
                                
                                default       : return null;
                            } // switch
                        }
                        else {
                            throw Error('unexpected condition');
                        } // if
                    }
                    else if (paymentSource === 'midtransQris') {
                        return midtransCreateOrderWithQris(orderId, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                        });
                    }
                    else if (paymentSource === 'gopay') {
                        return midtransCreateOrderWithGopay(orderId, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                        });
                    }
                    else if (paymentSource === 'shopeepay') {
                        return midtransCreateOrderWithShopeepay(orderId, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                        });
                    }
                    else if (paymentSource === 'indomaret') {
                        const authorizedOrPaidWithCaptureOrDeclined = await midtransCreateOrderWithIndomaret(orderId, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                        });
                        
                        if (isAuthorizedFundData(authorizedOrPaidWithCaptureOrDeclined)) {
                            //#region converts AuthorizedFundData => [PaymentDetail, PaymentMethodCapture|null]
                            const {
                                paymentId,
                                paymentCode, // for Indomaret payment code
                                expires,     // for Indomaret payment code expiry_date
                            } = authorizedOrPaidWithCaptureOrDeclined satisfies AuthorizedFundData;
                            
                            return [
                                {
                                    type       : 'MANUAL',
                                    brand      : 'indomaret',
                                    identifier : paymentCode ?? '', // for Indomaret payment code
                                    paymentId  : paymentId,
                                    expiresAt  : expires,           // for Indomaret payment code expiry_date
                                    
                                    amount     : 0,
                                    fee        : 0,
                                } satisfies PaymentDetail,
                                
                                
                                
                                // no need to save the paymentMethodCapture:
                                null,
                            ] satisfies [PaymentDetail, PaymentMethodCapture|null];
                            //#endregion converts AuthorizedFundData => [PaymentDetail, PaymentMethodCapture|null]
                        }
                        else if (isPaymentDetailWithCapture(authorizedOrPaidWithCaptureOrDeclined)) {
                            // should never happended:
                            console.log('unexpected response: ', authorizedOrPaidWithCaptureOrDeclined);
                            throw Error('unexpected API response');
                        }
                        else {
                            return authorizedOrPaidWithCaptureOrDeclined;
                        } // if
                    }
                    else if (paymentSource === 'alfamart') {
                        const authorizedOrPaidWithCaptureOrDeclined = await midtransCreateOrderWithAlfamart(orderId, {
                            currency,
                            totalCostConverted,
                            totalProductPriceConverted,
                            totalShippingCostConverted,
                            
                            hasShippingAddress,
                            shippingAddress,
                            
                            hasBillingAddress,
                            billingAddress,
                            
                            detailedItems,
                        });
                        
                        if (isAuthorizedFundData(authorizedOrPaidWithCaptureOrDeclined)) {
                            //#region converts AuthorizedFundData => [PaymentDetail, PaymentMethodCapture|null]
                            const {
                                paymentId,
                                paymentCode, // for Alfamart payment code
                                expires,     // for Alfamart payment code expiry_date
                            } = authorizedOrPaidWithCaptureOrDeclined satisfies AuthorizedFundData;
                            
                            return [
                                {
                                    type       : 'MANUAL',
                                    brand      : 'alfamart',
                                    identifier : paymentCode ?? '', // for Alfamart payment code
                                    paymentId  : paymentId,
                                    expiresAt  : expires,           // for Alfamart payment code expiry_date
                                    
                                    amount     : 0,
                                    fee        : 0,
                                } satisfies PaymentDetail,
                                
                                
                                
                                // no need to save the paymentMethodCapture:
                                null,
                            ] satisfies [PaymentDetail, PaymentMethodCapture|null];
                            //#endregion converts AuthorizedFundData => [PaymentDetail, PaymentMethodCapture|null]
                        }
                        else if (isPaymentDetailWithCapture(authorizedOrPaidWithCaptureOrDeclined)) {
                            // should never happended:
                            console.log('unexpected response: ', authorizedOrPaidWithCaptureOrDeclined);
                            throw Error('unexpected API response');
                        }
                        else {
                            return authorizedOrPaidWithCaptureOrDeclined;
                        } // if
                    }
                    else if (paymentSource === 'manual') {
                        return [
                            {
                                type       : 'MANUAL',
                                brand      : null,
                                identifier : null,
                                expiresAt  : new Date(Date.now() + (checkoutConfigServer.payment.expires.manual * 24 * 60 * 60 * 1000)),
                                
                                amount     : 0,
                                fee        : 0,
                            } satisfies PaymentDetail,
                            
                            
                            
                            // no need to save the paymentMethodCapture:
                            null,
                        ] satisfies [PaymentDetail, PaymentMethodCapture|null];
                    }
                    else {
                        throw Error('unexpected condition');
                    } // if
                })();
                if (!gatewayResult) return null;
                //#endregion fetch payment gateway API
                
                
                
                //#region save the database
                let savingCurrency   = currency || checkoutConfigServer.intl.defaultCurrency;
                const orderItemsData : CreateOrderDataBasic['items'] = detailedItems.map((detailedItem) => {
                    return {
                        productId      : detailedItem.productId,
                        variantIds     : detailedItem.variantIds,
                        
                        price          : detailedItem.priceConverted,
                        shippingWeight : detailedItem.shippingWeight,
                        quantity       : detailedItem.quantity,
                    } satisfies CreateOrderDataBasic['items'][number];
                });
                const currencyData : OrderCurrencyDetail|null = (
                    (savingCurrency === checkoutConfigServer.intl.defaultCurrency)
                    ? null
                    : {
                        currency       : savingCurrency,
                        rate           : await getCurrencyRate(savingCurrency),
                    } satisfies OrderCurrencyDetail
                );
                const shippingAddressData : ShippingAddressDetail|null = (
                    !hasShippingAddress
                    ? null
                    : shippingAddress
                );
                const shippingCostData : number|null = (
                    !hasShippingAddress
                    ? null
                    : totalShippingCostConverted
                );
                
                const preference : CustomerOrGuestPreferenceDetail = {
                    marketingOpt     : marketingOpt,
                    timezone         : checkoutConfigServer.intl.defaultTimezone, // TODO: detect customer's|guest's timezone based on browser detection `(0 - (new Date()).getTimezoneOffset())`
                };
                const customerOrGuest : CustomerConnectData|GuestCreateData = (
                    customerId
                    ? ({
                        id : customerId,
                        preference,
                    } satisfies CustomerConnectData)
                    : ({
                        ...(guest as unknown as GuestDetail),
                        preference,
                    } satisfies GuestCreateData)
                );
                const billingAddressData : BillingAddressDetail|null = (
                    !hasBillingAddress
                    ? null
                    : billingAddress
                );
                
                
                
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
                
                
                
                if (isAuthorizedFundData(gatewayResult)) {
                    await Promise.all([
                        decreaseStocksPromise,
                        
                        
                        
                        // pending_paid => create new (draft)Order:
                        createDraftOrder(prismaTransaction, {
                            // temporary data:
                            expiresAt                : new Date(Date.now() + (15 * 60 * 1000)), // expires in 15 minutes
                            paymentId                : gatewayResult.paymentId,
                            
                            // primary data:
                            orderId                  : orderId,
                            items                    : orderItemsData,
                            currency                 : currencyData,
                            shippingAddress          : shippingAddressData,
                            shippingCost             : shippingCostData,
                            shippingProviderId       : !hasShippingAddress ? null : (shippingProviderId ?? null) as string|null,
                            
                            // extended data:
                            customerOrGuest          : customerOrGuest,
                        }),
                    ]);
                    
                    
                    
                    return gatewayResult;
                } // if
                
                
                
                const [
                    paymentDetail,
                    paymentMethodCapture,
                ] = gatewayResult satisfies [PaymentDetail, PaymentMethodCapture|null];
                const [, orderAndData] = await Promise.all([
                    decreaseStocksPromise,
                    
                    
                    
                    // paid_immediately => crate new (real)Order:
                    createOrder(prismaTransaction, {
                        // primary data:
                        orderId                  : orderId,
                        paymentId                : paymentDetail.paymentId ?? undefined, // will be random_auto_generated if null|undefined
                        items                    : orderItemsData,
                        currency                 : currencyData,
                        shippingAddress          : shippingAddressData,
                        shippingCost             : shippingCostData,
                        shippingProviderId       : !hasShippingAddress ? null : (shippingProviderId ?? null) as string|null,
                        
                        // extended data:
                        customerOrGuest          : customerOrGuest,
                        payment                  : {
                            ...((): PaymentDetail => {
                                const {
                                    paymentId : _paymentId, // remove
                                    ...restPaid
                                } = paymentDetail;
                                return restPaid satisfies PaymentDetail;
                            })(),
                            expiresAt            : paymentDetail.expiresAt ?? null,
                            billingAddress       : billingAddressData,
                        } satisfies PaymentDetail,
                        paymentMethodCapture     : paymentMethodCapture,
                        paymentConfirmationToken : paymentConfirmationToken,
                    }),
                ]);
                
                
                
                return [
                    paymentDetail,
                    orderAndData,
                ] satisfies [PaymentDetail, OrderAndData];
                //#endregion save the database
            }, { timeout: 50000 }); // give a longer timeout for `paymentProcessorCreateOrder` // may up to 40 secs => rounded up to 50 secs
            
            
            
            // send email confirmation:
            if ((process.env.DEV_DISABLE_SEND_EMAIL !== 'true') && Array.isArray(transactionResult) /* the transaction is finished (not a pending (redirect) payment) AND a RealOrder is created */) {
                const [, newOrder] = transactionResult satisfies [PaymentDetail, OrderAndData];
                await Promise.all([
                    // notify for waiting for payment (manual_payment):
                    // -or-
                    // notify that the payment has been received:
                    sendConfirmationEmail({
                        order : newOrder,
                        
                        isPaid, // waiting for manual_payment -or- paid
                        paymentConfirmationToken, // a paymentConfirmationToken (random string) if waiting for manual_payment -or- null
                    }),
                    
                    
                    
                    // notify for waiting for payment (manual_payment) to adminApp via webhook:
                    // -or-
                    // notify that the payment has been received to adminApp via webhook:
                    fetch(`${process.env.ADMIN_APP_URL ?? ''}/api/webhooks/checkouts/new`, {
                        method  : 'POST',
                        headers : {
                            'X-Secret' : process.env.APP_SECRET ?? '',
                        },
                        body    : JSON.stringify({
                            orderId : newOrder.orderId,
                        }),
                    }),
                ]);
            } // if
            
            
            
            if (Array.isArray(transactionResult)) {
                const [paymentDetail] = transactionResult satisfies [PaymentDetail, OrderAndData];
                return paymentDetail;
            } // if
            return transactionResult;
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
                * Configured currency is not supported by Paypal.
                * Invalid API_request body JSON (programming bug).
                * unexpected API response (programming bug).
            */
            
            if (error instanceof OutOfStockError) {
                return Response.json({
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
                    return Response.json({
                        error: error,
                    }, { status: 400 }); // handled with error
                } break;
                
                default                           : {
                    console.log('ERROR: ', error);
                    return Response.json({
                        error: 'internal server error',
                    }, { status: 500 }); // handled with error
                } break;
            } // switch
        } // try
    })();
    
    
    
    // error response:
    if (authorizedOrPaidOrDeclinedOrSimulatedOrError instanceof Response) {
        return authorizedOrPaidOrDeclinedOrSimulatedOrError;
    } // if
    
    // simulated response:
    if (authorizedOrPaidOrDeclinedOrSimulatedOrError === 0) { // result of `0` => simulateOrder
        // simulateOrder:
        const placeOrderDetail : PlaceOrderDetail = {
            orderId      : '',
            redirectData : undefined,
        };
        return Response.json(placeOrderDetail); // handled with success
    } // if
    
    // declined response:
    if (authorizedOrPaidOrDeclinedOrSimulatedOrError === null) { // result of `null` => declined
        // payment rejected:
        const paymentDeclined : PaymentDeclined = {
            error  : (
                ((paymentSource === 'card') || paymentSource?.endsWith?.('Card'))
                ? 'Your card was declined.'
                : 'The payment was declined.'
            ),
        };
        return Response.json(paymentDeclined, { status : 402 }); // payment DECLINED
    } // if
    
    // authorized response:
    if (isAuthorizedFundData(authorizedOrPaidOrDeclinedOrSimulatedOrError)) {
        const {
            paymentId,
            // paymentCode,
            redirectData,
            expires,
        } = authorizedOrPaidOrDeclinedOrSimulatedOrError satisfies AuthorizedFundData;
        
        const placeOrderDetail : PlaceOrderDetail = {
            orderId      : (() => {
                let prefix = '';
                
                if      (usePaypalGateway  ) prefix = '#PAYPAL_';
                else if (useStripeGateway  ) prefix = '#STRIPE_'
                else if (useMidtransGateway) prefix = '#MIDTRANS_';
                else if (useSavedCard      ) prefix = `#${savedPaymentMethodName}_`;
                
                return `${prefix}${paymentId}`;
            })(),
            redirectData,
            expires,
        };
        return Response.json(placeOrderDetail); // handled with success
    } // if
    
    // paid response:
    const paymentDetail = authorizedOrPaidOrDeclinedOrSimulatedOrError satisfies PaymentDetail;
    return Response.json(paymentDetail); // handled with success
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const rawOrderId = paymentData.orderId;
    if (typeof(rawOrderId) !== 'string') {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    let orderId           : string|null = null;
    let paymentId         : string|null = null;
    let paypalPaymentId   : string|null = null;
    let stripePaymentId   : string|null = null;
    let midtransPaymentId : string|null = null;
    if (rawOrderId.startsWith('#PAYPAL_')) {
        paymentId = rawOrderId.slice(8); // remove prefix #PAYPAL_
        if (!paymentId.length) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        paypalPaymentId = paymentId;
    }
    else if (rawOrderId.startsWith('#STRIPE_')) {
        paymentId = rawOrderId.slice(8); // remove prefix #STRIPE_
        if (!paymentId.length) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
        stripePaymentId = paymentId;
        
        if (paymentId.startsWith('#CAPTURED_')) paymentId = paymentId.slice(10); // remove prefix #CAPTURED_
    }
    else if (rawOrderId.startsWith('#MIDTRANS_')) {
        paymentId = rawOrderId.slice(10); // remove prefix #MIDTRANS_
        if (!paymentId.length) {
            return Response.json({
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate options
    
    
    
    //#region cancel the payment
    if (cancelOrder) {
        const orderDeletedFromDatabase = await prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
            const draftOrder = await findDraftOrderById(prismaTransaction, {
                orderId     : orderId,
                paymentId   : paymentId,
                
                orderSelect : revertDraftOrderSelect,
            });
            if (!draftOrder) return false; // the draftOrder is not found => ignore
            
            
            
            // draftOrder CANCELED => restore the `Product` stock and delete the `draftOrder`:
            await revertDraftOrder(prismaTransaction, {
                draftOrder : draftOrder,
            });
            return true;
        }, { timeout: 50000 }); // give a longer timeout for `revertDraftOrder`
        
        
        
        if (orderDeletedFromDatabase) {
            try {
                if (paypalPaymentId) {
                    // no need an order cancelation for paypal
                }
                else if (stripePaymentId) {
                    if (stripePaymentId.startsWith('#CAPTURED_')) stripePaymentId = stripePaymentId.slice(10); // remove prefix #CAPTURED_
                    await stripeCancelOrder(stripePaymentId);
                }
                else if (midtransPaymentId) {
                    await midtransCancelOrder(midtransPaymentId);
                } // if
            }
            catch {
                // ignore any error
            } // try
        } // if
        
        
        
        return Response.json({
            canceled: orderDeletedFromDatabase, // false => canceled -or- true => too late, the order already APPROVED
        });
    };
    //#endregion cancel the payment
    
    
    
    //#region validate billing address
    const {
        // billings:
        billingAddress,
    } = paymentData;
    const hasBillingAddress = !!billingAddress;
    if (hasBillingAddress) {
        if (
               !billingAddress.country   || (typeof(billingAddress.country) !== 'string') // todo validate country id
            || !billingAddress.state     || (typeof(billingAddress.state) !== 'string')
            || !billingAddress.city      || (typeof(billingAddress.city) !== 'string')
            || !billingAddress.zip       || (typeof(billingAddress.zip) !== 'string')
            || !billingAddress.address   || (typeof(billingAddress.address) !== 'string')
            
            || !billingAddress.firstName || (typeof(billingAddress.firstName) !== 'string')
            || !billingAddress.lastName  || (typeof(billingAddress.lastName) !== 'string')
            || !billingAddress.phone     || (typeof(billingAddress.phone) !== 'string')
        ) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validate billing address
    
    
    
    // performing complex transactions:
    const paidOrDeclinedOrError = await (async (): Promise<PaymentDetail|null|Response> => {
        try {
            const transactionResult = await prisma.$transaction(async (prismaTransaction): Promise<[PaymentDetail, OrderAndData]|null> => {
                //#region verify draftOrder_id
                const draftOrder = await findDraftOrderById(prismaTransaction, {
                    orderId     : orderId,
                    paymentId   : paymentId,
                    
                    orderSelect : commitDraftOrderSelect,
                });
                if (!draftOrder) throw 'DRAFT_ORDER_NOT_FOUND';
                if (draftOrder.expiresAt <= new Date()) {
                    // draftOrder EXPIRED => restore the `Product` stock and delete the `draftOrder`:
                    await revertDraftOrder(prismaTransaction, {
                        draftOrder : draftOrder,
                    });
                    
                    
                    
                    throw 'DRAFT_ORDER_EXPIRED';
                } // if
                //#endregion verify draftOrder_id
                
                
                
                //#region fetch payment gateway API
                const gatewayResult = await(async (): Promise<[PaymentDetail, PaymentMethodCapture|null]|null> => {
                    if (paypalPaymentId) {
                        return paypalCaptureFund(paypalPaymentId);
                    }
                    else if (stripePaymentId) {
                        return stripeCaptureFund(stripePaymentId);
                    }
                    else if (midtransPaymentId) {
                        return midtransCaptureFund(midtransPaymentId);
                    }
                    else {
                        console.log('unimplemented payment gateway');
                        throw Error('unimplemented payment gateway');
                    } // if
                })();
                if (!gatewayResult) {
                    // payment DECLINED => restore the `Product` stock and delete the `draftOrder`:
                    await revertDraftOrder(prismaTransaction, {
                        draftOrder : draftOrder,
                    });
                    
                    
                    
                    return null;
                } // if
                //#endregion fetch payment gateway API
                
                
                
                //#region save the database
                // payment APPROVED => move the `draftOrder` to `order`:
                const [
                    paymentDetail,
                    paymentMethodCapture,
                ] = gatewayResult satisfies [PaymentDetail, PaymentMethodCapture|null];
                const orderAndData = await commitDraftOrder(prismaTransaction, {
                    draftOrder           : draftOrder,
                    payment              : {
                        ...paymentDetail,
                        expiresAt        : null, // paid, no more payment expiry date
                        billingAddress   : (
                            !hasBillingAddress
                            ? null
                            : billingAddress
                        ),
                    },
                    paymentMethodCapture : paymentMethodCapture,
                });
                //#endregion save the database
                
                
                
                // report the payment result:
                return [
                    paymentDetail,
                    orderAndData,
                ] satisfies [PaymentDetail, OrderAndData];
            }, { timeout: 50000 }); // give a longer timeout for `revertDraftOrder` and `stripeCaptureFund` // may up to 40 secs => rounded up to 50 secs
            
            
            
            // send email confirmation:
            if ((process.env.DEV_DISABLE_SEND_EMAIL !== 'true') && Array.isArray(transactionResult) /* the transaction is finished AND a RealOrder is created */) {
                const [, newOrder] = transactionResult satisfies [PaymentDetail, OrderAndData];
                await Promise.all([
                    // notify that the payment has been received:
                    sendConfirmationEmail({
                        order                    : newOrder,
                        
                        isPaid                   : true,
                        paymentConfirmationToken : null,
                    }),
                    
                    
                    
                    // notify that the payment has been received to adminApp via webhook:
                    fetch(`${process.env.ADMIN_APP_URL ?? ''}/api/webhooks/checkouts/new`, {
                        method  : 'POST',
                        headers : {
                            'X-Secret' : process.env.APP_SECRET ?? '',
                        },
                        body    : JSON.stringify({
                            orderId : newOrder.orderId,
                        }),
                    }),
                ]);
            } // if
            
            
            
            if (Array.isArray(transactionResult)) {
                const [paymentDetail] = transactionResult satisfies [PaymentDetail, OrderAndData];
                return paymentDetail;
            } // if
            return transactionResult;
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
                * unimplemented payment gateway.
            */
            switch (error) {
                case 'DRAFT_ORDER_NOT_FOUND' :
                case 'DRAFT_ORDER_EXPIRED'   : {
                    return Response.json({
                        error: error,
                    }, { status: 400 }); // handled with error
                } break;
                
                default                      : {
                    console.log('UNKNOWN ERROR: ',  error)
                    return Response.json({
                        error: 'internal server error',
                    }, { status: 500 }); // handled with error
                } break;
            } // switch
        } // try
    })();
    
    
    
    // error response:
    if (paidOrDeclinedOrError instanceof Response) {
        return paidOrDeclinedOrError;
    } // if
    
    // declined response:
    if (paidOrDeclinedOrError === null) { // result of `null` => declined
        // payment rejected:
        const paymentDeclined : PaymentDeclined = {
            error  : 'The payment was declined.',
        };
        return Response.json(paymentDeclined, { status : 402 }); // payment DECLINED
    } // if
    
    // paid response:
    const paymentDetail = paidOrDeclinedOrError satisfies PaymentDetail;
    return Response.json(paymentDetail); // handled with success
})

/**
 * display the previously purchased order
 */
.put(async (req) => {
    const rawOrderId = req.nextUrl.searchParams.get('orderId');
    if ((typeof(rawOrderId) !== 'string') || !rawOrderId) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    };
    
    const orderId = rawOrderId;
    if (!orderId.length) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    const order = await prisma.order.findFirst({
        where  : {
            orderId   : orderId,
            updatedAt : { gt: new Date(Date.now() - (1 * 60 * 60 * 1000)) } // prevents for searching order older than 1 hour ago
        },
        select : {
            currency : {
                select : {
                    currency : true,
                    rate     : true,
                },
            },
            items : {
                select : {
                    // for CartItem[]:
                    productId  : true,
                    variantIds : true,
                    quantity   : true,
                    
                    
                    
                    product : {
                        select : {
                            // for EntityState<ProductPreview, string>:
                            id             : true,
                            
                            name           : true,
                            
                            price          : true,
                            shippingWeight : true,
                            
                            path           : true,
                            images         : true,
                            
                            variantGroups : {
                                select : {
                                    variants : {
                                        where    : {
                                            visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                        },
                                        select : {
                                            id             : true,
                                            
                                            name           : true,
                                            
                                            price          : true,
                                            shippingWeight : true,
                                            
                                            images         : true,
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
                        },
                    },
                },
            },
            
            
            
            customer : {
                select : {
                    // for CustomerMinimumData:
                    name  : true,
                    email : true,
                    
                    
                    
                    preference : {
                        select : {
                            // for ExtraData:
                            marketingOpt : true,
                        },
                    },
                },
            },
            guest    : {
                select : {
                    // for GuestMinimumData:
                    name  : true,
                    email : true,
                    
                    
                    
                    preference : {
                        select : {
                            // for ExtraData:
                            marketingOpt : true,
                        },
                    },
                },
            },
            
            
            
            // shipping data:
            shippingAddress    : {
                select : {
                    country   : true,
                    state     : true,
                    city      : true,
                    zip       : true,
                    address   : true,
                    
                    firstName : true,
                    lastName  : true,
                    phone     : true,
                },
            },
            shippingProviderId : true,
            shippingCost       : true,
            
            
            
            payment : {
                select : {
                    // for PaymentDetail:
                    type           : true,
                    brand          : true,
                    identifier     : true,
                    amount         : true,
                    fee            : true,
                    
                    
                    
                    // for BillingData:
                    billingAddress : {
                        select : {
                            country   : true,
                            state     : true,
                            city      : true,
                            zip       : true,
                            address   : true,
                            
                            firstName : true,
                            lastName  : true,
                            phone     : true,
                        },
                    },
                },
            },
        },
    });
    if (!order) {
        return Response.json({
            error: 'Order not found.',
        }, { status: 404 }); // handled with error
    } // if
    
    
    
    const {
        currency,
        items,
        
        customer,
        guest,
        
        shippingAddress,
        shippingProviderId,
        shippingCost,
        
        payment,
        // payment : {
        //     billingAddress,
        //     ...paymentDetail
        // },
    } = order;
    const paymentDetail  : PaymentDetail|null = payment;
    const billingAddress = paymentDetail?.billingAddress ?? null;
    
    const isPaid       = (!!paymentDetail && (paymentDetail.type !== 'MANUAL'));
    const checkoutStep = isPaid ? 'PAID' : 'PENDING';
    
    const finishedOrderState : FinishedOrderState = {
        cartState                 : {
            items    : items.map(({productId, variantIds, quantity}) => ({productId : productId ?? '', variantIds, quantity})),
            currency : currency?.currency ?? checkoutConfigServer.payment.defaultCurrency,
        },
        productPreviews           : /* cannot using Map in JSON new Map<string, ProductPreview> */(
            items.map(({product}) => product).filter((product): product is Exclude<typeof product, null> => (product !== null))
            .map((product): [string, ProductPreview] => {
                const {
                    images,        // take
                    variantGroups, // take
                ...restProduct} = product;
                
                return [
                    restProduct.id,
                    {
                        ...restProduct,
                        image         : images?.[0],
                        variantGroups : (
                            variantGroups
                            .map(({variants}) =>
                                variants
                                .map(({images, ...restVariantPreview}) => ({
                                    ...restVariantPreview,
                                    image : images?.[0],
                                }))
                            )
                        ),
                        wished        : undefined, // no need to check wished status, so just simply reported as false
                    }
                ];
            })
        ) as unknown as Map<string, ProductPreview>,
        checkoutSession           : {
            // extra data:
            marketingOpt       : customer?.preference?.marketingOpt ?? guest?.preference?.marketingOpt ?? true,
            
            
            
            // customer data:
            customer           : (customer || guest) ? {
                name  : customer?.name  ?? guest?.name  ?? '',
                email : customer?.email ?? guest?.email ?? '',
            } : undefined,
            
            
            
            // shipping data:
            shippingAddress    : shippingAddress,
            shippingProviderId : shippingProviderId,
            
            
            
            // billing data:
            billingAddress     : billingAddress,
            
            
            
            // version control:
            version : 2,
            
            
            
            // states:
            checkoutStep,
            
            
            
            // customer data:
            customerValidation : true,
            
            
            
            // shipping data:
            shippingValidation : !!shippingAddress,
            
            
            
            // billing data:
            billingValidation  : !!billingAddress,
            billingAsShipping  : false,
            
            
            
            // payment data:
            paymentValidation  : true,
            paymentOption      : null,
        },
        totalShippingCost         : (shippingCost === null) ? null : (shippingCost / (currency?.rate ?? 1)),
        paymentDetail             : paymentDetail,
        
        isShippingAddressRequired : items.some(({quantity, product}) => (quantity > 0) && product && (product.shippingWeight !== null)),
    };
    return Response.json(finishedOrderState); // handled with success
})
