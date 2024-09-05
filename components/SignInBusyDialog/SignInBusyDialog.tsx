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

// styles:
import {
    useSignInBusyDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // layout-components:
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface SignInBusyDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children' // already taken over
        >
{
}
const SignInBusyDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>(props: SignInBusyDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // styles:
    const styleSheet = useSignInBusyDialogStyleSheet();
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    const isExpanded = (sessionStatus === 'loading');
    
    
    
    // default props:
    const {
        // variants:
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
        
        
        
        // states:
        expanded       = isExpanded,
        
        
        
        // other props:
        ...restModalCardProps
    } = props;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            backdropStyle  = {backdropStyle }
            modalCardStyle = {modalCardStyle}
            
            
            
            // states:
            expanded={expanded}
        >
            <CardBody>
                <p className={styleSheet.loadingMessage}>
                    <Busy theme='primary' size='lg' /> Loading...
                </p>
            </CardBody>
        </ModalCard>
    );
};
export {
    SignInBusyDialog,            // named export for readibility
    SignInBusyDialog as default, // default export to support React.lazy
}
