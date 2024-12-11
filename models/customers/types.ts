// models:
import {
    type Customer,
    type CustomerPreference,
    type Guest,
    type GuestPreference,
}                           from '@prisma/client'



// types:
/**
 * The minimum data exposed of customer|guest.
 */
export type CustomerOrGuestMinimumData =
    |CustomerMinimumData
    |GuestMinimumData

/**
 * The minimum data exposed of customer.
 */
export interface CustomerMinimumData
    extends
        Pick<Customer,
            // data:
            |'name'
            |'email'
        >
{
    preference : CustomerPreferenceDetail|null
}

/**
 * The minimum data exposed of guest.
 */
export interface GuestMinimumData
    extends
        Pick<Guest,
            // data:
            |'name'
            |'email'
        >
{
    preference : GuestPreferenceDetail|null
}



/**
 * The minimum data required for connecting to existing customer.
 */
export interface CustomerConnectData
    extends
        Pick<Customer,
            // identifiers:
            |'id'
        >,
        Pick<CustomerMinimumData,
            |'preference'
        >
{
}

/**
 * The minimum data required for creating a new guest.
 */
export interface GuestCreateData
    extends
        GuestMinimumData
{
}



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



export interface CustomerDetail
    extends
        Omit<Customer,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'paypalCustomerId'
            |'stripeCustomerId'
            |'midtransCustomerId'
            
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



export interface CustomerPreferenceData
    extends
        // no need for id, use id stored in session
        // // the id is mandatory:
        // Pick<CustomerPreference,
        //     // records:
        //     |'id'
        // >,
        
        // other than id & parentId are optional:
        Partial<Omit<CustomerPreference,
            // records:
            |'id'
            
            
            
            // relations:
            |'parentId'
        >>
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
