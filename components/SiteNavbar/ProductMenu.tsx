'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    CategoryExplorerDropdown,
}                           from '@/components/explorers/CategoryExplorer'
import {
    useGetHasCategories,
}                           from '@/components/explorers/CategoryExplorer/hooks'
import {
    PrefetchCategoryPage,
}                           from '@/components/prefetches/PrefetchCategoryPage'
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'
import {
    type NavbarMenuDropdownProps,
    NavbarMenuDropdown,
}                           from '@/components/SiteNavbar/NavbarMenuDropdown'

// models:
import {
    // defaults:
    defaultRootCategoryPerPage,
}                           from '@/models'



// react components:
export interface ProductMenuProps
    extends
        // bases:
        Omit<NavbarMenuDropdownProps,
            // components:
            |'dropdownUiComponent'
        >
{
}
const ProductMenu = (props: ProductMenuProps): JSX.Element|null => {
    // states:
    const [hasCategories, firstRootcategory] = useGetHasCategories();
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (!hasCategories) event.preventDefault(); // not having categories => ignore => do not intercept with category menu => just directly displaying products page
    });
    
    
    
    // default props:
    const {
        // children:
        children = (
            <Link
                // data:
                href='/products'
                
                
                
                // behaviors:
                prefetch={!hasCategories} // if not_having_categories => force to DEEP prefetch of product PAGE, otherwise NEVER prefetch because the product page is NEVER reached (by soft navigation)
            >
                Products
            </Link>
        ),
        
        
        
        // other props:
        ...restNavItemProps
    } = props satisfies NoForeignProps<typeof props, Omit<NavbarMenuDropdownProps, 'dropdownUiComponent'>>;
    
    
    
    // jsx:
    return (
        <>
            <NavbarMenuDropdown
                // other props:
                {...restNavItemProps}
                
                
                
                // components:
                dropdownUiComponent={
                    <CategoryExplorerDropdown />
                }
                
                
                
                // handlers:
                onClick={handleClick}
            >
                {children}
            </NavbarMenuDropdown>
            
            {/* PREFETCH for displaying the category PAGE, if having_categories: */}
            {hasCategories && <PrefetchRouter
                // data:
                href='/categories'
                prefetchKind={PrefetchKind.FULL}
            />}
            
            {/* PREFETCH for displaying the sub categories of the (default selected) FIRST root category: */}
            { !!firstRootcategory && <PrefetchCategoryPage
                // refs:
                subjectRef={null} // always prefetch
                
                
                
                // data:
                model={firstRootcategory} // the parent category
                
                
                
                // states:
                initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                initialPerPage={defaultRootCategoryPerPage}
            />}
        </>
    );
};
export {
    ProductMenu,
    ProductMenu as default,
}