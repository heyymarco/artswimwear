'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

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

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'



// configs:
const categoriesPath = '/categories';



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
        // states:
        navbarExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownMenu, setShownMenu] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const {
        startIntercept,
    } = usePageInterceptState();
    const router = useRouter();
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        event.preventDefault();  // prevent the `href='/signin'` to HARD|SOFT navigate
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (shownMenu) {
            shownMenu.closeDialog(undefined);
        }
        else {
            //#region a fix for categories page interceptor
            // intercepts all_pages/** => show <CategoryExplorerDropdown>:
            startIntercept(async (backPathname): Promise<boolean> => {
                // set a temporary `/category` url before the <CategoryExplorerDropdown> resolves a more specific `/category/specific`:
                router.push(categoriesPath, { scroll: false }); // intercept the url
                
                
                
                const newShownMenu = showDialog<true>(
                    <CategoryExplorerDropdown
                        // variants:
                        // theme='primary'
                        
                        
                        
                        // floatable:
                        floatingOn={menuRef}
                        floatingPlacement='bottom-end'
                        
                        
                        
                        // auto focusable:
                        restoreFocusOn={menuRef}
                    />
                );
                setShownMenu(newShownMenu);
                newShownMenu.collapseStartEvent().then(() => {
                    setShownMenu(null);
                });
                const data = await newShownMenu;
                
                
                
                // on fully closed:
                toggleList(false); // collapse the <Navbar> manually
                // when the dropdown closed without the user clicking the menu item => restore the url, otherwise keeps the changed url
                return (data !== true);
            });
            //#endregion a fix for categories page interceptor
        } // if
    });
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // default props:
    const {
        // children:
        children = (
            <Link href='/products'>
                Products
            </Link>
        ),
    } = props;
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...props}
            
            
            
            // refs:
            elmRef={menuRef}
            
            
            
            // states:
            active={shownMenu ? true : undefined} // force as active if the menu is shown
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {children}
        </NavItem>
    );
};
export {
    ProductMenu,
    ProductMenu as default,
}