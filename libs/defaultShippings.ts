// models:
import {
    type Prisma,
}                           from '@prisma/client'



export default [
    {
        visibility      : 'PUBLISHED',
        
        name            : 'Free Shipping',
        estimate        : undefined,
        
        weightStep      : 1,
        shippingRates   : [
            { startingWeight: 0, rate: 0 }
        ],
        
        useSpecificArea : false,
        countries       : [],
    },
] satisfies Prisma.ShippingProviderUpdateInput[];