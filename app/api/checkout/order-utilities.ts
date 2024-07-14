// models:
import {
    type PaymentDetail,
    
    type CreateDraftOrderData,
    type FindDraftOrderByIdData,
    type CreateOrderData,
    type FindPaymentByIdData,
    type CommitDraftOrderData,
    type RevertDraftOrderData,
    type FindOrderByIdData,
    type CancelOrderData,
    type CommitOrderData,
    
    
    orderAndDataSelect,
    convertOrderDataToOrderAndData,
}                           from '@/models'
import type {
    Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// templates:
import type {
    // types:
    OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'



export const createDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], createDraftOrderData: CreateDraftOrderData): Promise<string> => {
    // data:
    const {
        // temporary data:
        expiresAt,
        paymentId,
        
        // primary data:
        orderId,
        items,
        currency,
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
            
            currency            : (currency === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                // one_conditional nested_update if create:
                create          : currency,
            },
            
            shippingAddress     : (shippingAddress === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                // one_conditional nested_update if create:
                create          : shippingAddress,
            },
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



export const findDraftOrderById = async <TSelect extends Prisma.DraftOrderSelect>(prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findDraftOrderByIdData: FindDraftOrderByIdData<TSelect>) => {
    // data:
    const {
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
        
        orderSelect,
    } = findDraftOrderByIdData;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!orderId && !paymentId) return null;
    
    
    
    return await prismaTransaction.draftOrder.findUnique({
        where  : {
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : orderSelect,
    });
}



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
        currency,
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        // extended data:
        payment : {
            paymentId : _paymentId, // remove
            billingAddress : billingAddressData,
            ...restPaymentData
        },
        paymentConfirmationToken,
    } = createOrderData;
    
    
    
    const orderData = await prismaTransaction.order.create({
        data   : {
            // primary data:
            
            orderId             : orderId,
            paymentId           : paymentId,
            
            items               : {
                create          : items,
            },
            
            currency            : (currency === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                // one_conditional nested_update if create:
                create          : currency,
            },
            
            shippingAddress     : (shippingAddress === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                // one_conditional nested_update if create:
                create          : shippingAddress,
            },
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
            
            payment             : { // compound_like relation
                // one_conditional nested_update if create:
                create : {
                    ...restPaymentData,
                    billingAddress : (billingAddressData === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                        // one_conditional nested_update if create:
                        create : billingAddressData,
                    },
                },
            },
            paymentConfirmation : !paymentConfirmationToken ? undefined : {
                create : {
                    token: paymentConfirmationToken,
                },
            },
        },
        select : orderAndDataSelect,
    });
    return convertOrderDataToOrderAndData(prismaTransaction, orderData);
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
            currency                 : draftOrder.currency,
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



export const revertDraftOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], revertDraftOrderData : RevertDraftOrderData): Promise<void> => {
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



export const findOrderById = async <TSelect extends Prisma.OrderSelect>(prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], findOrderByIdData: FindOrderByIdData<TSelect>) => {
    // data:
    const {
        id        : idRaw,
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
        
        orderSelect,
    } = findOrderByIdData;
    const id        = idRaw        || undefined;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!id && !orderId && !paymentId) return null;
    
    
    
    return await prismaTransaction.order.findUnique({
        where  : {
            id        : id,
            orderId   : orderId,
            paymentId : paymentId,
        },
        select : orderSelect,
    });
}



export const cancelOrder = async <TSelect extends Prisma.OrderSelect>(prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelOrderData : CancelOrderData<TSelect>) => {
    // data:
    const {
        order,
        isExpired   = false,
        deleteOrder = false,
        cancelationReason,
        
        orderSelect,
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
                (!!order.payment && order.payment.type === 'MANUAL')
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



export const commitOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], commitOrderData : CommitOrderData): Promise<OrderAndData> => {
    // data:
    const {
        order,
        payment : {
            billingAddress : billingAddressData = null,
            ...paymentData
        },
    } = commitOrderData;
    
    
    const oldData = await prismaTransaction.order.findFirst({
        where  : {
            id : order.id,
        },
        select : {
            payment : {
                select : {
                    billingAddress : {
                        select : {
                            id : true,
                        },
                    },
                },
            },
        },
    });
    const hasBillingAddress = oldData?.payment?.billingAddress?.id !== undefined;
    
    const orderData = await prismaTransaction.order.update({
        where  : {
            id : order.id,
        },
        data   : {
            payment : {
                update : {
                    type      : 'MANUAL_PAID',
                    expiresAt : null, // paid, no more payment expiry date
                    ...paymentData,
                    billingAddress : { // compound_like relation
                        // nested_delete if set to null:
                        delete : ((billingAddressData !== null) /* do NOT delete if NOT null */ || !hasBillingAddress /* do NOT delete if NOTHING to delete */) ? undefined : {
                            // do DELETE
                            // no condition needed because one to one relation
                        },
                        
                        // moved to createCityData:
                        // one_conditional nested_update if create:
                     // create : (billingAddressData === null) ? undefined /* do NOT update if null */ : billingAddressData,
                        
                        // two_conditional nested_update if update:
                        upsert : (billingAddressData === null) ? undefined /* do NOT update if null */ : {
                            update : billingAddressData, // prefer   to `update` if already exist
                            create : billingAddressData, // fallback to `create` if not     exist
                        },
                    },
                },
            },
        },
        select : orderAndDataSelect,
    });
    return convertOrderDataToOrderAndData(prismaTransaction, orderData);
}
