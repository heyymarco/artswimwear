// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const shippingPreviewSelect = {
    id            : true,
    
    name          : true,
} satisfies Prisma.ShippingProviderSelect;



export const shippingDetailSelect = {
    id            : true,
    
    visibility    : true,
    
    name          : true,
    
    weightStep    : true,
    eta           : true,
    shippingRates : true,
    
    useZones      : true,
    zones         : true,
} satisfies Prisma.ShippingProviderSelect;