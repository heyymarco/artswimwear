// models:
import {
    type Prisma,
}                           from '@prisma/client'



const timezoneSelect = {
    select : {
        preference : {
            select : {
                timezone : true,
            },
        },
    },
} satisfies (Prisma.Order$guestArgs & Prisma.Order$customerArgs);

export const shipmentDetailSelect = {
    // data:
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
            guest    : timezoneSelect,
            customer : timezoneSelect,
        },
    },
} satisfies Prisma.ShipmentSelect;
