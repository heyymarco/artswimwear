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
    id         : true,
    
    visibility : true,
    
    autoUpdate : true,
    
    name       : true,
    
    weightStep : true,
    eta        : true,
    rates      : true,
    
    useZones   : true,
    zones      : {
        select : {
            // data:
            name      : true,
            
            eta       : true,
            rates     : true,
            
            useZones  : true,
            zones     : {
                select : {
                    // data:
                    name      : true,
                    
                    eta       : true,
                    rates     : true,
                    
                    useZones  : true,
                    zones     : {
                        select : {
                            // records:
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