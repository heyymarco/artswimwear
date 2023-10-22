// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a base component
import type {
    // react components:
    BadgeProps,
}                           from '@reusable-ui/badge'           // represents counters or labels



export interface CompoundWithBadgeProps<TElement extends Element = HTMLElement>
{
    // components:
    wrapperComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
    badgeComponent    : React.ReactComponentElement<any, BadgeProps<Element>>|null
    elementComponent  : React.ReactComponentElement<any, GenericProps<Element>>
}
const CompoundWithBadge = <TElement extends Element = HTMLElement>(props: CompoundWithBadgeProps<TElement>) => {
    // rest props:
    const {
        // components:
        wrapperComponent = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        badgeComponent,
        elementComponent,
    ...restGenericProps} = props;
    
    
    
    // refs:
    const componentRefInternal = useRef<Element|null>(null);
    const mergedComponentRef   = useMergeRefs(
        // preserves the original `elmRef` from `elementComponent`:
        elementComponent.props.elmRef,
        
        
        
        componentRefInternal,
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<TElement>>(wrapperComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...wrapperComponent.props, // overwrites restGenericProps (if any conflics)
        },
        
        
        
        // children:
        /* <Component> */
        React.cloneElement<GenericProps<Element>>(elementComponent,
            // props:
            {
                // refs:
                elmRef : mergedComponentRef,
            },
        ),
        
        /* <Badge> */
        (!!badgeComponent && React.cloneElement<BadgeProps<Element>>(badgeComponent,
            // props:
            {
                floatingOn : badgeComponent.props.floatingOn ?? componentRefInternal,
            },
        )),
    );
};
export {
    CompoundWithBadge,
    CompoundWithBadge as default,
}
