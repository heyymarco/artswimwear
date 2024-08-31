// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    SigninTabStateProvider,
}                           from '@/components/SignIn'



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
        <SigninTabStateProvider>
            {children}
            {signin_dialog}
        </SigninTabStateProvider>
    );
}