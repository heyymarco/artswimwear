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

// models:
import {
    paymentMethodLimitMax,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodPage,
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
        data    : paymentMethodPagination,
    } = useGetPaymentMethodPage({
        page    : 0, // show the first page (zero_based index)
        perPage : paymentMethodLimitMax, // show all items at one page
    });
    const paymentMethods = paymentMethodPagination?.entities;
    
    
    
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
