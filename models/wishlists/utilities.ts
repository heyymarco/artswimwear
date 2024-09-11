// models:
import {
    type Prisma,
}                           from '@prisma/client'



export const wishlistGroupDetailSelect = {
    // records:
    id        : true,
    
    
    
    // relations:
    name      : true,
} satisfies Prisma.WishlistGroupSelect;



export const wishlistDetailSelect = {
    // relations:
    productId : true,
} satisfies Prisma.WishlistSelect;
