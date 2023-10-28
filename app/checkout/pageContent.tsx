'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    Checkout,
}                           from '@/components/Checkout'



// react components:
export function CheckoutPageContent(): JSX.Element|null {
    // jsx:
    return (
        <Main nude={true}>
            <Checkout />
        </Main>
    );
}
