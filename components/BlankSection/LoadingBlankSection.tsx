'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // status-components:
    Busy,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    BlankSectionProps,
    BlankSection,
}                           from './BlankSection'

// internals:
import {
    useBlankSectionStyleSheet,
}                           from './styles/loader'



// react components:
export interface LoadingBlankSectionProps
    extends
        // bases:
        BlankSectionProps
{
}
const LoadingBlankSection = (props: LoadingBlankSectionProps) => {
    // styles:
    const styleSheet = useBlankSectionStyleSheet();
    
    
    
    // jsx:
    return (
        <BlankSection
            // other props:
            {...props}
        >
            {props.children ?? <Busy
                // variants:
                size='lg'
                
                
                
                // classes:
                className={styleSheet.loadingIndicator}
            />}
        </BlankSection>
    );
}
export {
    LoadingBlankSection,
    LoadingBlankSection as default,
};
