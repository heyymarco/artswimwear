'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
}                           from 'react'



// types:
export interface MidtransScriptOptions {
    environment : 'production'|'sandbox'|(string & {})
    clientId    : string
}



// react components:
export interface MidtransScriptProviderProps
    extends
        React.PropsWithChildren<{}>
{
    // options:
    options : MidtransScriptOptions
}
const MidtransScriptProvider = (props: MidtransScriptProviderProps) => {
    // props:
    const {
        // options:
        options : {
            environment,
            clientId,
        },
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // effects:
    const scriptAppliedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (scriptAppliedRef.current) return; // already applied => ignore;
        scriptAppliedRef.current = true;
        if (!!document.getElementById('midtrans-script')) return; // already applied => ignore;
        
        
        
        // setups:
        // <script id="midtrans-script" src="https://api.midtrans.com/v2/assets/js/midtrans-new-3ds.min.js" data-environment="<production|sandbox>" data-client-key="<INSERT CLIENT KEY HERE>" type="text/javascript"></script>
        const newScriptElm = document.createElement('script');
        newScriptElm.setAttribute('type', 'text/javascript');
        newScriptElm.setAttribute('id'  , 'midtrans-script');
        newScriptElm.setAttribute('src' , 'https://api.midtrans.com/v2/assets/js/midtrans-new-3ds.min.js');
        newScriptElm.dataset.environment = environment;
        newScriptElm.dataset.clientKey   = clientId;
        
        const headElm = document.head;
        headElm.appendChild(newScriptElm); // add side effect
        
        
        
        // no need a cleanup:
        // // cleanups:
        // return () => {
        //     newScriptElm.parentElement?.removeChild?.(newScriptElm); // remove side effect
        // };
    }, []);
    
    
    
    // jsx:
    return (
        <>
            {children}
        </>
    );
};
export {
    MidtransScriptProvider,            // named export for readibility
    MidtransScriptProvider as default, // default export to support React.lazy
};
