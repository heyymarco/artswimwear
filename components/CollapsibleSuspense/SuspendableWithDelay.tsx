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
    type ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// types:
import {
    type CollapsibleSuspendableProps,
}                           from './types'



// types:
const enum VisibilityState {
    COLLAPSED     = 0,
    // COLLAPSING = 1, // no need render transition of collapsing
    EXPANDING     = 1,
    EXPANDED      = 2,
}



// react components:
/**
 * A component that manages the visibility state of a given `suspendableComponent` with a delay.
 * It handles transitions between `COLLAPSED`, `EXPANDING`, and `EXPANDED` states.
 *
 * @template TExpandedChangeEvent - The type of the expanded change event.
 * @param {SuspendableWithDelayProps<TExpandedChangeEvent>} props - The props for the component.
 * @returns {JSX.Element|null} The rendered component or null if collapsed.
 */
export interface SuspendableWithDelayProps<TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
{
    // components:
    suspendableComponent : React.ReactElement<CollapsibleSuspendableProps<TExpandedChangeEvent>>
}

/**
 * A component that manages the visibility state of a given `suspendableComponent` with a delay.
 * It handles transitions between `COLLAPSED`, `EXPANDING`, and `EXPANDED` states.
 *
 * @template TExpandedChangeEvent - The type of the expanded change event.
 * @param {SuspendableWithDelayProps<TExpandedChangeEvent>} props - The props for the component.
 * @returns {JSX.Element|null} The rendered component or null if collapsed.
 */
const SuspendableWithDelay = <TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: SuspendableWithDelayProps): JSX.Element|null => {
    // props:
    const {
        // components:
        suspendableComponent,
    } = props;
    const isComponentExpanded = (suspendableComponent.props.expanded ?? false);
    
    
    
    // states:
    const [visibilityState, setVisibilityState] = useState<VisibilityState>(isComponentExpanded ? VisibilityState.EXPANDING : VisibilityState.COLLAPSED);
    
    
    
    // handlers:
    const handleCollapseEndInternal = useEvent(() => {
        setVisibilityState(VisibilityState.COLLAPSED);
    });
    const handleCollapseEnd         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `suspendableComponent`:
        suspendableComponent.props.onCollapseEnd,
        
        
        
        // actions:
        handleCollapseEndInternal,
    );
    
    
    
    // effects:
    
    // handle render transition from [COLLAPSED => EXPANDING]:
    useEffect(() => {
        // conditions:
        if (!isComponentExpanded) return; // ignores if not expanded
        
        
        
        // actions:
        setVisibilityState(VisibilityState.EXPANDING);
    }, [isComponentExpanded]);
    
    // handle render transition from [EXPANDING => delay => EXPANDED]:
    useEffect(() => {
        // conditions:
        if (visibilityState !== VisibilityState.EXPANDING) return; // ignores states other than `EXPANDING`
        
        
        
        // setups:
        const asyncDelayedTransition = setTimeout(() => { // a brief moment before rendering `EXPANDED` state, so the expanding animation runs
            setVisibilityState(VisibilityState.EXPANDED);
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(asyncDelayedTransition);
        };
    }, [visibilityState]);
    
    
    
    // jsx:
    if (visibilityState === VisibilityState.COLLAPSED) return null; // causing to discard (lost) the <CollapsibleComponent>'s states
    return React.cloneElement<CollapsibleSuspendableProps<TExpandedChangeEvent>>(suspendableComponent,
        // props:
        {
            // states:
            expanded      : (visibilityState === VisibilityState.EXPANDING) ? false /* render as collapsed first, then rerender as expanded */ : isComponentExpanded,
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
    );
};
export {
    SuspendableWithDelay,            // named export for readibility
    SuspendableWithDelay as default, // default export to support React.lazy
}
