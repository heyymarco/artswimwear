'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component



// react components:
export interface PrefetchProps {
    // refs:
    subjectRef : React.RefObject<HTMLDivElement|null>
    
    
    
    // handlers:
    onPrefetch : EventHandler<void>
}
const Prefetch = (props: PrefetchProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        subjectRef,
        
        
        
        // data:
        onPrefetch,
    } = props;
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const articleElm = subjectRef.current;
        if (!articleElm) return;
        
        
        
        // setups:
        const observer = new IntersectionObserver((entries) => {
            // conditions:
            if (!entries[0]?.isIntersecting) return;
            
            
            
            // actions:
            observer.disconnect(); // the observer is no longer needed anymore
            onPrefetch();
        }, {
            root      : null, // defaults to the browser viewport
            threshold : 0.5,
        });
        observer.observe(articleElm);
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [onPrefetch]);
    
    
    
    // jsx:
    return null;
};
export {
    Prefetch,
    Prefetch as default,
}



export interface ImplementedPrefetchProps
    extends
        // bases
        Omit<PrefetchProps,
            // handlers:
            |'onPrefetch'
        >
{
}
