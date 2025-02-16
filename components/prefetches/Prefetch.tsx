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
    subjectRef      ?: React.RefObject<Element|null>|null
    
    
    
    // behaviors:
    prefetchOnView  ?: boolean
    prefetchOnHover ?: boolean
    
    
    
    // handlers:
    onPrefetch       : EventHandler<void>
}
const Prefetch = (props: PrefetchProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        subjectRef      = null,
        
        
        
        // behaviors:
        prefetchOnView  = true,
        prefetchOnHover = false,
    } = props;
    
    
    
    // jsx:
    if (!subjectRef) return <PrefetchConditionalOnAlways {...props} />;
    
    return (
        <>
            {prefetchOnView  && <PrefetchConditionalOnView  {...props} subjectRef={subjectRef} />}
            {prefetchOnHover && <PrefetchConditionalOnHover {...props} subjectRef={subjectRef} />}
        </>
    );
};
export {
    Prefetch,
    Prefetch as default,
}



interface PrefetchConditionalOnAlwaysProps
    extends
        // bases:
        Omit<PrefetchProps,
            // refs:
            |'subjectRef'
            
            // behaviors:
            |'prefetchOnView'
            |'prefetchOnHover'
        >
{
}
const PrefetchConditionalOnAlways = (props: PrefetchConditionalOnAlwaysProps): JSX.Element|null => {
    // props:
    const {
        // data:
        onPrefetch,
    } = props;
    
    
    
    // effects:
    useEffect(() => {
        onPrefetch();
    }, []);
    
    
    
    // props:
    return null;
};



interface PrefetchConditionalOnViewProps
    extends
        // bases:
        Omit<PrefetchProps,
            // refs:
            |'subjectRef'
            
            // behaviors:
            |'prefetchOnView'
            |'prefetchOnHover'
        >
{
    subjectRef : Exclude<PrefetchProps['subjectRef'], null|undefined>
}
const PrefetchConditionalOnView = (props: PrefetchConditionalOnViewProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        subjectRef,
        
        
        
        // data:
        onPrefetch,
    } = props;
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        const subjectElm = subjectRef.current;
        if (!subjectElm) return;
        
        
        
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
        observer.observe(subjectElm);
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [onPrefetch]);
    
    
    
    // jsx:
    return null;
};



interface PrefetchConditionalOnHoverProps
    extends
        // bases:
        Omit<PrefetchProps,
            // refs:
            |'subjectRef'
            
            // behaviors:
            |'prefetchOnView'
            |'prefetchOnHover'
        >
{
    subjectRef : Exclude<PrefetchProps['subjectRef'], null|undefined>
}
const PrefetchConditionalOnHover = (props: PrefetchConditionalOnHoverProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        subjectRef,
        
        
        
        // data:
        onPrefetch,
    } = props;
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        const subjectElm = subjectRef.current;
        if (!subjectElm) return;
        
        
        // handlers:
        const handleHover = () => {
            onPrefetch();
        };
        
        
        
        // setups:
        subjectElm.addEventListener('mouseover', handleHover, { once: true });
        
        
        
        // cleanups:
        return () => {
            subjectElm.removeEventListener('mouseover', handleHover);
        };
    }, [onPrefetch]);
    
    
    
    // jsx:
    return null;
};



export interface ImplementedPrefetchProps
    extends
        // bases
        Omit<PrefetchProps,
            // handlers:
            |'onPrefetch'
        >
{
}
