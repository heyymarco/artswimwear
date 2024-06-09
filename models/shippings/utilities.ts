// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const shippingPreviewSelect = {
    id              : true,
    
    name            : true,
} satisfies Prisma.ShippingProviderSelect;



export const shippingDetailSelect = {
    id              : true,
    
    visibility      : true,
    
    name            : true,
    estimate        : true,
    
    weightStep      : true,
    shippingRates   : true,
    
    useSpecificArea : true,
    countries       : true,
} satisfies Prisma.ShippingProviderSelect;