// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface MessageErrorProps {
    // refs:
    buttonRetryRef ?: React.Ref<HTMLButtonElement> // setter ref
    
    
    
    // accessibilities:
    title          ?: React.ReactNode
    message        ?: React.ReactNode
    
    
    
    // handlers:
    onRetry        ?: () => void
}
export const MessageError = (props: MessageErrorProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        buttonRetryRef,
        
        
        
        // accessibilities:
        title   = <h3>
            Oops, an error occured!
        </h3>,
        message = <p>
            We were unable to retrieve data from the server.
        </p>,
        
        
        
        // handlers:
        onRetry,
    } = props;
    
    
    
    // jsx:
    return (
        <>
            {title}
            {message}
            {!!onRetry && <ButtonIcon elmRef={buttonRetryRef} icon='refresh' theme='success' onClick={onRetry}>
                Retry
            </ButtonIcon>}
        </>
    );
}