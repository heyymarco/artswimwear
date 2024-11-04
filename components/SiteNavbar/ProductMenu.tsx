'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    NavItemProps,
    NavItem,
    useNavbarState,
    
    
    
    // utility-components:
    PromiseDialog,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
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

// models:
import {
    // defaults:
    defaultSubCategoryPerPage,
}                           from '@/models'

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// react components:
export interface ProductMenuProps
    extends
        // bases:
        NavItemProps
{
}
const ProductMenu = (props: ProductMenuProps): JSX.Element|null => {
    // states:
    const {
        // refs:
        navbarRef,
        
        
        
        // states:
        navbarExpanded : isDesktopLayout,
        listExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    const [hasCategories, firstSubcategory] = useGetHasCategories();
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownDropdown, setShownDropdown] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const {
        startIntercept,
    } = usePageInterceptState();
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        if (!hasCategories) return; // not having categories => ignore => just displaying products page
        event.preventDefault();  // prevent the `href='/signin'` to HARD|SOFT navigate
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (shownDropdown) {
            shownDropdown.closeDialog(undefined);
        }
        else {
            //#region a fix for categories page interceptor
            // intercepts all_pages/** => show <CategoryExplorerDropdown>:
            startIntercept(async (backPathname): Promise<boolean> => {
                if (!listExpanded) toggleList(false); // collapse the <Navbar> manually
                
                
                
                const shownDropdownPromise = showDialog<boolean>(
                    <CategoryExplorerDropdown
                        // appearances:
                        mobileLayout={!isDesktopLayout}
                        
                        
                        
                        // variants:
                        // theme='primary'
                        
                        
                        
                        // floatable:
                        floatingStrategy='fixed' // do not influences with browser's scrollbar
                        floatingOn={
                            isDesktopLayout
                            ? menuRef         // on desktop: shows the <CategoryExplorerDropdown> on the bottom of <ProductMenu>
                            : navbarRef       // on mobile : shows the <CategoryExplorerDropdown> on the bottom of <Navbar>
                        }
                        floatingPlacement={
                            isDesktopLayout
                            ? 'bottom-end'    // on desktop: shows the <CategoryExplorerDropdown> on the bottom of <ProductMenu>
                            : 'bottom-start'  // on mobile : shows the <CategoryExplorerDropdown> on the bottom of <Navbar>
                        }
                        orientation={
                            isDesktopLayout
                            ? 'block'         // on desktop: vertically   (top  to bottom) shows the <CategoryExplorerDropdown> on the bottom of <ProductMenu>
                            : 'inline'        // on mobile : horizontally (left to  right) shows the <CategoryExplorerDropdown> on the bottom of <Navbar>
                        }
                        
                        
                        
                        // auto focusable:
                        restoreFocusOn={
                            isDesktopLayout
                            ? menuRef         // on desktop: restores focus to <ProductMenu>
                            : navbarRef       // on mobile: restores focus to <Navbar>
                        }
                    />
                );
                setShownDropdown(shownDropdownPromise);
                
                // on collapsed (has been closed):
                if (!isDesktopLayout) {
                    shownDropdownPromise.collapseEndEvent().then(() => {
                        toggleList(false); // collapse the <Navbar> manually
                    });
                } // if
                
                
                
                // on collapsing (start to close):
                const { data } = await shownDropdownPromise.collapseStartEvent();
                setShownDropdown(null);
                // when the dropdown closed without the user clicking the menu item => restore the url, otherwise keeps the changed url
                return (data !== true);
            });
            //#endregion a fix for categories page interceptor
        } // if
    });
    
    
    
    // effects:
    // closes the shown <CategoryExplorerDropdown> when on transition between desktop <==> mobile:
    const prevIsDesktopLayoutRef = useRef<boolean>(isDesktopLayout);
    useEffect(() => {
        // conditions:
        if (prevIsDesktopLayoutRef.current === isDesktopLayout) return; // no diff => ignore
        prevIsDesktopLayoutRef.current = isDesktopLayout; // sync
        
        
        
        // actions:
        shownDropdown?.closeDialog(undefined);
    }, [isDesktopLayout]);
    
    // closes the shown <CategoryExplorerDropdown> when <Navbar>'s list collapsed:
    const prevListExpandedRef = useRef<boolean>(listExpanded);
    useEffect(() => {
        // conditions:
        if (prevListExpandedRef.current === listExpanded) return; // no diff => ignore
        prevListExpandedRef.current = listExpanded; // sync
        if (listExpanded) return; // only interested on collapsed event
        
        
        
        // actions:
        shownDropdown?.closeDialog(undefined);
    }, [listExpanded]);
    
    
    
    // default props:
    const {
        // children:
        children = (
            <Link
                // data:
                href='/products'
                
                
                
                // behaviors:
                prefetch={!hasCategories} // if not_having_categories => force to DEEP prefetch of product PAGE, otherwise NEVER prefetch because the product page is NEVER reached
            >
                Products
            </Link>
        ),
    } = props;
    
    
    
    // jsx:
    return (
        <>
            <NavItem
                // other props:
                {...props}
                
                
                
                // refs:
                elmRef={menuRef}
                
                
                
                // states:
                active={shownDropdown ? true : undefined} // force as active if the menu is shown
                
                
                
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
            
            {/* PREFETCH for displaying the FIRST sub category: */}
            { !!firstSubcategory && <PrefetchCategoryPage
                // refs:
                subjectRef={null} // always prefetch
                
                
                
                // data:
                model={firstSubcategory}
                
                
                
                // states:
                initialPageNum={0} // the NEXT subcategories is always having PAGINATION with initial page num = 0, because it NEVER visited before
                initialPerPage={defaultSubCategoryPerPage}
            />}
        </>
    );
};
export {
    ProductMenu,
    ProductMenu as default,
}