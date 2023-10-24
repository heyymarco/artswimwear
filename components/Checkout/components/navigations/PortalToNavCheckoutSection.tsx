'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useState,
}                           from 'react'
import {
    default as ReactDOM,
}                           from 'react-dom'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface PortalToNavCheckoutSectionProps {
    children : React.ReactNode
}
const PortalToNavCheckoutSection = (props: PortalToNavCheckoutSectionProps): JSX.Element|null => {
    // states:
    const {
        // sections:
        navCheckoutSectionElm,
    } = useCheckoutState();
    
    
    
    // dom effects:
    // delays the rendering of portal until the page is fully hydrated
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    
    
    
    // jsx:
    if (!isHydrated) return null;
    if (!navCheckoutSectionElm?.current) return (
        <>
            {props.children}
        </>
    );
    return ReactDOM.createPortal(
        props.children,
        navCheckoutSectionElm.current
    );
};
export {
    PortalToNavCheckoutSection,
    PortalToNavCheckoutSection as default,
};
