'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cart components:
import {
    useCartState,
}                           from '@/components/Cart/states/cartState'

// stores:
import {
    // hooks:
    useGetPaymentMethodOfCurreny,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ConditionalCreditCardSavedSectionProps {
}
const ConditionalCreditCardSavedSection = (props: React.PropsWithChildren<ConditionalCreditCardSavedSectionProps>): JSX.Element|null => {
    // sessions:
    const { data: session } = useSession();
    
    
    
    // jsx:
    if (!session) return null;
    return (
        <ImplementedConditionalCreditCardSavedSection {...props} />
    );
};
const ImplementedConditionalCreditCardSavedSection = (props: React.PropsWithChildren<ConditionalCreditCardSavedSectionProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
    } = useCartState();
    const {
        data    : compatiblePaymentMethods,
    } = useGetPaymentMethodOfCurreny({
        currency,
    });
    const paymentMethods = compatiblePaymentMethods;
    
    
    
    // jsx:
    if (!paymentMethods?.length) return null;
    return (
        <>
            {children}
        </>
    );
};
export {
    ConditionalCreditCardSavedSection,
    ConditionalCreditCardSavedSection as default,
};
