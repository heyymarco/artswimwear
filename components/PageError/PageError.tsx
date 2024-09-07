'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    usePageErrorStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    CardBody,
    
    
    
    // dialog-components:
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    MainProps,
    Main,
    GenericSection,
}                           from '@heymarco/section'

// internals:
import {
    MessageError,
}                           from '@/components/MessageError'



// react components:
export interface PageErrorProps extends MainProps {
    // handlers:
    onRetry ?: () => void
}
export const PageError = (props: PageErrorProps): JSX.Element|null => {
    // rest props:
    const {
        // handlers:
        onRetry,
    ...restMainProps} = props;
    
    
    
    // styles:
    const styleSheet = usePageErrorStyleSheet();
    
    
    
    // refs:
    const sectionRef     = useRef<HTMLElement|null>(null);
    const buttonRetryRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // jsx:
    return (
        <Main
            // other props:
            {...restMainProps}
            
            
            
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <GenericSection
                // refs:
                elmRef={sectionRef}
                
                
                
                // classes:
                className='fill-self'
            >
                <ModalCard
                    // variants:
                    theme='danger'
                    backdropStyle='static'
                    
                    
                    
                    // states:
                    expanded={true}
                    
                    
                    
                    // global stackable:
                    viewport={sectionRef}
                    
                    
                    
                    // auto focusable:
                    autoFocusOn={buttonRetryRef} // TODO: doesn't work
                >
                    <CardBody
                        // classes:
                        className={styleSheet.modalError}
                    >
                        <MessageError
                            // refs:
                            buttonRetryRef={buttonRetryRef}
                            
                            
                            
                            // handlers:
                            onRetry={onRetry}
                        />
                    </CardBody>
                </ModalCard>
            </GenericSection>
        </Main>
    );
}
