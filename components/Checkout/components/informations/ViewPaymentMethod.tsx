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
        paymentBrand,
        paymentIdentifier,
    } = useCheckoutState();
    const payment = useMemo((): Pick<PaymentDetail, 'brand'>|null => {
        if (!paymentBrand) return null;
        return {
            brand: paymentBrand,
        } satisfies Pick<PaymentDetail, 'brand'>;
    }, [paymentBrand]);
    
    
    
    // jsx:
    return (
        <>
            <PaymentMethodBrand model={payment} />
            
            {!!paymentIdentifier && <span
                // classes:
                className='paymentIdentifier txt-sec'
            >
                ({paymentIdentifier})
            </span>}
        </>
    );
};
export {
    ViewPaymentMethod,
    ViewPaymentMethod as default,
};
