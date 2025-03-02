'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    type NavItemProps,
    NavItem,
    useNavbarState,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    categoriesPath,
}                           from '@/components/explorers/CategoryExplorer/configs'
import {
    useGetHasCategories,
}                           from '@/components/explorers/CategoryExplorer/hooks'
import {
    useCategoryInterceptState,
}                           from '@/components/explorers/CategoryExplorer/states/categoryInterceptState'
import {
    PrefetchCategoryPage,
}                           from '@/components/prefetches/PrefetchCategoryPage'
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'

// models:
import {
    // defaults:
    defaultRootCategoryPerPage,
    defaultSubCategoryPerPage,
}                           from '@/models'



// react components:
export interface ProductMenuProps
    extends
        // bases:
        NavItemProps
{
}
const ProductMenu = (props: ProductMenuProps): JSX.Element|null => {
    // states:
    const [hasCategories, firstRootcategory] = useGetHasCategories();
    
    
    const {
        // refs:
        navbarRef : getNavbarRef,
        
        
        
        // states:
        navbarExpanded : isDesktopLayout,
        listExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    const {
        // refs:
        navbarRef : setNavbarRef,
        menuRef,
        
        
        
        // states:
        setIsDesktopLayout,
        setIsNavbarListExpanded,
        
        isDialogShown,
        setIsDialogShown,
    } = useCategoryInterceptState();
    
    const router = useRouter();
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!hasCategories) return; // not having categories => ignore => do not intercept with category menu => just directly displaying products page
        
        
        
        // actions:
        event.preventDefault();  // prevents the `href='/target-path'` to HARD|SOFT navigate
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        if (!isDialogShown) {
            router.push(categoriesPath, { scroll: false }); // goto categories page // do not scroll the page because it triggers the categories_dropdown interceptor
        }
        else {
            setIsDialogShown(false); // close the category menu
        } // if
    });
    
    
    
    // effects:
    
    // Sync the <Navbar>'s ref with the <DropdownUi> ref:
    setNavbarRef.current = getNavbarRef.current;
    
    // Sync the <Navbar>'s layout with the <DropdownUi> state:
    useEffect(() => {
        setIsDesktopLayout(isDesktopLayout);
        setIsNavbarListExpanded(listExpanded);
    }, [isDesktopLayout, listExpanded]);
    
    // In mobile mode => after the <DropdownUi> is fully closed => close the <Navbar>'s list too:
    useEffect(() => {
        // conditions:
        if (isDialogShown  ) return; // only interested in the <DropdownUi> close event
        if (isDesktopLayout) return; // only interested in mobile layout
        
        
        
        // actions:
        toggleList(false); // collapse the <Navbar> manually
    }, [isDialogShown]);
    
    
    
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
    } = props satisfies NoForeignProps<typeof props, NavItemProps>;
    
    
    
    // jsx:
    return (
        <>
            <NavItem
                // other props:
                {...restNavItemProps}
                
                
                
                // refs:
                elmRef={menuRef}
                
                
                
                // states:
                active={
                    isDialogShown
                    ? true
                    : undefined
                }
                
                
                
                // handlers:
                onClick={handleClick}
            >
                {children}
            </NavItem>
            
            {/* PREFETCH for displaying the category PAGE, if having_categories: */}
            {hasCategories && <PrefetchRouter
                // data:
                href='/categories'
                prefetchKind={PrefetchKind.FULL}
            />}
            
            {!!firstRootcategory && <>
                {/* single level categories */}
                {!firstRootcategory.hasSubcategories && <>
                    {/* PREFETCH for displaying the root_as_sub categories: */}
                    <PrefetchCategoryPage
                        // refs:
                        subjectRef={null} // always prefetch
                        
                        
                        
                        // data:
                        model={null} // no parent category
                        
                        
                        
                        // states:
                        initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                        initialPerPage={defaultSubCategoryPerPage}
                    />
                </>}
                
                {/* multi level categories */}
                { firstRootcategory.hasSubcategories && <>
                    {/* PREFETCH for displaying the root categories: */}
                    <PrefetchCategoryPage
                        // refs:
                        subjectRef={null} // always prefetch
                        
                        
                        
                        // data:
                        model={null} // no parent category
                        
                        
                        
                        // states:
                        initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                        initialPerPage={defaultRootCategoryPerPage}
                    />
                    
                    {/* PREFETCH for displaying the sub categories of the (default selected) FIRST root category: */}
                    <PrefetchCategoryPage
                        // refs:
                        subjectRef={null} // always prefetch
                        
                        
                        
                        // data:
                        model={firstRootcategory} // the parent category
                        
                        
                        
                        // states:
                        initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                        initialPerPage={defaultSubCategoryPerPage}
                    />
                </>}
            </>}
        </>
    );
};
export {
    ProductMenu,
    ProductMenu as default,
}
