// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components

// hooks:
import {
    // hooks:
    useLastExistingChildren,
}                           from '@/hooks/lastExistingChildren'



export interface ModalStatusProps
    extends
        ModalCardProps
{
}
const ModalStatus = (props: ModalStatusProps): JSX.Element|null => {
    // rest props:
    const {
        // children:
        children,
    ...restModalProps} = props;
    
    
    
    const [hasChildren, lastExistingChildren, clearChildren] = useLastExistingChildren(children);
    
    
    
    // handlers:
    const handleCollapseEnd = useMergeEvents(
        // preserves the original `onCollapseEnd`:
        props.onCollapseEnd,
        
        
        
        // actions:
        clearChildren,
    );
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={props.expanded ?? hasChildren}
            
            
            
            // handlers:
            onCollapseEnd={handleCollapseEnd}
        >
            {lastExistingChildren}
        </ModalCard>
    );
}
export {
    ModalStatus,
    ModalStatus as default,
}
