// models:
import {
    type Prisma,
}                           from '@prisma/client'



export default [
    {
        visibility : 'PUBLISHED',
        
        name       : 'Free Shipping',
        
        weightStep : 1,
        eta        : undefined, // compound_like relation
        rates      : { // array_like relation
            // clear the existing item(s), if any:
            deleteMany : {},
            
            // create all item(s) with sequential order:
            create     : [
                { sort: 0, start: 0, rate: 0 },
            ],
        },
        
        useZones   : false,
    },
] satisfies Prisma.ShippingProviderUpdateInput[];