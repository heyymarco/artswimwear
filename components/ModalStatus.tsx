// react:
import {
    // react:
    default as React,
}                           from 'react'

import {
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components
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
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalProps}
            
            
            
            // states:
            expanded={props.expanded ?? hasChildren}
            
            
            
            // handlers:
            onFullyCollapsed={clearChildren}
        >
            {lastExistingChildren}
        </ModalCard>
    );
}
export {
    ModalStatus,
    ModalStatus as default,
}
