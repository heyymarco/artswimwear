'use client'

// react:
import {
    // hooks:
    useState,
    useMemo,
}                           from 'react'

// internals:
import {
    type DialogInterceptState,
}                           from './context'



// hooks:
export const useDialogInterceptStateProvider = () => {
    // states:
    const [isDialogShown, setIsDialogShown] = useState<boolean>(false);
    
    
    
    // states:
    const dialogInterceptState = useMemo<DialogInterceptState>(() => ({
        // states:
        isDialogShown,
        setIsDialogShown,
    }), [
        isDialogShown,
        // setIsDialogShown,        // stable ref
    ]);
    
    
    
    // api:
    return dialogInterceptState;
};
