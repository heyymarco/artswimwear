'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    ErrorBlankSectionProps,
    ErrorBlankSection,
}                           from '@/components/BlankSection'

// internal components:
import {
    BlankPageProps,
    BlankPage,
}                           from './BlankPage'



// react components:
export interface ErrorBlankPageProps
    extends
        // bases:
        BlankPageProps,
        ErrorBlankSectionProps
{
}
const ErrorBlankPage = (props: ErrorBlankPageProps) => {
    // jsx:
    return (
        <BlankPage
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'danger'}
            
            
            
            // components:
            blankSectionComponent={
                props.blankSectionComponent
                ??
                <ErrorBlankSection />
            }
        />
    );
}
export {
    ErrorBlankPage,
    ErrorBlankPage as default,
};
