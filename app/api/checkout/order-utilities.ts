// types:
import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import type {
    Prisma,
    
    Address,
    Payment,
    PreferredCurrency,
    Order,
    OrdersOnProducts,
    DraftOrder,
    DraftOrdersOnProducts,
}                           from '@prisma/client'
import type {
    PaymentDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// templates:
import type {
    // types:
    CustomerOrGuestData,
    OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// utilities:
import {
    getMatchingShipping,
}                           from '@/libs/shippings'



export interface CreateDraftOrderData
    extends
        // bases:
        Omit<CreateOrderDataBasic,
            // extended data:
            |'payment'
            |'paymentConfirmationToken'
        >
{
    // temporary data:
    expiresAt       : Date
    paymentId       : string // redefined paymentId as non_undefined
    
    // extended data:
    customerOrGuest : CustomerOrGuestData
}
export const createDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createDraftOrderData: CreateDraftOrderData): Promise<string> => {
    // data:
    const {
        // temporary data:
        expiresAt,
        paymentId,
        
        // primary data:
        orderId,
        items,
        preferredCurrency,
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        // extended data:
        customerOrGuest,
    } = createDraftOrderData;
    const {
        preference: preferenceData,
    ...customerOrGuestData} = customerOrGuest;
    
    
    
    const newDraftOrder = await prismaTransaction.draftOrder.create({
        data : {
            // temporary data:
            
            expiresAt           : expiresAt,
            paymentId           : paymentId,
            
            // primary data:
            
            orderId             : orderId,
            
            items               : {
                create          : items,
            },
            
            preferredCurrency   : preferredCurrency,
            
            shippingAddress     : shippingAddress,
            shippingCost        : shippingCost,
            shippingProvider    : !shippingProviderId ? undefined : {
                connect         : {
                    id          : shippingProviderId,
                },
            },
            
            // extended data:
            
            // TODO: connect to existing customer
            // customer         : {
            //     connect      : {
            //         ...customerOrGuestData,
            //         customerPreference : {
            //             ...preferenceData,
            //         },
            //     },
            // },
            guest               : {
                create          : {
                    ...customerOrGuestData,
                    guestPreference : !preferenceData ? undefined : {
                        create  : preferenceData,
                    },
                },
            },
        },
        select : {
            id : true,
        },
    });
    return newDraftOrder.id;
}



export interface FindDraftOrderByIdData {
    orderId   ?: string|null
    paymentId ?: string|null
}
export const findDraftOrderById = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findDraftOrderByIdData: FindDraftOrderByIdData): Promise<(CommitDraftOrder & RevertDraftOrder)|null> => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
    } = findDraftOrderByIdData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return null;
    
    
    
    const requiredSelect = {
        id                     : true,
        expiresAt              : true,
        
        orderId                : true,
        paymentId              : true,
        
        preferredCurrency      : true,
        
        shippingAddress        : true,
        shippingCost           : true,
        shippingProviderId     : true,
        
        customerId             : true,
        guestId                : true,
        // customer               : {
        //     select : {
        //         // data:
        //         name  : true,
        //         email : true,
        //     },
        // },
        // guest                  : {
        //     select : {
        //         // data:
        //         name  : true,
        //         email : true,
        //     },
        // },
        
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
    return await prismaTransaction.draftOrder.findUnique({
        where  : {
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : requiredSelect,
    });
}



export interface CreateOrderDataBasic {
    // primary data:
    orderId                  : string
    paymentId                : string|undefined // will be random_auto_generated if undefined
    items                    : Omit<OrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'orderId'
    >[]
    preferredCurrency        : PreferredCurrency|null
    shippingAddress          : Address|null
    shippingCost             : number|null
    shippingProviderId       : string|null
    
    // extended data:
    payment                  : Payment
    paymentConfirmationToken : string|null
}
export type CreateOrderData =
    &CreateOrderDataBasic
    &(
        |{
            // extended data:
            customerOrGuest  : CustomerOrGuestData
        }
        |{
            // extended data:
            customerId       : string|null
            guestId          : string|null
        }
    )
export const createOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createOrderData: CreateOrderData): Promise<OrderAndData> => {
    // data:
    const {
        // primary data:
        orderId,
        paymentId = await (async (): Promise<string> => {
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
            return await nanoid();
        })(),
        items,
        preferredCurrency,
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        // extended data:
        payment,
        paymentConfirmationToken,
    } = createOrderData;
    
    
    
    const {customer, guest, ...newOrder} = await prismaTransaction.order.create({
        data   : {
            // primary data:
            
            orderId             : orderId,
            paymentId           : paymentId,
            
            items               : {
                create          : items,
            },
            
            preferredCurrency   : preferredCurrency,
            
            shippingAddress     : shippingAddress,
            shippingCost        : shippingCost,
            shippingProvider    : !shippingProviderId ? undefined : {
                connect         : {
                    id          : shippingProviderId,
                },
            },
            
            // extended data:
            
            ...(() => {
                if ('customerOrGuest' in createOrderData) {
                    const {
                        preference: preferenceData,
                    ...customerOrGuestData} = createOrderData.customerOrGuest;
                    
                    return {
                        // TODO: connect to existing customer
                        // customer         : {
                        //     connect      : {
                        //         ...customerOrGuestData,
                        //         customerPreference : {
                        //             ...preferenceData,
                        //         },
                        //     },
                        // },
                        guest               : {
                            create          : {
                                ...customerOrGuestData,
                                guestPreference : !preferenceData ? undefined : {
                                    create  : preferenceData,
                                },
                            },
                        },
                    };
                }
                else {
                    const {
                        customerId,
                        guestId,
                    } = createOrderData;
                    if (!!customerId) {
                        return {
                            customer : {
                                connect : {
                                    id: customerId,
                                },
                            },
                        };
                    }
                    else if (!!guestId) {
                        return {
                            guest : {
                                connect : {
                                    id: guestId,
                                },
                            },
                        };
                    }
                    else {
                        return {};
                    } // if
                }
            })(),
            
            payment             : payment,
            paymentConfirmation : !paymentConfirmationToken ? undefined : {
                create : {
                    token: paymentConfirmationToken,
                },
            },
        },
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
                            
                            // relations:
                            variantGroups : {
                                select : {
                                    variants : {
                                        // always allow to access DRAFT variants when the customer is already ordered:
                                        // where    : {
                                        //     visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                        // },
                                        select : {
                                            id   : true,
                                            
                                            name : true,
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
                    variantIds     : true,
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
            customer : {
                select : {
                    name  : true,
                    email : true,
                    customerPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
            guest    : {
                select : {
                    name  : true,
                    email : true,
                    guestPreference : {
                        select : {
                            marketingOpt : true,
                        },
                    },
                },
            },
        },
    });
    const shippingAddressData  = newOrder.shippingAddress;
    const shippingProviderData = newOrder.shippingProvider;
    return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name          : item.product.name,
                image         : item.product.images?.[0] ?? null,
                imageBase64   : undefined,
                imageId       : undefined,
                
                // relations:
                variantGroups : item.product.variantGroups.map(({variants}) => variants),
            } : null,
        })),
        shippingProvider : (
            (shippingAddressData && shippingProviderData)
            ? getMatchingShipping(shippingProviderData, { city: shippingAddressData.city, zone: shippingAddressData.zone, country: shippingAddressData.country })
            : null
        ),
        customerOrGuest : (
            !!customer
            ? (() => {
                const {customerPreference: preference, ...customerData} = customer;
                return {
                    ...customerData,
                    preference,
                };
            })()
            : (
                !!guest
                ? (() => {
                    const {guestPreference: preference, ...guestData} = guest;
                    return {
                        ...guestData,
                        preference,
                    };
                })()
                : null
            )
        ),
    } satisfies OrderAndData;
}



