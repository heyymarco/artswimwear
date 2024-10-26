'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function CommonLayout({
    children,
    category_menu,
}: {
    children      : React.ReactNode
    category_menu : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <>
            {children}
            {category_menu}
        </>
    );
}
