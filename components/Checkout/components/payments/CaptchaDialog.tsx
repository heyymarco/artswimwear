'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
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
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// google recaptcha components:
import {
    default as ReCAPTCHAComponent,
    ReCAPTCHA,
}                           from 'react-google-recaptcha'

// internal components:
import type {
    EditorProps,
}                           from '@/components/editors/Editor'

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
    
    
    
    // rest props:
    const {
        // handlers:
        onExpandedChange,
    ...restModalCardProps} = props;
    
    
    
    // states:
    const [editorValue     , setEditorValue     ] = useState<string|null>(null);
    
    
    
    // refs:
    const editorRef = useRef<ReCAPTCHA|null>(null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleOK = useEvent(async () => {
        try {
            await handleFinalizing(); // result: created|mutated
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    
    const handleCloseDialog = useEvent(async () => {
        await handleFinalizing(); // result: no changes
    });
    const handleFinalizing     = useEvent(async (otherTasks : Promise<any>[] = []) => {
        await Promise.all(otherTasks);
        
        
        
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
        });
    });
    
    const handleExpandedChange : EventHandler<ModalExpandedChangeEvent> = useEvent((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme          = {props.theme          ?? 'primary'   }
            backdropStyle  = {props.backdropStyle  ?? 'static'    }
            modalCardStyle = {props.modalCardStyle ?? 'scrollable'}
            
            
            
            // auto focusable:
            // autoFocusOn={props.autoFocusOn ?? editorRef}
            
            
            
            // handlers:
            onExpandedChange = {handleExpandedChange}
        >
            <CardHeader>
                <h1>Please Prove You&apos;re Not a Robot</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.captchaDialogBody}>
                <ReCAPTCHAComponent
                    // refs:
                    ref={editorRef}
                    
                    
                    
                    // configs:
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_ID ?? ''}
                    
                    
                    
                    // variants:
                    theme='light'
                    size='normal'
                />
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnOK'     icon='done'   theme='success' size='sm' onClick={handleOK}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger'  size='sm' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    CaptchaDialog,
    CaptchaDialog as default,
}
