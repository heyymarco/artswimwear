// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const shippingPreviewSelect = {
    // records:
    id         : true,
    
    // data:
    name       : true,
} satisfies Prisma.ShippingProviderSelect;



export const shippingDetailSelect = {
    // records:
    id         : true,
    
    // data:
    visibility : true,
    
    autoUpdate : true,
    origin     : true,
    
    name       : true,
    
    weightStep : true,
    eta        : true,
    rates      : true,
    
    // relations:
    useZones   : true,
    zones      : {
        select : {
            // records:
            id        : true,
            
            // data:
            name      : true,
            
            eta       : true,
            rates     : true,
            
            useZones  : true,
            zones     : {
                select : {
                    // records:
                    id        : true,
                    
                    // data:
                    name      : true,
                    
                    eta       : true,
                    rates     : true,
                    
                    useZones  : true,
                    zones     : {
                        select : {
                            // records:
                            id        : true,
                            updatedAt : false,
                            
                            // data:
                            name      : true,
                            
                            eta       : true,
                            rates     : true,
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.ShippingProviderSelect;