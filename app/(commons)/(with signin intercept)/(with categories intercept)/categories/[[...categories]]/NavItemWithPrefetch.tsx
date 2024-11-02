'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useMemo,
}                           from 'react'

// reusable-ui components:
import {
    // composite-components:
    type NavItemProps,
    NavItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    PrefetchProductPage,
}                           from '@/components/prefetches/PrefetchProductPage'
import {
    PrefetchCategoryDetail,
}                           from '@/components/prefetches/PrefetchCategoryDetail'

// models:
import {
    // defaults:
    defaultProductPerPage,
}                           from '@/models'



// react components:
export interface NavItemWithPrefetchProps
    extends
        // bases:
        NavItemProps
{
    // data:
    categoryPath : string[]|null
}
const NavItemWithPrefetch = (props: NavItemWithPrefetchProps): JSX.Element|null => {
    // props:
    const {
        // data:
        categoryPath : categoryPathUnstable,
        
        
        
        // other props:
        ...restNavItemProps
    } = props;
    const categoryPath = useMemo<string[]|null>(() => {
        if (!categoryPathUnstable?.length) return null;
        return categoryPathUnstable;
    }, [categoryPathUnstable?.join('/')]);
    
    
    
    // refs:
    const navItemRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    return (
        <>
            <NavItem
                // other props:
                {...restNavItemProps}
                
                
                
                // refs:
                elmRef={navItemRef}
            />
            
            {/* PREFETCH for displaying category PAGE: */}
            {!!categoryPath && <PrefetchCategoryDetail
                // refs:
                subjectRef={navItemRef}
                
                
                
                // data:
                categoryPath={categoryPath}
            />}
            
            {/* PREFETCH for displaying related PRODUCTS in category page: */}
            <PrefetchProductPage
                // refs:
                subjectRef={navItemRef}
                
                
                
                // data:
                categoryPath={categoryPath}
                
                
                
                // states:
                initialPageNum={0} // the products in productPage is always having PAGINATION with initial page num = 0
                initialPerPage={defaultProductPerPage}
            />
        </>
    );
};
export {
    NavItemWithPrefetch,
    NavItemWithPrefetch as default,
}
