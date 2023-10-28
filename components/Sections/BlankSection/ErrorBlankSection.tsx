'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
}
const ErrorBlankSection = (props: ErrorBlankSectionProps) => {
    // jsx:
    return (
        <BlankSection
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'danger'}
        >
            {props.children ?? <p>
                Oops, an error occured!
            </p>}
        </BlankSection>
    );
}
export {
    ErrorBlankSection,
    ErrorBlankSection as default,
};
