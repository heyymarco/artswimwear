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



export interface SetupPaymentRequest {
    provider                 : PaymentMethodProvider
    billingAddress          ?: BillingAddressDetail|null
}



export interface PaymentMethodSetupOptions {
    providerCustomerId      ?: string
    billingAddress          ?: BillingAddressDetail|null
}
export interface PaymentMethodSetupDetail {
    providerCustomerId       : string
    setupToken               : string
}
export interface PaymentMethodCaptureDetail {
    providerCustomerId       : string
    providerPaymentMethodId  : string
}
