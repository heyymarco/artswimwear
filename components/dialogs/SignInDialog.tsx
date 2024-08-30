'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardBody,
    CardFooter,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface SignInDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<boolean> = ModalExpandedChangeEvent<boolean>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
    // accessibilities:
    title ?: string
}
const SignInDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<boolean> = ModalExpandedChangeEvent<boolean>>(props: SignInDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // accessibilities:
        title = 'Sign In',
        
        
        
        // other props:
        ...restSignInDialogProps
    } = props;
    
    
    
    // handlers:
    const handleCloseDialog        = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : undefined,
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'regular',
        modalCardStyle = 'scrollable',
    } = restSignInDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restSignInDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader>
                {!!title && <h1>{title}</h1>}
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody>
                <p>
                    Test hello world
                </p>
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    SignInDialog,
    SignInDialog as default,
}
