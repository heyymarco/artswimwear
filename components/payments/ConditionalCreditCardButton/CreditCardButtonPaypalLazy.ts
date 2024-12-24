'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react lazies:
export const CreditCardButtonPaypalLazy = React.lazy(() => import(/* webpackPrefetch: true */ './CreditCardButtonPaypal'));
