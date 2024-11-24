'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardBody,
    CardFooter,
    
    
    
    // status-components:
    Busy,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ErrorBlankSection,
}                           from '@/components/BlankSection'
import {
    type BaseRedirectDialogProps,
}                           from '@/components/Checkout/components/payments/ViewPaymentMethodRedirect/types'

// internals:
import {
    useRedirectDialogStyleSheet,
}                           from './styles/loader'

// models:
import type {
    PaymentDetail,
}                           from '@/models'



// react components:
export interface RedirectDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<PaymentDetail|false|0> = ModalExpandedChangeEvent<PaymentDetail|false|0>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >,
        BaseRedirectDialogProps<TElement, TModalExpandedChangeEvent>
{
}
const RedirectDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<PaymentDetail|false|0> = ModalExpandedChangeEvent<PaymentDetail|false|0>>(props: RedirectDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // data:
        placeOrderDetail,
        
        
        
        // accessibilities:
        appName,
        
        
        
        // other props:
        ...restRedirectDialogProps
    } = props;
    const redirectUrl = placeOrderDetail.redirectData;
    const paymentId   = placeOrderDetail.orderId;
    
    
    
    // styles:
    const styleSheet = useRedirectDialogStyleSheet();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        FullyLoaded,
    }
    const [isEventSourceLoaded, setIsEventSourceLoaded  ] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    
    const [generation         , setGeneration           ] = useState<number>(1);
    
    const isErrored = (isEventSourceLoaded === LoadedState.Errored);
    const isLoading = !isErrored &&               ((isEventSourceLoaded === LoadedState.Loading    ));
    const isReady   = !isErrored && !isLoading && ((isEventSourceLoaded === LoadedState.FullyLoaded));
    
    
    // handlers:
    const handleEventSourceLoaded  = useEvent((): void => {
        // conditions:
        if (isEventSourceLoaded === LoadedState.FullyLoaded) return; // already loaded => ignore
        
        
        
        setIsEventSourceLoaded(LoadedState.FullyLoaded);
    });
    const handleEventSourceErrored = useEvent((): void => {
        // conditions:
        if (isEventSourceLoaded === LoadedState.FullyLoaded) return; // already loaded => no error possible
        
        
        
        // actions:
        setIsEventSourceLoaded(LoadedState.Errored);
    });
    
    const handleReload             = useEvent((): void => {
        setGeneration((current) => (current + 1));
    });
    
    const handleCloseDialog        = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : undefined,
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const eventSource = new EventSource(`/api/checkout/status?paymentId=${encodeURIComponent(paymentId)}`, {});
        
        
        
        // handlers:
        
        // system events:
        eventSource.addEventListener('open' , handleEventSourceLoaded);
        eventSource.addEventListener('error', handleEventSourceErrored);
        
        // custom events:
        eventSource.addEventListener('ready', handleEventSourceLoaded); // server said: i'm ready
        eventSource.addEventListener('canceled', () => { // payment canceled or expired or failed
            eventSource.close(); // close the connection
            
            if (openedRedirectWindowRef.current) { // close the opened new redirect window (if any)
                openedRedirectWindowRef.current?.close();
                openedRedirectWindowRef.current = null;
            } // if
            
            props.onExpandedChange?.({
                expanded   : false,
                actionType : 'ui',
                data       : false,
            } as TModalExpandedChangeEvent);
        });
        eventSource.addEventListener('paid', ({data}) => {
            eventSource.close(); // close the connection
            
            if (openedRedirectWindowRef.current) { // close the opened new redirect window (if any)
                openedRedirectWindowRef.current?.close();
                openedRedirectWindowRef.current = null;
            } // if
            
            props.onExpandedChange?.({
                expanded   : false,
                actionType : 'ui',
                data       : JSON.parse(data) as PaymentDetail,
            } as TModalExpandedChangeEvent);
        });
        
        
        
        // cleanups:
        return () => {
            eventSource.close(); // close the connection
            
            if (openedRedirectWindowRef.current) { // close the opened new redirect window (if any)
                openedRedirectWindowRef.current?.close();
                openedRedirectWindowRef.current = null;
            } // if
        };
    }, [generation]);
    
    const openedRedirectWindowRef = useRef<Window|null|undefined>(undefined);
    useEffect(() => {
        // conditions:
        if (!isReady) return;
        if (openedRedirectWindowRef.current !== undefined) return; // already been redirected (regradless of succeed of failed)
        
        
        
        // actions:
        // first attempt: open in new window (may cause popup blocker):
        const openedRedirectWindow = window.open(redirectUrl, '_blank');
        openedRedirectWindowRef.current = openedRedirectWindow;
        
        // second attempt: open in current window (and clear browsing history):
        if (!openedRedirectWindow) window.location.replace(redirectUrl);
        
        
        
        // watchdog for new window closed:
        let cancelTimeout : ReturnType<typeof setTimeout>|undefined = undefined;
        if (openedRedirectWindow) {
            const checkIfClosed = () => {
                // conditions:
                const openedRedirectWindowLive = openedRedirectWindowRef.current;
                if (!openedRedirectWindowLive) return; // already closed by another event => ignore
                
                
                
                // tests:
                if (openedRedirectWindowLive.closed) {
                    handleCloseDialog();
                    return;
                } // if
                
                
                
                // re-schedule:
                cancelTimeout = setTimeout(checkIfClosed, 1000);
            }
            checkIfClosed();
        } // if
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelTimeout);
        } // if
    }, [redirectUrl, isReady]);
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restRedirectDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restRedirectDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader>
                <h1>Redirecting to {appName}</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.cardBody}>
                {isReady && <div className={styleSheet.redirect}>
                    <p>
                        You are being redirected to:<br />
                        <ButtonIcon
                            // appearances:
                            icon='link'
                            
                            
                            
                            // variants:
                            buttonStyle='link'
                            
                            
                            
                            // handlers:
                            href={redirectUrl}
                            target='_blank'
                        >
                            {appName}
                        </ButtonIcon><br />
                        <small>
                            Click the link above if you are not automatically redirected within 5 seconds.
                        </small>
                    </p>
                    <p>
                        <strong>We are waiting for you to complete the payment...</strong><br />
                        When you have completed the payment, this window will automatically close.
                    </p>
                    <Icon icon='timer' size='xl' />
                </div>}
                
                {isErrored && <ErrorBlankSection className={styleSheet.error} onRetry={handleReload} />}
                
                <Busy
                    // classes:
                    className={styleSheet.loading}
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    
                    
                    
                    // states:
                    expanded={isLoading}
                />
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    RedirectDialog,
    RedirectDialog as default,
}
