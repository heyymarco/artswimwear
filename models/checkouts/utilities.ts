// models:
import {
    type PaymentDetail,
}                           from '@/models'
import {
    type AuthorizedFundData,
}                           from './types'



export const isAuthorizedFundData = (data: AuthorizedFundData|PaymentDetail|boolean|null|undefined): data is AuthorizedFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        !('amount' in data)
    );
}
export const isPaymentDetail      = (data: AuthorizedFundData|PaymentDetail|boolean|null|undefined): data is PaymentDetail => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        ('amount' in data)
    );
}