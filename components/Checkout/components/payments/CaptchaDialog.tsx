'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
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
}                           from 'react-google-recaptcha'

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
    const [isLoaded, setIsLoaded] = useState<boolean|null>(null); // true: loaded, false: errored, null: loading
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleLoaded = useEvent((): void => {
        setIsLoaded(true);
    });
    const handleErrored = useEvent((): void => {
        setIsLoaded(false);
    });
    
    const handleChange = useEvent((token: string|null): void => {
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
                {(isLoaded === true) && <p className='pleaseWait'>Please wait...</p>}
                
                <ReCAPTCHAComponent
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
                
                <Busy
                    // classes:
                    className='loading'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    
                    
                    
                    // states:
                    expanded={isLoaded === null}
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
