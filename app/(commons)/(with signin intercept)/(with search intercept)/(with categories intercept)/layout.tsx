'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function DialogInterceptLayout({
    children,
    category_dropdown,
}: {
    children          : React.ReactNode
    category_dropdown : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <>
            {children}
            {category_dropdown}
        </>
    );
}
