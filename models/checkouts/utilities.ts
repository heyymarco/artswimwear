// models:
import type {
    AuthorizeFundData,
    PaidFundData,
}                           from './types'



export const isAuthorizeFundData = (data: AuthorizeFundData|PaidFundData|string|undefined): data is AuthorizeFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        !('paymentAmount' in data)
    );
}
export const isPaidFundData      = (data: AuthorizeFundData|PaidFundData|string|undefined): data is PaidFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        ('paymentAmount' in data)
    );
}