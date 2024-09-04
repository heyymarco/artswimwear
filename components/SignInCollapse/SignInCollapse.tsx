'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // a capability of UI to expand/reduce its size or toggle the visibility:
    type ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    CollapseProps,
    Collapse,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export type SignInCollapseOptions =
    |'expand'
    |'collapse'

export interface SignInCollapseProps<TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
    extends
        // bases:
        CollapseProps<TElement, TExpandedChangeEvent>
{
    // states:
    whenSignedIn ?: SignInCollapseOptions
    whenLoading  ?: SignInCollapseOptions
}
const SignInCollapse = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: SignInCollapseProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // states:
        whenSignedIn = 'expand',
        whenLoading  = 'collapse',
        
        
        
        // other props:
        ...restSignInCollapseProps
    } = props;
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    const isExpanded = (
        (sessionStatus === 'authenticated')
        ?     (whenSignedIn === 'expand')         // when status: signedIn  => expanded
        : (
            (sessionStatus === 'unauthenticated')
            ? (whenSignedIn !== 'expand')         // when status: signedOut => collapsed
            : (whenLoading  !== 'expand')         // when status: loading   => collapsed
        )
    );
    
    
    
    // default props:
    const {
        // states:
        expanded = isExpanded,
        
        
        
        // other props:
        ...restContentProps
    } = restSignInCollapseProps;
    
    
    
    // jsx:
    return (
        <Collapse<TElement, TExpandedChangeEvent>
            // other props:
            {...restContentProps}
            
            
            
            // states:
            expanded={isExpanded}
        />
    );
};
export {
    SignInCollapse,            // named export for readibility
    SignInCollapse as default, // default export to support React.lazy
}
