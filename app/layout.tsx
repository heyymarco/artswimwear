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
    category_menu,
}: {
    children      : React.ReactNode
    category_menu : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <RootLayoutContent category_menu={category_menu}>
            {children}
        </RootLayoutContent>
    );
}
