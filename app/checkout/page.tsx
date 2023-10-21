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
    CheckoutPageContent,
}                           from './pageContent'



// react components:
export default function CheckoutPage(): JSX.Element|null {
    // jsx:
    return (
        <CheckoutPageContent />
    );
}



export const metadata : Metadata = {
    title       : 'Checkout',
    description : 'Checkout',
};
