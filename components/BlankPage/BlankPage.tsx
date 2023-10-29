'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    BlankSectionProps,
    BlankSection,
}                           from '@/components/BlankSection'

// internals:
import {
    useBlankPageStyleSheet,
}                           from './styles/loader'



// react components:
export interface BlankPageProps
    extends
        // bases:
        BlankSectionProps
{
    // components:
    blankSectionComponent ?: React.ReactComponentElement<any, BlankSectionProps>
}
const BlankPage = (props: BlankPageProps) => {
    // styles:
    const styleSheet = useBlankPageStyleSheet();
    
    
    
    // rest props:
    const {
        // components:
        blankSectionComponent = <BlankSection />,
    ...restBlankSectionProps} = props;
    
    
    
    // jsx:
    return (
        <Main
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            {React.cloneElement<BlankSectionProps>(blankSectionComponent,
                // props:
                {
                    // other props:
                    ...restBlankSectionProps,
                    ...blankSectionComponent.props, // overwrites restBlankSectionProps (if any conflics)
                    
                    
                    
                    // variants:
                    theme : blankSectionComponent.props.theme ?? props.theme ?? 'inherit',
                },
            )}
        </Main>
    );
}
export {
    BlankPage,
    BlankPage as default,
};
