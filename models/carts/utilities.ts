// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const cartDetailSelect = {
    currency : true,
    items    : {
        select : {
            quantity   : true,
            productId  : true,
            variantIds : true,
        },
    },
    checkout : {
        select : {
            checkoutStep       : true,
            shippingAddress    : {
                select : {
                    country    : true,
                    state      : true,
                    city       : true,
                    zip        : true,
                    address    : true,
                    
                    firstName  : true,
                    lastName   : true,
                    phone      : true,
                },
            },
            shippingProviderId : true,
            billingAsShipping  : true,
            billingAddress     : {
                select : {
                    country    : true,
                    state      : true,
                    city       : true,
                    zip        : true,
                    address    : true,
                    
                    firstName  : true,
                    lastName   : true,
                    phone      : true,
                },
            },
            paymentOption      : true,
        },
    },
} satisfies Prisma.CartSelect;