// models:
import {
    type CheckoutStep,
    type PaymentDetail,
    type PaymentMethodCapture,
}                           from '@/models'
import {
    type AuthorizedFundData,
    type LimitedStockItem,
}                           from './types'



export const isAuthorizedFundData       = (data: AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|PaymentDetail|boolean|null|undefined): data is AuthorizedFundData => {
    return (
        !!data
        &&
        (typeof(data) === 'object')
        &&
        !Array.isArray(data)
        &&
        !('amount' in data)
    );
}
export const isPaymentDetailWithCapture = (data: AuthorizedFundData|[PaymentDetail, PaymentMethodCapture|null]|boolean|null|undefined): data is [PaymentDetail, PaymentMethodCapture|null] => {
    return (
        !!data
        &&
        Array.isArray(data)
        // &&
        // ('amount' in data?.[0])
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
