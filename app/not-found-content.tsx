'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// heymarco components:
import {
    GenericSection,
    Main,
}                           from '@heymarco/section'
import {
    Image,
}                           from '@heymarco/image'



const useNotFoundStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./not-found-styles')
, { id: 's4wft44ho1' });
import './not-found-styles';



// react components:
export function NotFoundPageContent() {
    // styles:
    const styleSheet = useNotFoundStyleSheet();
    
    
    
    // jsx:
    return (
        <GenericSection
            // variants:
            theme='primary'
            mild={true}
            
            
            
            // classes:
            className={styleSheet.main}
        >
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
        </GenericSection>
    );
}
