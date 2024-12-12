// models:
import {
    type Prisma,
}                           from '@prisma/client'
import {
    type CustomerConnectData,
    type GuestCreateData,
    type CustomerPreferenceDetail,
}                           from './types'

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



export const isCustomerConnectData = (customerOrGuest  : Omit<CustomerConnectData, 'preference'>|Omit<GuestCreateData, 'preference'>): customerOrGuest is Omit<CustomerConnectData, 'preference'> => {
    // CustomerConnectData // 'id'              |'preference'
    // GuestCreateData     //     'name'|'email'|'preference'
    return !('email' in customerOrGuest);
};
