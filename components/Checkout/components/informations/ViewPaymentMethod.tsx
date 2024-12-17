'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// internal components:
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'
import {
    PaymentMethodIdentifier,
}                           from '@/components/payments/PaymentMethodIdentifier'

// models:
import {
    PaymentDetail,
}                           from '@/models'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ViewPaymentMethod = (): JSX.Element|null => {
    // states:
    const {
        // payment data:
        paymentType,
        paymentBrand,
        paymentIdentifier,
    } = useCheckoutState();
    const payment = useMemo((): Pick<PaymentDetail, 'type'|'brand'|'identifier'>|null => {
        if (!paymentBrand) return null;
        return {
            type       : (paymentType ?? 'CUSTOM') as PaymentDetail['type'],
            brand      : paymentBrand,
            identifier : paymentIdentifier ?? '',
        } satisfies Pick<PaymentDetail, 'type'|'brand'|'identifier'>;
    }, [paymentType, paymentBrand, paymentIdentifier]);
    
    
    
    // jsx:
    return (
        <>
            <PaymentMethodBrand model={payment} />
            <PaymentMethodIdentifier model={payment} />
        </>
    );
};
export {
    ViewPaymentMethod,
    ViewPaymentMethod as default,
};
