'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
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

// internal components:
import {
    CurrencyDropdown,
}                           from './CurrencyDropdown'

// contexts:
import {
    // hooks:
    useCartState,
}                           from '@/components/Cart'

// internals:
import {
    useCurrencyMenuStyleSheet,
}                           from './styles/loader'



// react components:
export interface CurrencyMenuProps
    extends
        // bases:
        NavItemProps
{
}
const CurrencyMenu = (props: CurrencyMenuProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCurrencyMenuStyleSheet();
    
    
    
    // states:
    const {
        // states:
        navbarExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    
    
    // contexts:
    const {
        // accessibilities:
        preferredCurrency,
        setPreferredCurrency,
    } = useCartState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownMenu, setShownMenu] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (shownMenu) {
            shownMenu.closeDialog(undefined);
        }
        else {
            const newShownMenu = showDialog<string>(
                <CurrencyDropdown
                    // variants:
                    theme='primary'
                    
                    
                    
                    // states:
                    navbarExpanded={navbarExpanded} // out of <NavbarContextProvider>, we need to drill props the navbar's state
                    
                    
                    
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
            newShownMenu.collapseEndEvent().then((event) => {
                setPreferredCurrency(event.data);
                toggleList(false); // collapse the <Navbar> manually
            });
        } // if
    });
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...props}
            
            
            
            // refs:
            elmRef={menuRef}
            
            
            
            // classes:
            className={`${styleSheet.currencyMenu} ${!navbarExpanded ? 'navbarCollapsed' : ''}`}
            
            
            
            // behaviors:
            actionCtrl={true}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {preferredCurrency}
        </NavItem>
    );
};
export {
    CurrencyMenu,
    CurrencyMenu as default,
}