'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
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
    useIframeDialogStyleSheet,
}                           from './styles/loader'



// react components:
export interface IframeDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<undefined> = ModalExpandedChangeEvent<undefined>>
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
    src    : string
}
const IframeDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<undefined> = ModalExpandedChangeEvent<undefined>>(props: IframeDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // accessibilities:
        title,
        
        
        
        // resources:
        src,
        
        
        
        // other props:
        ...restIframeDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useIframeDialogStyleSheet();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        PartialLoaded,
        FullyLoaded,
    }
    const [isLoaded , setIsLoaded ] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    const [iframeKey, setIframeKey] = useState<number>(1);
    
    
    
    // refs:
    const iframeRef = useRef<HTMLIFrameElement|null>(null);
    
    
    
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
        setIframeKey((current) => (current + 1));
        // iframeRef.current?.reset?.();
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
    
    useEffect(() => {
        // conditions:
        if (isLoaded !== LoadedState.PartialLoaded) return; // only interested on partial loaded state
        const iframeElm = iframeRef.current;
        if (!iframeElm) return;
        
        
        
        // setups:
        const observer = new ResizeObserver((entries) => {
            // conditions:
            const entry = entries[0];
            if (!entry.borderBoxSize[0].blockSize) return;
            
            
            
            // actions:
            setIsLoaded(LoadedState.FullyLoaded);
        });
        observer.observe(iframeElm, { box: 'border-box' });
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [isLoaded]);
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restIframeDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restIframeDialogProps}
            
            
            
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
                <iframe
                    // identifiers:
                    key={iframeKey}
                    
                    
                    
                    // refs:
                    ref={iframeRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.iframe}
                    
                    
                    
                    // resources:
                    title={title}
                    src={src}
                    
                    
                    
                    // handlers:
                    onLoad={handleLoaded}
                    onError={handleErrored}
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
    IframeDialog,
    IframeDialog as default,
}
