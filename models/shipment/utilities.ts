// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const shipmentDetailSelect = {
    carrier            : true,
    number             : true,
    logs               : {
        select : {
            reportedAt : true,
            log        : true,
        },
    },
    
    // relations:
    parent : {
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
} satisfies Prisma.ShipmentSelect;
