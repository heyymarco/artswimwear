'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    BlankSectionProps,
    BlankSection,
}                           from './BlankSection'

// internals:
import {
    useBlankSectionStyleSheet,
}                           from './styles/loader'



// react components:
export interface EmptyProductBlankSectionProps
    extends
        // bases:
        BlankSectionProps
{
}
const EmptyProductBlankSection = (props: EmptyProductBlankSectionProps) => {
    // styles:
    const styleSheet = useBlankSectionStyleSheet();
    
    
    
    // jsx:
    return (
        <BlankSection
            // other props:
            {...props}
        >
            {props.children ?? <div className={styleSheet.errorMessage}>
                <p>
                    Your shopping cart is empty. Please add one/some products to buy.
                </p>
                
                <ButtonIcon
                    // appearances:
                    icon='image_search'
                    
                    
                    
                    // variants:
                    size='lg'
                    theme='primary'
                    gradient={true}
                >
                    <Link href='/products'>
                        See our product gallery
                    </Link>
                </ButtonIcon>
            </div>}
        </BlankSection>
    );
}
export {
    EmptyProductBlankSection,
    EmptyProductBlankSection as default,
};
