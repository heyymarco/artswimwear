'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// next-js:
import {
    // navigations:
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
// reusable-ui components:
import {
    // base-components:
    type GenericProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    type LinkProps,
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'



export interface UninterceptedLinkProps
    extends
        Omit<LinkProps,
            // routes:
            |'href'
        >
{
    // routes:
    href              : string // the name must be exact 'href' in order to be recognized by `@reusable-ui/client-sides :: isNextLink()`
    uninterceptedHref : string
}
const UninterceptedLink = React.forwardRef<HTMLAnchorElement, UninterceptedLinkProps>((props, ref) => {
    // props:
    const {
        // routes:
        href,
        uninterceptedHref,
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restLinkProps
    } = props;
    const child = React.Children.only(children);
    const prefetchKind : PrefetchKind|null = (() => {
        switch (props.prefetch ?? null) {
            case null : return PrefetchKind.AUTO;      // if the page is dynamic, prefetch the page data partially, if static prefetch the page data fully.
            case true : return PrefetchKind.FULL;      // prefetch the page data fully.
            case false: return PrefetchKind.TEMPORARY; // a temporary prefetch entry is added to the cache, this is used when prefetch={false} is used in next/link or when you push a route programmatically.
        }
    })();
    
    
    
    // refs:
    const refInternal    = useRef<Element|null>(null);
    const mergedChildRef = useMergeRefs<Element>(
        // preserves the original `outerRef` from `child`:
        !React.isValidElement<Pick<GenericProps<Element>, 'outerRef'>>(child) ? null : child.props.outerRef,
        
        
        
        // preserves the original `ref` from `props`:
        ref,
        
        
        
        refInternal,
    );
    
    
    
    // navigations:
    const router = useRouter();
    
    
    
    // handlers:
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLAnchorElement>>((event) => {
        router[props.replace ? 'replace' : 'push'](uninterceptedHref);
        event.preventDefault(); // handled
    });
    const childHandleClick    = useMergeEvents(
        // preserves the original `onClick` from `child`:
        !React.isValidElement<Pick<React.HTMLAttributes<Element>, 'onClick'>>(child) ? null : child.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    
    
    // jsx:
    return (
        <>
            <Link
                // other props:
                {...restLinkProps}
                
                
                
                // routes:
                href={href}
            >
                {React.isValidElement<Pick<React.HTMLAttributes<Element>, 'onClick'> & Pick<GenericProps<Element>, 'outerRef'>>(child)
                    ? React.cloneElement<Pick<React.HTMLAttributes<Element>, 'onClick'> & Pick<GenericProps<Element>, 'outerRef'>>(child,
                        // props:
                        {
                            // other props:
                            ...child.props,
                            
                            
                            
                            // refs:
                            outerRef : mergedChildRef,   // pass the mergedChildRef   here instead of on <Link ref={...}>     in order to the ref     to be set    correctly
                            
                            
                            
                            // handlers:
                            onClick  : childHandleClick, // pass the childHandleClick here instead of on <Link onClick={...}> in order to the handler to be called correctly
                        },
                    )
                    : child
                }
            </Link>
            
            {/* PREFETCH for displaying intercepted PAGE: */}
            <PrefetchRouter
                // refs:
                subjectRef={refInternal}
                
                
                
                // routes:
                href={href}
                prefetchKind={prefetchKind}
            />
            
            {/* PREFETCH for displaying unintercepted PAGE: */}
            <PrefetchRouter
                // refs:
                subjectRef={refInternal}
                
                
                
                // routes:
                href={uninterceptedHref}
                prefetchKind={prefetchKind}
            />
        </>
    );
});
UninterceptedLink.displayName = 'UninterceptedLink';
export {
    UninterceptedLink,
    UninterceptedLink as default,
}
