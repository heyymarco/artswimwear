'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    usePageLoadingStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    Busy,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    MainProps,
    Main,
    GenericSection,
}                           from '@heymarco/section'



// react components:
export interface PageLoadingProps extends MainProps {}
export const PageLoading = (props: PageLoadingProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageLoadingStyleSheet();
    
    
    
    // jsx:
    return (
        <Main
            // other props:
            {...props}
            
            
            
            // identifiers:
            key='main-loading'
            
            
            
            // variants:
            theme={props.theme ?? 'primary'}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <GenericSection
                // identifiers:
                key='section-loading'
                
                
                
                // classes:
                className='fill-self'
            >
                <Busy
                    // identifiers:
                    key='busy-loading'
                    
                    
                    
                    // variants:
                    size='lg'
                />
            </GenericSection>
        </Main>
    );
}
