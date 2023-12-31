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
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// google recaptcha components:
import {
    default as ReCAPTCHAComponent,
    ReCAPTCHA,
}                           from 'react-google-recaptcha'

// internal components:
import {
    ErrorBlankSection,
}                           from '@/components/BlankSection'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'



// react components:
export interface CaptchaDialogProps<TValue extends any, TModel extends {}, TEdit extends string>
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement, ModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
}
export type ImplementedCaptchaDialogProps<TValue extends any, TModel extends {}, TEdit extends string> = Omit<CaptchaDialogProps<TValue, TModel, TEdit>,
    // data:
    |'initialValue'
    
    
    
    // handlers:
    |'onUpdate'
>
const CaptchaDialog = <TValue extends any, TModel extends {}, TEdit extends string>(props: CaptchaDialogProps<TValue, TModel, TEdit>) => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // states:
    const enum LoadedState {
        Loading,
        Errored,
        PartialLoaded,
        FullyLoaded,
    }
    const [isLoaded    , setIsLoaded    ] = useState<LoadedState>(LoadedState.Loading); // 0: loading true: loaded, false: errored
    const [recaptchaKey, setRecaptchaKey] = useState<number>(1);
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // refs:
    const recaptchaRef = useRef<ReCAPTCHA|null>(null);
    
    
    
    // handlers:
    const handleLoaded      = useEvent((): void => {
        setIsLoaded(LoadedState.PartialLoaded);
        console.log('capcha PARTIAL LOADED', recaptchaRef.current, Date.now());
    });
    const handleErrored     = useEvent((): void => {
        // conditions:
        if (isLoaded === LoadedState.FullyLoaded) return; // already loaded => no error possible
        
        
        
        // actions:
        setIsLoaded(LoadedState.Errored);
        console.log('capcha ERRORED', Date.now());
    });
    const handleReload      = useEvent((): void => {
        setIsLoaded(LoadedState.Loading);
        setRecaptchaKey((current) => (current + 1));
        recaptchaRef.current?.reset?.();
    });
    
    const handleChange      = useEvent((token: string|null): void => {
        // conditions:
        if (!token) return;
        
        
        
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : token,
        });
    });
    
    const handleCloseDialog = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : undefined,
        });
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
        let recaptchaElm = (recaptchaRef.current as any)?.captcha as Element|undefined|null;
        if (recaptchaElm) {
            const iframe = recaptchaElm.querySelector?.('iframe[role]');
            if (iframe) {
                recaptchaElm = iframe;
            } // if
        } // if
        if (!recaptchaElm) return;
        
        
        
        // setups:
        const observer = new ResizeObserver((entries) => {
            // conditions:
            const entry = entries[0];
            if (!entry.borderBoxSize[0].blockSize) return;
            
            
            
            // actions:
            setIsLoaded(LoadedState.FullyLoaded);
            console.log('capcha FULLY LOADED', entry, Date.now());
        });
        observer.observe(recaptchaElm, { box: 'border-box' });
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [isLoaded]);
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...props}
            
            
            
            // variants:
            theme          = {props.theme          ?? 'primary'   }
            backdropStyle  = {props.backdropStyle  ?? 'static'    }
            modalCardStyle = {props.modalCardStyle ?? 'scrollable'}
        >
            <CardHeader>
                <h1>Please Prove You&apos;re Not a Robot</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.captchaDialogBody}>
                <ReCAPTCHAComponent
                    // identifiers:
                    key={recaptchaKey}
                    
                    
                    
                    // refs:
                    ref={recaptchaRef}
                    
                    
                    
                    // configs:
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_ID ?? ''}
                    
                    
                    
                    // variants:
                    theme='light'
                    size='normal'
                    
                    
                    
                    // handlers:
                    asyncScriptOnLoad={handleLoaded}
                    onErrored={handleErrored}
                    onChange={handleChange}
                />
                
                {(isLoaded === LoadedState.Errored) && <ErrorBlankSection className='error' onRetry={handleReload} />}
                
                <Busy
                    // classes:
                    className='loading'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    
                    
                    
                    // states:
                    expanded={(isLoaded === LoadedState.Loading) || (isLoaded === LoadedState.PartialLoaded)}
                />
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger'  size='sm' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    CaptchaDialog,
    CaptchaDialog as default,
}
