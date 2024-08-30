// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
export default function SignInLayout({
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