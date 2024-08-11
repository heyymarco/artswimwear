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
    ShipmentPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_CHECKOUT_SHIPPING_TRACKING_TITLE,
    PAGE_CHECKOUT_SHIPPING_TRACKING_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_CHECKOUT_SHIPPING_TRACKING_TITLE,
    description : PAGE_CHECKOUT_SHIPPING_TRACKING_DESCRIPTION,
}



// react components:
export default function ShipmentPage(): JSX.Element|null {
    // jsx:
    return (
        <ShipmentPageContent />
    );
}
