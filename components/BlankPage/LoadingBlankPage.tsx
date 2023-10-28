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
    BlankPageProps,
    BlankPage,
}                           from './BlankPage'



// react components:
export interface LoadingBlankPageProps
    extends
        // bases:
        BlankPageProps
{
}
const LoadingBlankPage = (props: LoadingBlankPageProps) => {
    // jsx:
    return (
        <BlankPage
            // other props:
            {...props}
        >
            {props.children ?? <Busy
                // variants:
                size='lg'
                
                
                
                // classes:
                className='loadingIndicator'
            />}
        </BlankPage>
    );
}
export {
    LoadingBlankPage,
    LoadingBlankPage as default,
};
