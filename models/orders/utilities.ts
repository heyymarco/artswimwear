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
            currency : {
                select : {
                    currency : true,
                    rate     : true,
                },
            },
            
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
            currency : {
                select : {
                    currency : true,
                    rate     : true,
                },
            },
            
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
    
    currency          : {
        select : {
            currency  : true,
            rate      : true,
        },
    },
    
    shippingAddress   : true,
    shippingCost      : true,
    
    payment           : {
        select : {
            // data:
            type           : true,
            brand          : true,
            identifier     : true,
            expiresAt      : true,
            
            amount         : true,
            fee            : true,
            
            billingAddress : true,
        },
    },
    
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
    },
} satisfies Prisma.OrderSelect;
export const convertOrderDataToOrderAndData = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], orderData: Awaited<ReturnType<typeof prisma.order.findFirstOrThrow<{ select: typeof orderAndDataSelect }>>>): Promise<OrderAndData> => {
    const {
        customer,
        guest,
        ...restOrderData
    } = orderData;
    const shippingProviderData = restOrderData.shippingProvider;
    const shippingAddressData  = restOrderData.shippingAddress;
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
            (shippingProviderData && shippingAddressData)
            ? await getMatchingShipping(prismaTransaction, shippingProviderData, shippingAddressData)
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
    
    currency               : {
        select : {
            currency       : true,
            rate           : true,
        },
    },
    
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
    
    payment                : {
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