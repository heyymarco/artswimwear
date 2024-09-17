// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useSetTimeout,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    CloseButton,
    
    
    
    // layout-components:
    type CardProps,
    Card,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // dialog-components:
    type ModalExpandedChangeEvent,
    type ModalSideProps,
    ModalSide,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// styles:
import {
    useNotifyDialogStyleSheet,
}                           from './styles/loader'



// react components:
export interface NotifyDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<'ok'|'timedOut'> = ModalExpandedChangeEvent<'ok'|'timedOut'>>
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
    // behaviors:
    timeout ?: number
}
const NotifyDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<'ok'|'timedOut'> = ModalExpandedChangeEvent<'ok'|'timedOut'>>(props: NotifyDialogProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // behaviors:
        timeout = 3000,
        
        
        
        // other props:
        ...restNotifyDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useNotifyDialogStyleSheet();
    
    
    
    // refs:
    const buttonRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (timeout <= 0) return; // no timeout => ignore
        if (!props.onExpandedChange) return; // no close callback => ignore
        
        
        
        // setups:
        const timerPromise = setTimeoutAsync(timeout)
        timerPromise.then((isDone) => {
            // conditions:
            if (!isDone) return; // the component was unloaded before the timer runs => do nothing
            
            
            
            // actions:
            props.onExpandedChange?.({
                expanded   : false,
                actionType : 'ui',
                data       : 'timedOut',
            } as TModalExpandedChangeEvent);
        });
        
        
        
        // cleanups:
        return () => {
            timerPromise.abort();
        };
    }, [timeout, props.onExpandedChange]);
    
    
    
    // handlers:
    const handleCloseDialog = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
        event.preventDefault(); // handled
        
        
        
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : 'ok',
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'warning',
        modalSideStyle = 'blockStart',
        backdropStyle  = 'hidden',
        
        
        
        // auto focusable:
        autoFocusOn    = buttonRef,
        
        
        
        // components:
        cardComponent  = (<Card<Element> className={styleSheet.card} /> as React.ReactElement<CardProps<Element>>),
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restModalSideProps
    } = restNotifyDialogProps;
    
    
    
    // jsx:
    return (
        <ModalSide<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalSideProps}
            
            
            
            // variants:
            theme={theme}
            modalSideStyle={modalSideStyle}
            backdropStyle={backdropStyle}
            
            
            
            // auto focusable:
            autoFocusOn={autoFocusOn}
            
            
            
            // components:
            cardComponent={cardComponent}
        >
            <Alert
                // variants:
                theme={theme}
                
                
                
                // classes:
                className='body'
                
                
                
                // states:
                expanded={true}
                
                
                
                // components:
                controlComponent={
                    <CloseButton elmRef={buttonRef} className='action' onClick={handleCloseDialog} />
                }
            >
                {children}
            </Alert>
        </ModalSide>
    );
};
export {
    NotifyDialog,            // named export for readibility
    NotifyDialog as default, // default export to support React.lazy
}
