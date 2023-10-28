'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    
    
    
    // jsx:
    return (
        <Main
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <Section
                // other props:
                {...props}
            />
        </Main>
    );
}
export {
    BlankPage,
    BlankPage as default,
};
