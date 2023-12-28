'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    CollapsibleSuspendableProps,
}                           from './types'



// types:
const enum VisibilityState {
    CollapseEnd   = 0,
    // CollapseStart = 1, // no need render transition of collapsing
    ExpandStart   = 1,
    ExpandEnd     = 2,
}



// react components:
export interface SuspendableWithSuspenseProps<TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
    extends
        // bases:
        CollapsibleSuspendableProps<TExpandedChangeEvent>
{
    // components:
    suspendableComponent : React.ReactComponentElement<any, CollapsibleSuspendableProps<TExpandedChangeEvent>>
}
const SuspendableWithSuspense = <TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: SuspendableWithSuspenseProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        suspendableComponent,
    ...restSuspendableProps} = props;
    const isComponentExpanded = !!(props.expanded ?? suspendableComponent.props.expanded ?? false);
    
    
    
    // states:
    const [visibilityState, setVisibilityState] = useState<VisibilityState>(isComponentExpanded ? VisibilityState.ExpandEnd : VisibilityState.CollapseEnd);
    
    
    
    // handlers:
    const handleCollapseEndInternal = useEvent(() => {
        setVisibilityState(VisibilityState.CollapseEnd);
    });
    const handleCollapseEnd         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `suspendableComponent`:
        suspendableComponent.props.onCollapseEnd,
        
        
        
        // preserves the original `onCollapseEnd` from `props`:
        props.onCollapseEnd,
        
        
        
        // actions:
        handleCollapseEndInternal,
    );
    
    
    
    // dom effects:
    
    // handle initiate to render the <Collapsible>:
    useEffect(() => {
        // conditions:
        if (!isComponentExpanded) return; // ignores if not expanded
        
        
        
        // actions:
        setVisibilityState(VisibilityState.ExpandStart);
    }, [isComponentExpanded]);
    
    // handle render transition from [ExpandStart => delay => ExpandEnd]:
    useEffect(() => {
        // conditions:
        if (visibilityState !== VisibilityState.ExpandStart) return; // ignores states other than `ExpandStart`
        
        
        
        // setups:
        const asyncDelayedTransition = setTimeout(() => { // a brief moment for rendering `collapsed state`
            setVisibilityState(VisibilityState.ExpandEnd);
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(asyncDelayedTransition);
        };
    }, [visibilityState]);
    
    
    
    // jsx:
    if (visibilityState === VisibilityState.CollapseEnd) return null; // causing to discard (lost) the <CollapsibleComponent>'s states
    return React.cloneElement<CollapsibleSuspendableProps<TExpandedChangeEvent>>(suspendableComponent,
        // props:
        {
            // other props:
            ...restSuspendableProps,
            ...suspendableComponent.props, // overwrites restSuspendableProps (if any conflics)
            
            
            
            // states:
            expanded      : (visibilityState === VisibilityState.ExpandStart) ? false /* render as collapsed first, then next re-render render as expanded */ : isComponentExpanded,
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
    );
};
export {
    SuspendableWithSuspense,
    SuspendableWithSuspense as default,
}
