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
    
    provider                : true,
    providerPaymentMethodId : true,
} satisfies Prisma.PaymentMethodSelect;
export const convertPaymentMethodDetailDataToPaymentMethodDetail = (paymentMethodDetailData: Awaited<ReturnType<typeof prisma.paymentMethod.findFirstOrThrow<{ select: typeof paymentMethodDetailSelect }>>>, resolver: Map<string, Pick<PaymentMethodDetail, 'type'|'brand'|'identifier'|'expiresAt'|'billingAddress'>>): PaymentMethodDetail|null => {
    const {
        provider,                // take
        providerPaymentMethodId, // take
    ...restPaymentMethodDetail} = paymentMethodDetailData;
    
    
    
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
    };
};
