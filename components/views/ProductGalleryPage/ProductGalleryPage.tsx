'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useProductGalleryPageStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    Nav,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    type WideGalleryPageProps,
    WideGalleryPage,
}                           from '@/components/pages/WideGalleryPage'



// react components:
export interface ProductGalleryPageProps
extends
    // bases:
    WideGalleryPageProps
{
    // children:
    navItems ?: React.ReactNode
    children ?: React.ReactNode
}
const ProductGalleryPage = (props: ProductGalleryPageProps): JSX.Element|null => {
    // props:
    const {
        // children:
        navItems,
        children,
        
        
        
        // other props:
        ...restProductGalleryPageProps
    } = props;
    
    
    
    // styles:
    const styles = useProductGalleryPageStyleSheet();
    
    
    
    // default props:
    const {
        // variants:
        theme = 'primary',
    } = restProductGalleryPageProps satisfies NoForeignProps<typeof restProductGalleryPageProps, WideGalleryPageProps>;
    
    
    
    // jsx:
    return (
        <WideGalleryPage
            // variants:
            theme={theme}
        >
            {!!navItems && <Section
                // classes:
                className={styles.nav}
            >
                <Nav
                    // variants:
                    size='sm'
                    listStyle='breadcrumb'
                    orientation='inline'
                >
                    {navItems}
                </Nav>
            </Section>}
            
            <Section
                // classes:
                className={styles.gallery}
            >
                {children}
            </Section>
        </WideGalleryPage>
    );
};
export {
    ProductGalleryPage,            // named export for readibility
    ProductGalleryPage as default, // default export to support React.lazy
}
