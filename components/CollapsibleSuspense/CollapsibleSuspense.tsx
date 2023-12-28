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

// internals:
import type {
    CollapsibleSuspendableProps,
}                           from './types'
import {
    // react components:
    SuspendableWithSuspense,
}                           from './SuspendableWithSuspense'



// react components:
export interface CollapsibleSuspenseProps {
    // components:
    children : React.ReactNode
}
const CollapsibleSuspense = (props: CollapsibleSuspenseProps): JSX.Element|null => {
    // rest props:
    const {
        // components:
        children,
    } = props;
    
    
    
    // children:
    const wrappedChildren = useMemo<React.ReactNode[]>(() =>
        flattenChildren(children)
        .map<React.ReactNode>((collapsibleSuspendable, childIndex) => {
            // conditions:
            if (!React.isValidElement<CollapsibleSuspendableProps>(collapsibleSuspendable)) return collapsibleSuspendable; // not a <CollapsibleSuspendableProps> => place it anyway
            
            
            
            // props:
            const suspendableProps = collapsibleSuspendable.props;
            
            
            
            // jsx:
            return (
                /* wrap collapsibleSuspendable with <SuspendableWithSuspense> */
                <SuspendableWithSuspense
                    // other props:
                    {...suspendableProps} // steals all collapsibleSuspendable's props, so the <Owner> can recognize the <SuspendableWithSuspense> as <TheirChild>
                    
                    
                    
                    // identifiers:
                    key={collapsibleSuspendable.key ?? childIndex}
                    
                    
                    
                    // components:
                    suspendableComponent={
                        // clone collapsibleSuspendable element with (almost) blank props:
                        <collapsibleSuspendable.type
                            // identifiers:
                            key={collapsibleSuspendable.key}
                            
                            
                            
                            //#region restore conflicting props
                            {...{
                                ...(('suspendableComponent' in suspendableProps) ? { suspendableComponent : suspendableProps.suspendableComponent } : undefined),
                            }}
                            //#endregion restore conflicting props
                        />
                    }
                />
            );
        })
    , [children]);
    
    
    
    // jsx:
    return (
        <>
            {wrappedChildren}
        </>
    )
};
export {
    CollapsibleSuspense,
    CollapsibleSuspense as default,
}
