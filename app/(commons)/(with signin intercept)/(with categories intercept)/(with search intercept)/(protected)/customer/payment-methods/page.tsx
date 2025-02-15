// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// private components:
import {
    PaymentMethodPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_PAYMENT_METHODS_TITLE,
    PAGE_PAYMENT_METHODS_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_PAYMENT_METHODS_TITLE,
    description : PAGE_PAYMENT_METHODS_DESCRIPTION,
}



// react components:
export default function PaymentMethodPage(): JSX.Element|null {
    // jsx:
    return (
        <PaymentMethodPageContent />
    );
}
