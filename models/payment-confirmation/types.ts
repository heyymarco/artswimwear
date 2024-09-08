// models:
import {
    type PaymentConfirmation,
}                           from '@prisma/client'



export interface PaymentConfirmationRequest
    extends
        Partial<PaymentConfirmationDetail>
{
    token : string
}
export interface PaymentConfirmationDetail
    extends
        Pick<PaymentConfirmation,
            |'reportedAt'
            |'reviewedAt'
            
            |'amount'
            |'payerName'
            |'paymentDate'
            
            |'originatingBank'
            |'destinationBank'
            
            |'rejectionReason'
        >
{
    preferredTimezone : number
    currency          : string
}