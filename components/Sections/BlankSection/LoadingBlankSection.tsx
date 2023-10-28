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



// react components:
export interface LoadingBlankSectionProps
    extends
        // bases:
        BlankSectionProps
{
}
const LoadingBlankSection = (props: LoadingBlankSectionProps) => {
    // jsx:
    return (
        <BlankSection>
            {props.children ?? <Busy
                // variants:
                size='lg'
                
                
                
                // classes:
                className='loadingIndicator'
            />}
        </BlankSection>
    );
}
export {
    LoadingBlankSection,
    LoadingBlankSection as default,
};
