'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function TabInterceptLayout({
    children,
    signin_tab,
}: {
    children   : React.ReactNode
    signin_tab : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <>
            {children}
            {signin_tab}
        </>
    );
}