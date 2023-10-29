'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    
    
    
    // jsx:
    return (
        <Section
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        />
    );
}
export {
    BlankSection,
    BlankSection as default,
};
