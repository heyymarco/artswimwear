// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// types:
import {
    type CollapsibleSuspendableProps,
}                           from './types'

// internal components:
import {
    // react components:
    SuspendableWithDelay,
}                           from './SuspendableWithDelay'



// react components:
export interface CollapsibleSuspenseProps {
    // components:
    children ?: React.ReactNode
}
const CollapsibleSuspense = (props: CollapsibleSuspenseProps): JSX.Element|null => {
    // props:
    const {
        // components:
        children,
    } = props;
    
    
    
    // children:
    const wrappedChildren = useMemo<React.ReactNode[]>(() =>
        flattenChildren(children)
        .map<React.ReactNode>((suspendableComponent, childIndex) => {
            // conditions:
            if (!React.isValidElement<CollapsibleSuspendableProps>(suspendableComponent)) return suspendableComponent; // not a <CollapsibleSuspendableProps> => place it anyway
            
            
            
            // jsx:
            return (
                /* wrap suspendableComponent with <SuspendableWithDelay> */
                <SuspendableWithDelay
                    // identifiers:
                    key={suspendableComponent.key ?? childIndex}
                    
                    
                    
                    // components:
                    suspendableComponent={suspendableComponent}
                />
            );
        })
    , [children]);
    
    
    
    // jsx:
    return (
        <>
            {wrappedChildren}
        </>
    );
};
export {
    CollapsibleSuspense,            // named export for readibility
    CollapsibleSuspense as default, // default export to support React.lazy
}
