'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
    useMemo,
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

// internals:
import {
    useQrisDialogStyleSheet,
}                           from './styles/loader'

// others:
import {
    default as QrCode,
}                           from 'qrcode'



// react components:
export interface QrisDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<undefined> = ModalExpandedChangeEvent<undefined>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
    // accessibilities:
    title ?: string
    
    
    
    // resources:
    data   : string
}
const QrisDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<undefined> = ModalExpandedChangeEvent<undefined>>(props: QrisDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // accessibilities:
        title,
        
        
        
        // resources:
        data,
        
        
        
        // other props:
        ...restQrisDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useQrisDialogStyleSheet();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        PartialLoaded,
        FullyLoaded,
    }
    const [isLoaded, setIsLoaded] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    
    
    
    // handlers:
    const handleLoaded      = useEvent((): void => {
        setIsLoaded(LoadedState.PartialLoaded);
    });
    const handleErrored     = useEvent((): void => {
        // conditions:
        if (isLoaded === LoadedState.FullyLoaded) return; // already loaded => no error possible
        
        
        
        // actions:
        setIsLoaded(LoadedState.Errored);
    });
    const handleReload      = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
    });
    
    const handleCloseDialog = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : undefined,
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
        QrCode.toString(data, (error, str) => {
            if (error) {
                handleErrored();
                return;
            } // if
            
            
            
            setSvgString(str);
            handleLoaded();
        });
    }, [data]);
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restQrisDialogProps;
    
    
    
    // jsx:
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
                {!!title && <h1>{title}</h1>}
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.cardBody}>
                <div
                    // classes:
                    className={styleSheet.qris}
                    
                    
                    
                    // resources:
                    dangerouslySetInnerHTML={{
                        __html: svgString ?? '',
                    }}
                />
                
                {(isLoaded === LoadedState.Errored) && <ErrorBlankSection className={styleSheet.error} onRetry={handleReload} />}
                
                <Busy
                    // classes:
                    className={styleSheet.loading}
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    
                    
                    
                    // states:
                    expanded={(isLoaded === LoadedState.Loading) || (isLoaded === LoadedState.PartialLoaded)}
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
