// models:
import {
    type Customer,
    type CustomerPreference,
    type Guest,
    type GuestPreference,
}                           from '@prisma/client'



// types:
export type CustomerOrGuestPreview =
    &Pick<CustomerPreview, keyof CustomerPreview & keyof GuestPreview>
    &Pick<GuestPreview   , keyof CustomerPreview & keyof GuestPreview>

export interface CustomerPreview
    extends
        Pick<Customer,
            // data:
            |'name'
            |'email'
        >
{
}

export interface GuestPreview
    extends
        Pick<Guest,
            // data:
            |'name'
            |'email'
        >
{
}



export type CustomerOrGuestDetail =
    &Pick<CustomerDetail, keyof CustomerDetail & keyof GuestDetail>
    &Pick<GuestDetail   , keyof CustomerDetail & keyof GuestDetail>

export interface CustomerDetail
    extends
        Omit<Customer,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'emailVerified'
        >
{
    // data:
    username : string|null
}

export interface GuestDetail
    extends
        Omit<Guest,
            // records:
            |'createdAt'
            |'updatedAt'
        >
{
}



export type CustomerOrGuestPreferenceDetail =
    &Pick<CustomerPreferenceDetail, keyof CustomerPreferenceDetail & keyof GuestPreferenceDetail>
    &Pick<GuestPreferenceDetail   , keyof CustomerPreferenceDetail & keyof GuestPreferenceDetail>

export interface CustomerPreferenceDetail
    extends
        Omit<CustomerPreference,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}

export interface GuestPreferenceDetail
    extends
        Omit<GuestPreference,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}
