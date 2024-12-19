// models:
import {
    type Prisma,
}                           from '@prisma/client'
import {
    type PaymentMethodDetail
}                           from './types'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'



export const paymentMethodDetailSelect = {
    // records:
    id                      : true,
    
    
    
    // data:
    currency                : true,
    
    type                    : true,
    
    provider                : true,
    providerPaymentMethodId : true,
    
    sort                    : true,
} satisfies Prisma.PaymentMethodSelect;
export function convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodDetailData: Awaited<ReturnType<typeof prisma.paymentMethod.findFirstOrThrow<{ select: typeof paymentMethodDetailSelect }>>>, totalRecords: number, resolver: null): PaymentMethodDetail;
export function convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodDetailData: Awaited<ReturnType<typeof prisma.paymentMethod.findFirstOrThrow<{ select: typeof paymentMethodDetailSelect }>>>, totalRecords: number, resolver: Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>): PaymentMethodDetail|null
export function convertPaymentMethodDetailDataToPaymentMethodDetail(paymentMethodDetailData: Awaited<ReturnType<typeof prisma.paymentMethod.findFirstOrThrow<{ select: typeof paymentMethodDetailSelect }>>>, totalRecords: number, resolver: Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>|null): PaymentMethodDetail|null {
    const {
        provider,                // take
        providerPaymentMethodId, // take
        sort,                    // take
    ...restPaymentMethodDetail} = paymentMethodDetailData;
    
    
    
    if (!resolver) {
        return {
            ...restPaymentMethodDetail,
            brand          : '',
            identifier     : '',
            expiresAt      : null,
            billingAddress : null,
            priority       : totalRecords - sort - 1, // zero_based priority
        } satisfies PaymentMethodDetail;
    } // if
    
    
    
    const resolved = resolver.get(`${provider}/${providerPaymentMethodId}`);
    if (!resolved) return null;
    
    
    
    const {
        type,
        brand,
        identifier,
        expiresAt,
        billingAddress,
    } = resolved;
    return {
        ...restPaymentMethodDetail,
        type,
        brand,
        identifier,
        expiresAt,
        billingAddress,
        priority : totalRecords - sort - 1, // zero_based priority
    } satisfies PaymentMethodDetail;
};
