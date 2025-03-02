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
    RootLayoutContent,
}                           from './layout-content'

// configs:
import {
    WEBSITE_FAVICON_PNG,
    WEBSITE_FAVICON_SVG,
}                           from '@/website.config'



export const metadata: Metadata = {
    icons: [
        {
            rel  : 'icon',
            type : 'image/png',
            href : WEBSITE_FAVICON_PNG,
            url  : WEBSITE_FAVICON_PNG,
        },
        {
            rel  : 'icon',
            type : 'image/svg+xml',
            href : WEBSITE_FAVICON_SVG,
            url  : WEBSITE_FAVICON_SVG,
        },
    ],
};



// react components:
export default function RootLayout({
    // children:
    header,
    footer,
    cartDialog,
    children,
}: {
    // children:
    header     : React.ReactNode
    footer     : React.ReactNode
    cartDialog : React.ReactNode
    children   : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <RootLayoutContent
            // children:
            header={header}
            footer={footer}
            cartDialog={cartDialog}
        >
            {children}
        </RootLayoutContent>
    );
}
