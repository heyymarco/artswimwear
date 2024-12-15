// models:
import {
    type PaymentType,
    type PaymentMethod,
    type PaymentMethodProvider,
}                           from '@prisma/client'
import {
    type MutationArgs,
}                           from '../commons'
import {
    type BillingAddressDetail,
}                           from '../shippings'



export interface PaymentMethodSetupDetail
    extends
        Pick<PaymentMethodSetup,
            |'paymentMethodSetupToken'
            |'redirectData'
        >
{
}

export interface PaymentMethodDetail
    extends
        Pick<PaymentMethod,
            // records:
            |'id'
            
            
            
            // data:
            |'currency'
        >
{
    // data:
    type           : PaymentType
    brand          : string
    identifier     : string
    
    expiresAt      : Date|null
    
    billingAddress : BillingAddressDetail|null
    
    priority       : number
}



export interface PaymentMethodUpdateRequest
    extends
        MutationArgs<
            Pick<PaymentMethodDetail,
                // records:
                |'id'
            >
        >
{
    // data:
    vaultToken : string // required
    currency   : string // required
}



export interface PaymentMethodSetupRequest
    extends
        Omit<PaymentMethodUpdateRequest,
            // data:
            |'vaultToken'
        >,
        Pick<PaymentMethodCapture,
            |'paymentMethodProvider'
        >
{
    cardToken               ?: string
    billingAddress          ?: BillingAddressDetail|null
}



export interface PaymentMethodSetupOptions
    extends
        Pick<PaymentMethodSetupRequest,
            |'cardToken'
            |'billingAddress'
        >
{
    /**
     * If provided => save the customer's card to database.  
     * If null => create a new customer and then save the customer's card to database.  
     */
    paymentMethodProviderCustomerId  : string|null
}
export interface PaymentMethodSetup {
    paymentMethodProviderCustomerId  : string
    paymentMethodSetupToken          : string
    redirectData                    ?: string
}
export interface PaymentMethodCapture {
    paymentMethodProvider            : PaymentMethodProvider
    paymentMethodProviderId          : string
    paymentMethodProviderCustomerId  : string
}



export interface PaymentMethodSortRequest {
    ids                              : string[]
}
export interface PaymentMethodSortDetail {
    ids                              : string[]
}



export interface AffectedPaymentMethods {
    deleted : string[]
    shifted : [string, number][]
}
