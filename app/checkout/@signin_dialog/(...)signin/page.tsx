'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui components:
import {
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'



// react components:
export default function SignInDialogPage(): JSX.Element|null {
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // hooks:
    const router = useRouter();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const cardDialogPromise = showDialog(
            <SignInDialog />
        );
        cardDialogPromise.then(() => {
            router.back();
        });
        
        
        
        // cleanups:
        return () => {
            cardDialogPromise.closeDialog(undefined, 'ui');
        };
    }, []);
    
    
    
    // jsx:
    return <></>;
}
