// models:
import {
    type Prisma,
}                           from '@prisma/client'



// utilities:
export const customerDetailselect = {
    id          : true,
    
    name        : true,
    email       : true,
    image       : true,
    
    credentials : {
        select : {
            username : true,
        },
    },
} satisfies Prisma.CustomerSelect;
