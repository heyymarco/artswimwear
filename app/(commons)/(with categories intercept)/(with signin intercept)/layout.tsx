'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function CheckoutLayout({
    children,
    signin_dialog,
}: {
    children      : React.ReactNode
    signin_dialog : React.ReactNode
}): JSX.Element|null {
    // jsx:
    return (
        <>
            {children}
            {signin_dialog}
        </>
    );
}
