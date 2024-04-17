// models:
import type {
    AuthorizedFundData,
    PaidFundData,
}                           from './types'



export const isAuthorizedFundData = (data: AuthorizedFundData|PaidFundData|string|undefined): data is AuthorizedFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        !('paymentAmount' in data)
    );
}
export const isPaidFundData      = (data: AuthorizedFundData|PaidFundData|string|undefined): data is PaidFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        ('paymentAmount' in data)
    );
}