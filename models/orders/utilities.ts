// models:
import {
    type Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'

// utilities:
import {
    getMatchingShipping,
}                           from '@/libs/shippings'

// templates:
import type {
    // types:
    OrderAndData,
}                           from '@/components/Checkout/templates/orderDataContext'



export const paymentConfirmationDetailSelect = {
    reportedAt      : true,
    reviewedAt      : true,
    
    amount          : true,
    payerName       : true,
    paymentDate     : true,
    
    originatingBank : true,
    destinationBank : true,
    
    rejectionReason : true,
    
    // relations:
    order : {
        select : {
            preferredCurrency : true,
            
            customer : {
                select : {
                    customerPreference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
            guest : {
                select : {
                    guestPreference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.PaymentConfirmationSelect;



export const shippingTrackingDetailSelect = {
    shippingCarrier      : true,
    shippingNumber       : true,
    shippingTrackingLogs : {
        select : {
            reportedAt : true,
            log        : true,
        },
    },
    
    // relations:
    order : {
        select : {
            preferredCurrency : true,
            
            customer : {
                select : {
                    customerPreference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
            guest : {
                select : {
                    guestPreference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.ShippingTrackingSelect;



export const orderAndDataSelect = {
    // records:
    id                : true,
    createdAt         : true,
    updatedAt         : true,
    
    // data:
    orderId           : true,
    paymentId         : true,
    
    orderStatus       : true,
    orderTrouble      : true,
    cancelationReason : true,
    
    preferredCurrency : true,
    
    shippingAddress   : true,
    shippingCost      : true,
    
    payment           : true,
    
    // relations:
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
    
    customerId         : true,
    customer           : {
        select : {
            name  : true,
            email : true,
            customerPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    guestId            : true,
    guest              : {
        select : {
            name  : true,
            email : true,
            guestPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    shippingProviderId : true,
    shippingProvider   : {
        select : {
            name          : true, // optional for displaying email report
            
            weightStep    : true, // required for calculating `getMatchingShipping()`
            estimate      : true, // optional for displaying email report
            shippingRates : true, // required for calculating `getMatchingShipping()`
            
            useZones      : true, // required for calculating `getMatchingShipping()`
            zones         : true, // required for calculating `getMatchingShipping()`
        },
    },
} satisfies Prisma.OrderSelect;
export const convertOrderDataToOrderAndData = (orderData: Awaited<ReturnType<typeof prisma.order.findFirstOrThrow<{ select: typeof orderAndDataSelect }>>>): OrderAndData => {
    const {
        customer,
        guest,
        ...restOrderData
    } = orderData;
    const shippingAddressData  = restOrderData.shippingAddress;
    const shippingProviderData = restOrderData.shippingProvider;
    return {
        ...restOrderData,
        items: restOrderData.items.map((item) => ({
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
};



export const commitDraftOrderSelect = {
    // records:
    id                     : true,
    expiresAt              : true,
    
    // data:
    orderId                : true,
    paymentId              : true,
    
    preferredCurrency      : true,
    
    shippingAddress        : true,
    shippingCost           : true,
    shippingProviderId     : true,
    
    // relations:
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
            // data:
            price          : true,
            shippingWeight : true,
            quantity       : true,
            
            // relations:
            productId      : true,
            variantIds     : true,
        },
    },
} satisfies Prisma.DraftOrderSelect;



export const revertDraftOrderSelect = {
    // records:
    id                     : true,
    
    // data:
    orderId                : true,
    
    items : {
        select : {
            // data:
            quantity       : true,
            
            // relations:
            productId      : true,
            variantIds     : true,
        },
    },
} satisfies Prisma.DraftOrderSelect;



export const cancelOrderSelect = {
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
} satisfies Prisma.OrderSelect;



export const commitOrderSelect = {
    // records:
    id : true,
} satisfies Prisma.OrderSelect;