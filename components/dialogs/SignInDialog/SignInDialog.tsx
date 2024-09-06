'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// styles:
import {
    useSignInDialogStyleSheet,
}                           from './styles/loader'

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

// internal components:
import {
    type Session,
    type SignInProps,
    SignIn,
}                           from '@/components/SignIn'



// react components:
export interface SignInDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<false|Session> = ModalExpandedChangeEvent<false|Session>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
    // accessibilities:
    title           ?: string
    
    
    
    // components:
    signInComponent ?: React.ReactElement<SignInProps<Element>>
}
const SignInDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<false|Session> = ModalExpandedChangeEvent<false|Session>>(props: SignInDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // accessibilities:
        title           = 'Sign In',
        
        
        
        // components:
        signInComponent = (<SignIn<Element> /> as React.ReactElement<SignInProps<Element>>),
        
        
        
        // other props:
        ...restSignInDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useSignInDialogStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    const sessionUserId  : string|null = session?.user?.id ?? null; // we use userId instead of the whole session object, so when the session is auto refreshed, the equality is preserved
    const prevSessionRef = useRef<string|null>(sessionUserId);
    useEffect(() => {
        // conditions:
        if (prevSessionRef.current === sessionUserId) return; // already the same => ignore
        prevSessionRef.current = sessionUserId;               // sync
        
        
        
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : session,
        } as TModalExpandedChangeEvent);
    }, [sessionUserId, session]);
    
    
    
    // handlers:
    const handleCloseDialog = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : false,
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'regular',
        modalCardStyle = 'scrollable',
        horzAlign      = 'stretch',
        vertAlign      = 'center',
        
        
        
        // other props:
        ...restModalCardProps
    } = restSignInDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
            horzAlign      = {horzAlign}
            vertAlign      = {vertAlign}
            
            
            
            // classes:
            className={styleSheet.dialog}
        >
            <CardHeader>
                {!!title && <h1>{title}</h1>}
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheet.cardBody}>
                {React.cloneElement<SignInProps<Element>>(signInComponent,
                    // props:
                    {
                        // classes:
                        className               : styleSheet.signInUi,
                        
                        
                        
                        // components:
                        gotoHomeButtonComponent : null,
                    }
                )}
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    SignInDialog,
    SignInDialog as default,
}
