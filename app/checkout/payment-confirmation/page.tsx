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
    PaymentConfirmationPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_CHECKOUT_PAYMENT_CONFIRM_TITLE,
    PAGE_CHECKOUT_PAYMENT_CONFIRM_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_CHECKOUT_PAYMENT_CONFIRM_TITLE,
    description : PAGE_CHECKOUT_PAYMENT_CONFIRM_DESCRIPTION,
}



// react components:
export default function PaymentConfirmationPage(): JSX.Element|null {
    // jsx:
    return (
        <PaymentConfirmationPageContent />
    );
}
