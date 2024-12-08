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
            |'setupToken'
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
        >
{
    provider                 : PaymentMethodProvider
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
    providerCustomerId      ?: string
}
export interface PaymentMethodSetup {
    providerCustomerId       : string
    setupToken               : string
    redirectData            ?: string
}
export interface PaymentMethodCapture {
    providerCustomerId       : string
    providerPaymentMethodId  : string
}



export interface PaymentMethodSortRequest {
    ids                      : string[]
}
export interface PaymentMethodSortDetail {
    ids                      : string[]
}
