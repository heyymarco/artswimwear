'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    BlankPageProps,
    BlankPage,
}                           from './BlankPage'



// react components:
export interface ErrorBlankPageProps
    extends
        // bases:
        BlankPageProps
{
    // handlers:
    onRetry ?: React.MouseEventHandler<HTMLButtonElement>
}
const ErrorBlankPage = (props: ErrorBlankPageProps) => {
    // rest props:
    const {
        // handlers:
        onRetry,
    ...restBlankPageProps} = props;
    
    
    
    // jsx:
    return (
        <BlankPage
            // other props:
            {...restBlankPageProps}
            
            
            
            // variants:
            theme={props.theme ?? 'danger'}
        >
            {props.children ?? <div className='statusMessage'>
                <h3>
                    Oops, an error occured!
                </h3>
                {!!onRetry && <>
                    <p>
                        We were unable to retrieve data from the server.
                    </p>
                    <ButtonIcon
                        // appearances:
                        icon='refresh'
                        
                        
                        
                        // variants:
                        theme='success'
                        
                        
                        
                        // handlers:
                        onClick={onRetry}
                    >
                        Retry
                    </ButtonIcon>
                </>}
            </div>}
        </BlankPage>
    );
}
export {
    ErrorBlankPage,
    ErrorBlankPage as default,
};
