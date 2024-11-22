// models:
import {
    type PaymentType,
    type PaymentMethod,
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
                
                
                
                // data:
                // |'name'
            >
        >
{
}
