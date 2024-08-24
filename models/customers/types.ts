// models:
import {
    type Customer,
    type CustomerPreference,
    type Guest,
    type GuestPreference,
}                           from '@prisma/client'



// types:
export type CustomerOrGuestDetail =
    &Pick<CustomerDetail, keyof CustomerDetail & keyof GuestDetail>
    &Pick<GuestDetail   , keyof CustomerDetail & keyof GuestDetail>
export type CustomerOrGuestPreference =
    &Pick<CustomerPreference, keyof CustomerPreference & keyof GuestPreference>
    &Pick<GuestPreference   , keyof CustomerPreference & keyof GuestPreference>
export type CustomerOrGuestPreferenceDetail = Omit<CustomerOrGuestPreference,
    // records:
    |'id'
    
    // relations:
    |'parentId'
>



export interface CustomerDetail
    extends
        Omit<Customer,
            |'createdAt'
            |'updatedAt'
            
            |'emailVerified'
        >
{
    // data:
    username : string|null
}

export interface GuestDetail
    extends
        Omit<Guest,
            |'createdAt'
            |'updatedAt'
            
            |'emailVerified'
        >
{
    // data:
    username : string|null
}