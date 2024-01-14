'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    // react components:
    SessionProviderProps,
    SessionProvider,
}                           from 'next-auth/react'



// react components:
export interface NextAuthSessionProviderProps
    extends
        // bases:
        SessionProviderProps
{
}
const NextAuthSessionProvider = (props: NextAuthSessionProviderProps): JSX.Element|null => {
    // jsx:
    return (
        <SessionProvider>
            {props.children}
        </SessionProvider>
    )
};
export {
    NextAuthSessionProvider,
    NextAuthSessionProvider as default,
}