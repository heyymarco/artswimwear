'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    ErrorBlankSection,
}                           from '@/components/BlankSection'
import {
    BlankPageProps,
    BlankPage,
}                           from './BlankPage'

// internals:
import {
    useBlankPageStyleSheet,
}                           from './styles/loader'



// react components:
export interface UnderConstructionBlankPageProps
    extends
        // bases:
        BlankPageProps
{
}
const UnderConstructionBlankPage = (props: UnderConstructionBlankPageProps) => {
    // styles:
    const styleSheet = useBlankPageStyleSheet();
    
    
    
    // jsx:
    return (
        <BlankPage
            // other props:
            {...props}
            
            
            
            // variants:
            theme={props.theme ?? 'warning'}
            fullWidth={true}
            
            
            
            // components:
            blankSectionComponent={
                props.blankSectionComponent
                ??
                <ErrorBlankSection />
            }
        >
            {props.children ?? <div className={styleSheet.underConstructionMessage}>
                <Image
                    // appearances:
                    alt=''
                    src='/under-construction.svg'
                    width={0}
                    height={0}
                    
                    
                    
                    // classes:
                    className='illustration'
                />
                <article>
                    <h1>
                        Under Construction
                    </h1>
                    <p className='lead'>
                        Sorry, this page is under construction or maintenance.
                    </p>
                    <p className='lead'>
                        Please come back later 😋
                    </p>
                </article>
            </div>}
        </BlankPage>
    );
}
export {
    UnderConstructionBlankPage,
    UnderConstructionBlankPage as default,
};
