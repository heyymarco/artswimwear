'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    Main,
    SectionProps,
    Section,
}                           from '@heymarco/section'

// internals:
import {
    useBlankPageStyleSheet,
}                           from './styles/loader'



// react components:
export interface BlankPageProps
    extends
        // bases:
        SectionProps
{
}
const BlankPage = (props: BlankPageProps) => {
    // styles:
    const styleSheet = useBlankPageStyleSheet();
    
    
    
    // classes:
    const mergedClasses  = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main, // style
    );
    
    
    
    // jsx:
    return (
        <Main>
            <Section
                // other props:
                {...props}
                
                
                
                // variants:
                theme={props.theme ?? 'primary'}
                
                
                
                // classes:
                classes={mergedClasses}
            />
        </Main>
    );
}
export {
    BlankPage,
    BlankPage as default,
};
