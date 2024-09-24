// models:
import {
    type CheckoutStep,
    type PaymentDetail,
}                           from '@/models'
import {
    type AuthorizedFundData,
    type LimitedStockItem,
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
export const calculateCheckoutProgress = (checkoutStep: CheckoutStep): number => {
    return (['INFO', 'SHIPPING', 'PAYMENT', 'PENDING', 'PAID'] satisfies CheckoutStep[]).findIndex((progress) => progress === checkoutStep);
}



export class OutOfStockError extends Error {
    limitedStockItems : LimitedStockItem[];
    constructor(limitedStockItems : LimitedStockItem[]) {
        super('out of stock');
        this.limitedStockItems = limitedStockItems;
    }
}
