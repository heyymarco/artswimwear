'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react lazies:
export const CreditCardButtonStripeLazy = React.lazy(() => import(/* webpackPrefetch: true */ './CreditCardButtonStripe'));
