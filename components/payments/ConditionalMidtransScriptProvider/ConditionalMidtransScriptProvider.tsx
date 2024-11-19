'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// payment components:
import {
    type MidtransScriptOptions,
    MidtransScriptProvider,
}                           from '@/components/payments/MidtransScriptProvider'

// internals:
import {
    IsInMidtransScriptProviderContextProvider,
}                           from './states/isInMidtransScriptProvider'

// configs:
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'



const ConditionalMidtransScriptProvider = ({children}: React.PropsWithChildren) => {
    // conditions:
    const environment = process.env.NEXT_PUBLIC_MIDTRANS_ENV ?? 'sandbox';
    const clientId    = process.env.NEXT_PUBLIC_MIDTRANS_ID  ?? '';
    if (
        !checkoutConfigClient.payment.processors.midtrans.enabled
        ||
        !environment
        ||
        !clientId
    ) {
        // jsx:
        return (
            <>
                {children}
            </>
        );
    } // if
    
    
    
    // jsx:
    return (
        <ImplementedMidtransScriptProvider
            // options:
            environment={environment}
            clientId={clientId}
        >
            {children}
        </ImplementedMidtransScriptProvider>
    );
}
interface ImplementedMidtransScriptProviderProps {
    // options:
    environment : string
    clientId    : string
    
    
    
    // children:
    children    : React.ReactNode
}
const ImplementedMidtransScriptProvider = (props: ImplementedMidtransScriptProviderProps) => {
    // props:
    const {
        // options:
        environment,
        clientId,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // options:
    const midtransOptions = useMemo<MidtransScriptOptions>(() => ({
        environment : environment,
        clientId    : clientId,
    }), [environment, clientId]);
    
    
    
    // jsx:
    return (
        <MidtransScriptProvider
            options={midtransOptions}
        >
            <IsInMidtransScriptProviderContextProvider>
                {children}
            </IsInMidtransScriptProviderContextProvider>
        </MidtransScriptProvider>
    );
};
export {
    ConditionalMidtransScriptProvider,            // named export for readibility
    ConditionalMidtransScriptProvider as default, // default export to support React.lazy
};
