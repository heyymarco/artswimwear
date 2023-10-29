'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    LoadingBlankSectionProps,
    LoadingBlankSection,
}                           from '@/components/BlankSection'
import {
    BlankPageProps,
    BlankPage,
}                           from './BlankPage'



// react components:
export interface LoadingBlankPageProps
    extends
        // bases:
        BlankPageProps,
        LoadingBlankSectionProps
{
}
const LoadingBlankPage = (props: LoadingBlankPageProps) => {
    // jsx:
    return (
        <BlankPage
            // other props:
            {...props}
            
            
            
            // components:
            blankSectionComponent={
                props.blankSectionComponent
                ??
                <LoadingBlankSection
                    // identifiers:
                    key='busy' // avoids re-creating a similar dom during loading transition in different components
                />
            }
        />
    );
}
export {
    LoadingBlankPage,
    LoadingBlankPage as default,
};
