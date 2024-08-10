// models:
import {
    type Prisma,
}                           from '@prisma/client'



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
                    preference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
            guest : {
                select : {
                    preference : {
                        select : {
                            timezone : true,
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.ShippingTrackingSelect;
