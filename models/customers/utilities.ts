// models:
import {
    type CustomerPreferenceDetail,
}                           from './types'
import {
    type Prisma,
}                           from '@prisma/client'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> }
export const defaultCustomerPreferenceDetail : NoUndefinedField<Omit<CustomerPreferenceDetail, 'id'>> = {
    // data:
    marketingOpt : true,
    timezone     : checkoutConfigShared.intl.defaultTimezone,
}



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



export const customerPreferenceDetailSelect = {
    // data:
    marketingOpt : true,
    timezone     : true,
} satisfies Prisma.CustomerPreferenceSelect;
