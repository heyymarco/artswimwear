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
    BlankSectionProps,
    BlankSection,
}                           from './BlankSection'



// react components:
export interface ErrorBlankSectionProps
    extends
        // bases:
        BlankSectionProps
{
    // handlers:
    onRetry ?: React.MouseEventHandler<HTMLButtonElement>
}
const ErrorBlankSection = (props: ErrorBlankSectionProps) => {
    // rest props:
    const {
        // handlers:
        onRetry,
    ...restBlankSectionProps} = props;
    
    
    
    // jsx:
    return (
        <BlankSection
            // other props:
            {...restBlankSectionProps}
            
            
            
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
        </BlankSection>
    );
}
export {
    ErrorBlankSection,
    ErrorBlankSection as default,
};
