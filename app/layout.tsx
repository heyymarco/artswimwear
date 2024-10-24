// react:
import {
    // react:
    default as React,
}                           from 'react'

// private components:
import {
    RootLayoutContent,
}                           from './layout-content'



// react components:
export default function RootLayout({
    children,
}: {
    children : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <RootLayoutContent>
            {children}
        </RootLayoutContent>
    );
}
