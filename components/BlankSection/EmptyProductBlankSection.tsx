'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

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
    // handlers:
    onNavigate ?: React.MouseEventHandler<HTMLButtonElement>
}
const EmptyProductBlankSection = (props: EmptyProductBlankSectionProps) => {
    // styles:
    const styleSheet = useBlankSectionStyleSheet();
    
    
    
    // rest props:
    const {
        // handlers:
        onNavigate,
    ...restBlankSectionProps} = props;
    
    
    
    // navigations:
    const router = useRouter();
    
    
    
    // handlers:
    const handleNavigateInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        
        
        
        // actions:
        router.push('/checkout');
    });
    const handleNavigate         = useMergeEvents(
        // actions:
        onNavigate,
        handleNavigateInternal,
    );
    
    
    
    // jsx:
    return (
        <BlankSection
            // other props:
            {...restBlankSectionProps}
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
                    
                    
                    
                    // handlers:
                    onClick={handleNavigate}
                >
                    See our product gallery
                </ButtonIcon>
            </div>}
        </BlankSection>
    );
}
export {
    EmptyProductBlankSection,
    EmptyProductBlankSection as default,
};
