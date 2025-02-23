'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    CheckoutStateProvider,
}                           from '@/components/Checkout'



// react components:
export default function CheckoutLayout({
    children,
}: {
    children      : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <CheckoutStateProvider>
            {children}
        </CheckoutStateProvider>
    );
}
