// models:
import {
    type Prisma,
}                           from '@prisma/client'



export default [
    {
        visibility      : 'PUBLISHED',
        
        name            : 'Free Shipping',
        
        weightStep      : 1,
        estimate        : undefined,
        shippingRates   : [
            { startingWeight: 0, rate: 0 }
        ],
        
        useSpecificArea : false,
        countries       : [],
    },
] satisfies Prisma.ShippingProviderUpdateInput[];