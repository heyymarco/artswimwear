'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    Checkout,
}                           from '@/components/Checkout'

// // configs:
// import {
//     PAGE_PRODUCT_TITLE,
//     PAGE_PRODUCT_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// react components:
export default function CheckoutPage(): JSX.Element|null {
    // jsx:
    return (
        <Main nude={true}>
            <Checkout />
        </Main>
    );
}



// export const metadata : Metadata = {
//     title       : PAGE_PRODUCT_TITLE,
//     description : PAGE_PRODUCT_DESCRIPTION,
// };
