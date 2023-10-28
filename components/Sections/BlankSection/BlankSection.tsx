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
    SectionProps,
    Section,
}                           from '@heymarco/section'

// internals:
import {
    useBlankSectionStyleSheet,
}                           from './styles/loader'



// react components:
export interface BlankSectionProps
    extends
        // bases:
        SectionProps
{
}
const BlankSection = (props: BlankSectionProps) => {
    // styles:
    const styleSheet = useBlankSectionStyleSheet();
    
    
    
    // classes:
    const mergedClasses  = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main, // style
    );
    
    
    
    // jsx:
    return (
        <Section
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            classes={mergedClasses}
        />
    );
}
export {
    BlankSection,
    BlankSection as default,
};
