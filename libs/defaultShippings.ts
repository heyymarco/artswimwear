// models:
import {
    type Prisma,
}                           from '@prisma/client'



export default [
    {
        visibility : 'PUBLISHED',
        
        name       : 'Free Shipping',
        
        weightStep : 1,
        eta        : undefined,
        rates      : [
            { start: 0, rate: 0 },
        ],
        
        useZones   : false,
        zones      : [],
    },
] satisfies Prisma.ShippingProviderUpdateInput[];