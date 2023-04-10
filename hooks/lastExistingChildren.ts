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
    useTriggerRender,
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// hooks:
export const useLastExistingChildren = (children?: React.ReactNode): readonly [boolean, React.ReactNode, React.DispatchWithoutAction] => {
    // states:
    const lastExistingChildrenRef = useRef<React.ReactNode>(undefined);
    const hasChildren = (!!children || (children === 0)) && (children !== true) && (!Array.isArray(children) || !!children.length); // ignores undefined|null|true|false|emptyString|emptyArray
    if (hasChildren) lastExistingChildrenRef.current = children;
    
    const [triggerRender] = useTriggerRender();
    
    
    
    // handlers:
    const clearChildren = useEvent<React.DispatchWithoutAction>(() => {
        // conditions:
        if (lastExistingChildrenRef.current === children) return;
        
        
        
        // force React to *forget* the children's state by setting children to `undefined|null|true|false|emptyString|emptyArray` and re-render the <parent> component:
        lastExistingChildrenRef.current = children; // the consumer component should set the children to `undefined|null|true|false|emptyString|emptyArray` in order to destroy the children's state.
        triggerRender();
    });
    
    
    
    // children:
    return [hasChildren, lastExistingChildrenRef.current, clearChildren];
}
