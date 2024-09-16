// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    type CardProps,
    Card,
}                           from '@reusable-ui/card'            // a flexible and extensible content container, with optional header and footer
import {
    // react components:
    type ModalExpandedChangeEvent,
    type ModalSideProps,
    ModalSide,
}                           from '@reusable-ui/modal-side'      // overlays a card dialog to the side of site's page

// styles:
import {
    useNotifyDialogStyleSheet,
}                           from './styles/loader'



// react components:
export interface NotifyDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>
    extends
        // bases:
        Omit<ModalSideProps<TElement, TModalExpandedChangeEvent>,
            // variants:
            |'modalSideStyle' // makes partial
        >,
        Partial<Pick<ModalSideProps<TElement, TModalExpandedChangeEvent>,
            // variants:
            |'modalSideStyle' // makes partial
        >>
{
}
const NotifyDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<unknown> = ModalExpandedChangeEvent<unknown>>(props: NotifyDialogProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styleSheet = useNotifyDialogStyleSheet();
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'warning',
        modalSideStyle = 'blockStart',
        backdropStyle  = 'hidden',
        
        
        
        // components:
        cardComponent  = (<Card<Element> className={styleSheet.card} /> as React.ReactElement<CardProps<Element>>),
        
        
        
        // other props:
        ...restModalSideProps
    } = props;
    
    
    
    // jsx:
    return (
        <ModalSide<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalSideProps}
            
            
            
            // variants:
            theme={theme}
            modalSideStyle={modalSideStyle}
            backdropStyle={backdropStyle}
            
            
            
            // components:
            cardComponent={cardComponent}
        />
    );
};
export {
    NotifyDialog,            // named export for readibility
    NotifyDialog as default, // default export to support React.lazy
}
