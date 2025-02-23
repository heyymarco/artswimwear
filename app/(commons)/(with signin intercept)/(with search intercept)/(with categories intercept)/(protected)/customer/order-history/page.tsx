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
    OrderHistoryPageContent,
}                           from './page-content'

// configs:
import {
    PAGE_ORDER_HISTORY_TITLE,
    PAGE_ORDER_HISTORY_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_ORDER_HISTORY_TITLE,
    description : PAGE_ORDER_HISTORY_DESCRIPTION,
}



// react components:
export default function OrderHistoryPage(): JSX.Element|null {
    // jsx:
    return (
        <OrderHistoryPageContent />
    );
}
