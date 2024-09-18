// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const wishGroupDetailSelect = {
    // records:
    id        : true,
    
    
    
    // relations:
    name      : true,
} satisfies Prisma.WishGroupSelect;



export const wishDetailSelect = {
    // relations:
    productId : true,
} satisfies Prisma.WishSelect;
