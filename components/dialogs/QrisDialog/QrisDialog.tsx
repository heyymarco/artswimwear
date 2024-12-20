'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
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
    CountDown,
}                           from './CountDown'
import {
    type BaseRedirectDialogProps,
}                           from '@/components/Checkout/components/payments/ViewPaymentMethodRedirect/types'

// internals:
import {
    useQrisDialogStyleSheet,
}                           from './styles/loader'

// models:
import type {
    PaymentDetail,
}                           from '@/models'

// others:
import {
    default as QrCode,
}                           from 'qrcode'



// react components:
export interface QrisDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<PaymentDetail|false|0> = ModalExpandedChangeEvent<PaymentDetail|false|0>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >,
        BaseRedirectDialogProps<TElement, TModalExpandedChangeEvent>
{
}
const QrisDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<PaymentDetail|false|0> = ModalExpandedChangeEvent<PaymentDetail|false|0>>(props: QrisDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // data:
        placeOrderDetail,
        
        
        
        // accessibilities:
        appName,
        
        
        
        // other props:
        ...restQrisDialogProps
    } = props;
    const qrisData    = placeOrderDetail.redirectData;
    const paymentId   = placeOrderDetail.orderId;
    const expires     = placeOrderDetail.expires;
    
    
    
    // styles:
    const styleSheet = useQrisDialogStyleSheet();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        FullyLoaded,
    }
    const [isLoaded           , setIsLoaded             ] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    const [isEventSourceLoaded, setIsEventSourceLoaded  ] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    
    const [generation         , setGeneration           ] = useState<number>(1);
    
    
    // handlers:
    const handleLoaded             = useEvent((): void => {
        // conditions:
        if (isLoaded === LoadedState.FullyLoaded) return; // already loaded => ignore
        
        
        
        setIsLoaded(LoadedState.FullyLoaded);
    });
    const handleErrored            = useEvent((): void => {
        // conditions:
        if (isLoaded === LoadedState.FullyLoaded) return; // already loaded => no error possible
        
        
        
        // actions:
        setIsLoaded(LoadedState.Errored);
    });
    
    
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
        setIsLoaded(LoadedState.Loading);
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
    const handleTimeOut            = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : 0,
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    useEffect(() => {
        // conditions:
        if (isLoaded !== LoadedState.Loading) return; // only interested on loading state
        
        
        
        // setups:
        const cancelTimeout = setTimeout(() => {
            handleErrored();
        }, 10 * 1000); // if not loaded|errored within 10 seconds => assumes as errored
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelTimeout);
        };
    }, [isLoaded]);
    
    
    
    // data:
    const [svgString, setSvgString] = useState<React.ReactNode>(null);
    useIsomorphicLayoutEffect(() => {
        QrCode.toString(qrisData, (error, str) => {
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            if (error) {
                handleErrored();
                return;
            } // if
            
            
            
            setSvgString(str);
            handleLoaded();
        });
    }, [qrisData, generation]);
    
    
    
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
            
            props.onExpandedChange?.({
                expanded   : false,
                actionType : 'ui',
                data       : false,
            } as TModalExpandedChangeEvent);
        });
        eventSource.addEventListener('paid', ({data}) => {
            eventSource.close(); // close the connection
            
            props.onExpandedChange?.({
                expanded   : false,
                actionType : 'ui',
                data       : JSON.parse(data) as PaymentDetail,
            } as TModalExpandedChangeEvent);
        });
        
        
        
        // cleanups:
        return () => {
            eventSource.close(); // close the connection
        };
    }, [generation]);
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restQrisDialogProps;
    
    
    
    // jsx:
    const isErrored = (isLoaded === LoadedState.Errored) || (isEventSourceLoaded === LoadedState.Errored);
    const isLoading = !isErrored &&               ((isLoaded === LoadedState.Loading    ) || (isEventSourceLoaded === LoadedState.Loading    ));
    const isReady   = !isErrored && !isLoading && ((isLoaded === LoadedState.FullyLoaded) && (isEventSourceLoaded === LoadedState.FullyLoaded));
    return (
        <ModalCard
            // other props:
            {...restQrisDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader>
                <h1>Pay With {appName}</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.cardBody}>
                {isReady && <>
                    {!!expires && <CountDown
                        // classes:
                        className={styleSheet.countDown}
                        
                        
                        
                        // resources:
                        expires={expires}
                        
                        
                        
                        // handlers:
                        onTimeOut={handleTimeOut}
                    />}
                    <div
                        // classes:
                        className={styleSheet.qris}
                        
                        
                        
                        // children:
                        dangerouslySetInnerHTML={{
                            __html: svgString ?? '',
                        }}
                    />
                </>}
                
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
    QrisDialog,
    QrisDialog as default,
}
