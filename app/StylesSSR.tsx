// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useId,
    useRef,
}                           from 'react'

// nextJS:
import {
    // hooks:
    useServerInsertedHTML,
}                           from 'next/navigation'

// cssfn:
import {
    // react components:
    Styles,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// react components:
export const StylesSSR = (): JSX.Element|null => {
    // identifiers:
    const id = useId();
    
    
    
    // renders:
    const isStyleInjected = useRef<boolean>(false); // workaround for <React.StrictMode> causing re-render twice
    useServerInsertedHTML(() => {
        // conditions:
        if (isStyleInjected.current) return null;
        isStyleInjected.current = true;
        
        
        
        // jsx:
        return <Styles key={id} />
    });
    
    
    
    // jsx:
    return null;
}
