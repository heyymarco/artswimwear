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

// internals:
import {
    useNotifyWishlistAddedDialogStyleSheets,
}                           from './styles/loader'



// react components:
export interface NotifyWishlistAddedDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
}
const NotifyWishlistAddedDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>(props: NotifyWishlistAddedDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // other props:
        ...restNotifyWishlistAddedDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheets = useNotifyWishlistAddedDialogStyleSheets();
    
    
    
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
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restNotifyWishlistAddedDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restNotifyWishlistAddedDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader className={styleSheets.cardHeader}>
                <h1>Saved to Wishlist!</h1>
                <ButtonIcon icon='menu' theme='success' buttonStyle='link'>View Wishlist</ButtonIcon>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheets.cardBody}>
                <p>
                    Also save to Collections? <span className='txt-sec'>(optional)</span>
                </p>
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='done' theme='primary' onClick={handleCloseDialog}>Close</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    NotifyWishlistAddedDialog,            // named export for readibility
    NotifyWishlistAddedDialog as default, // default export to support React.lazy
}
