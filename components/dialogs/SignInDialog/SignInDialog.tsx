'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSignInDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
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

// internal components:
import {
    SignIn,
}                           from '@/components/SignIn'



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
    
    
    
    // styles:
    const styleSheet = useSignInDialogStyleSheet();
    
    
    
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
        horzAlign      = 'stretch',
        vertAlign      = 'stretch',
        
        
        
        // other props:
        ...restModalCardProps
    } = restSignInDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
            horzAlign      = {horzAlign}
            vertAlign      = {vertAlign}
            
            
            
            // classes:
            className={styleSheet.dialog}
        >
            <CardHeader>
                {!!title && <h1>{title}</h1>}
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.cardBody}>
                <SignIn
                    className={styleSheet.signInUi}
                    
                    
                    
                    // components:
                    gotoHomeButtonComponent={null}
                />
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