export interface FindPaymentByIdData {
    paymentId : string
}
export const findPaymentById = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findPaymentByIdData: FindPaymentByIdData): Promise<PaymentDetail|null> => {
    // data:
    const {
        paymentId : paymentIdRaw,
    } = findPaymentByIdData;
    const paymentId = paymentIdRaw || undefined;
    if (!paymentId) return null;
    
    
    
    const existingOrder = await prismaTransaction.order.findUnique({
        where  : {
            paymentId : paymentId,
        },
        select : {
            payment : {
                select : {
                    // data:
                    type       : true,
                    brand      : true,
                    identifier : true,
                    
                    amount     : true,
                    fee        : true,
                },
            },
        },
    });
    if (!existingOrder) return null;
    return existingOrder.payment;
}



export type CommitDraftOrder = Omit<DraftOrder,
    |'createdAt'
> & {
    items : Omit<DraftOrdersOnProducts,
        |'id'
        
        |'draftOrderId'
    >[]
}
export interface CommitDraftOrderData {
    draftOrder : CommitDraftOrder
    payment    : Payment
}
export const commitDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], commitOrderData : CommitDraftOrderData): Promise<OrderAndData> => {
    // data:
    const {
        draftOrder,
        payment,
    } = commitOrderData;
    
    
    
    const [orderAndData] = await Promise.all([
        // copy DraftOrder => (Real)Order:
        createOrder(prismaTransaction, {
            orderId                  : draftOrder.orderId,
            paymentId                : draftOrder.paymentId ?? undefined, // will be random_auto_generated if null => undefined
            items                    : draftOrder.items,
            customerId               : draftOrder.customerId,
            guestId                  : draftOrder.guestId,
            preferredCurrency        : draftOrder.preferredCurrency,
            shippingAddress          : draftOrder.shippingAddress,
            shippingCost             : draftOrder.shippingCost,
            shippingProviderId       : draftOrder.shippingProviderId,
            payment                  : payment,
            paymentConfirmationToken : null,
        }),
        
        // delete DraftOrder:
        prismaTransaction.draftOrder.delete({
            where  : {
                id : draftOrder.id,
            },
            select : {
                id : true,
            },
        }),
    ]);
    return orderAndData;
}



type RevertDraftOrder = Pick<DraftOrder,
    |'id'
    
    |'orderId'
> & {
    items : Pick<DraftOrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}
export interface RevertDraftOrderData {
    draftOrder: RevertDraftOrder
}
export const revertDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], revertDraftOrderData : RevertDraftOrderData) => {
    // data:
    const {
        draftOrder,
    } = revertDraftOrderData;
    
    
    
    await Promise.all([
        // revert Stock(s):
        ...(draftOrder.items.map(({productId, variantIds, quantity}) =>
            !productId
            ? undefined
            : prismaTransaction.stock.updateMany({
                where  : {
                    productId  : productId,
                    value      : { not      : null       },
                    variantIds : { hasEvery : variantIds },
                },
                data   : {
                    value : { increment : quantity }
                },
            })
        )),
        
        // delete DraftOrder:
        prismaTransaction.draftOrder.delete({
            where  : {
                id : draftOrder.id,
            },
            select : {
                id : true,
            },
        }),
    ]);
}

export interface RevertDraftOrderByIdData {
    orderId   ?: string|null
    paymentId ?: string|null
}
export const revertDraftOrderById = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], revertDraftOrderByIdData: RevertDraftOrderByIdData): Promise<boolean> => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
    } = revertDraftOrderByIdData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return false;
    
    
    
    const requiredSelect = {
        id                     : true,
        
        orderId                : true,
        
        items : {
            select : {
                productId      : true,
                variantIds     : true,
                
                quantity       : true,
            },
        },
    };
    const draftOrder = await prismaTransaction.draftOrder.findUnique({
        where  : {
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : requiredSelect,
    });
    if (!draftOrder) return false; // the draftOrder is not found -or- the order is already APPROVED
    
    
    
    // draftOrder CANCELED => restore the `Product` stock and delete the `draftOrder`:
    await revertDraftOrder(prismaTransaction, { draftOrder });
    return true;
}



type CancelOrder = Pick<Order,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<Payment,
        |'type'
    >
    items : Pick<OrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}
export interface CancelOrderData {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    orderSelect       ?: Prisma.OrderSelect
    cancelationReason ?: WysiwygEditorState|null
}
export const cancelOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelOrderData : CancelOrderData) => {
    // data:
    const {
        order,
        isExpired   = false,
        deleteOrder = false,
        orderSelect = {
            id : true,
        },
        cancelationReason,
    } = cancelOrderData;
    
    
    
    const [updatedOrder] = await Promise.all([
        // update/delete (Real)Order:
        deleteOrder
        ? prismaTransaction.order.delete({
            where  : {
                id : order.id,
            },
            select : orderSelect,
        })
        : prismaTransaction.order.update({
            where  : {
                id : order.id,
            },
            data   : {
                orderStatus       : (isExpired ? 'EXPIRED' : 'CANCELED'),
                cancelationReason : cancelationReason,
            },
            select : orderSelect,
        }),
        
        // revert Stock(s):
        ...(
            (
                // Restore the `Product` stocks IF:
                
                // NOT already marked 'CANCELED'|'EXPIRED':
                !['CANCELED', 'EXPIRED'].includes(order.orderStatus)
                
                &&
                
                // only manual payment is cancelable:
                (order.payment.type === 'MANUAL')
            )
            ? (order.items.map(({productId, variantIds, quantity}) =>
                !productId
                ? undefined
                : prismaTransaction.stock.updateMany({
                    where  : {
                        productId  : productId,
                        value      : { not      : null       },
                        variantIds : { hasEvery : variantIds },
                    },
                    data   : {
                        value : { increment : quantity }
                    },
                })
            ))
            : []
        ),
    ]);
    return updatedOrder;
}

export interface CancelOrderByIdData extends Omit<CancelOrderData, 'order'> {
    id        ?: string|null
    orderId   ?: string|null
    paymentId ?: string|null
}
export const cancelOrderById = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelOrderByIdData: CancelOrderByIdData) => {
    // data:
    const {
        id        : idRaw,
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
        ...restCancelOrderData
    } = cancelOrderByIdData;
    const id        = idRaw        || undefined;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!id && !orderId && !paymentId) return false;
    
    
    
    const requiredSelect = {
        id                     : true,
        
        orderId                : true,
        
        orderStatus            : true,
        
        payment : {
            select : {
                type           : true,
            },
        },
        
        items : {
            select : {
                productId      : true,
                variantIds     : true,
                
                quantity       : true,
            },
        },
    };
    const order = await prismaTransaction.order.findUnique({
        where  : {
            id        : id,
            orderId   : orderId,
            paymentId : paymentId,
            
            // NOT already marked 'CANCELED'|'EXPIRED':
            AND : [
                { orderStatus : { not: 'CANCELED' } },
                { orderStatus : { not: 'EXPIRED'  } },
            ],
            
            // only manual payment is cancelable:
            payment : {
                is : {
                    type : 'MANUAL',
                },
            },
        },
        select : requiredSelect,
    });
    if (!order) return false; // the order is not found -or- the order is already DELETED
    
    
    
    // order CANCELED => restore the `Product` stock and (optionally) delete the `order`:
    return cancelOrder(prismaTransaction, { order, ...restCancelOrderData });
}