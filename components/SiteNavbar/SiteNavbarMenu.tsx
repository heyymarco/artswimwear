'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useInsertionEffect,
    useState,
}                           from 'react'

// next-auth:
import {
    useSession,
    signOut,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIcon,
    HamburgerMenuButton,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Busy,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    NavbarParams,
    navbars,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SiteLogo,
}                           from './SiteLogo'

// contexts:
import {
    // hooks:
    useCartState,
    
    
    
    // react components:
    CartStatus,
}                           from '@/components/Cart'



// react components:
const SiteNavbarMenu = ({
        basicVariantProps,
        navbarExpanded,
        listExpanded,
        handleClickToToggleList,
    } : NavbarParams) => {
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const isFullySignedIn  = !isSigningOut && (sessionStatus === 'authenticated')   && !!session;
    const isFullySignedOut = !isSigningOut && (sessionStatus === 'unauthenticated') &&  !session;
    const isBusy           =  isSigningOut || (sessionStatus === 'loading');
    const role = session?.role;
    
    
    
    // handlers:
    const handleSignOut = useEvent((): void => {
        setIsSigningOut(true);
        signOut();
    });
    
    
    
    // contexts:
    const {
        // states:
        isCartEmpty,
        
        
        
        // actions:
        showCart,
    } = useCartState();
    
    
    
    // dom effects:
    // dynamically modify <Navbar> layout when the <CartButton> shown:
    useInsertionEffect(() => {
        navbars.listGridAreaCollapse = (isCartEmpty ? '2/1/2/3' : '2/1/2/4') as any;
    }, [isCartEmpty]);
    
    
    
    // refs:
    const [cartTogglerRef, setCartTogglerRef] = useState<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && !isCartEmpty && <ButtonIcon
                // refs:
                elmRef={setCartTogglerRef}
                
                
                
                // appearances:
                icon='shopping_cart'
                
                
                
                // variants:
                size='lg'
                
                
                
                // handlers:
                onClick={showCart}
            >
                <CartStatus
                    // floatable:
                    floatingOn={cartTogglerRef}
                    floatingPlacement='right-start'
                    floatingOffset={-16}
                    floatingShift={3}
                />
            </ButtonIcon>}
            
            {!navbarExpanded && <HamburgerMenuButton
                // variants:
                {...basicVariantProps}
                
                
                
                // classes:
                className='toggler'
                
                
                
                // states:
                active={listExpanded}
                
                
                
                // handlers:
                onClick={handleClickToToggleList}
            />}
            
            <Collapse
                // classes:
                mainClass={navbarExpanded ? '' : undefined}
                className='list'
                
                
                
                // states:
                expanded={listExpanded}
            >
                <Nav
                    // semantics:
                    tag='ul'
                    role=''
                    
                    
                    
                    // variants:
                    {...basicVariantProps}
                    gradient={navbarExpanded ? 'inherit' : false}
                    listStyle='flat'
                    orientation={navbarExpanded ? 'inline' : 'block'}
                >
                    <NavItem><Link href='/'>Home</Link></NavItem>
                    <NavItem><Link href='/products'>Products</Link></NavItem>
                    <NavItem><Link href='/about'>About</Link></NavItem>
                    <NavItem><Link href='/contact'>Contact Us</Link></NavItem>
                    <NavItem href='https://www.instagram.com/'><Icon icon='instagram' size='lg' /></NavItem>
                    
                    {navbarExpanded && !isCartEmpty && <ListItem<HTMLElement>
                        // refs:
                        elmRef={setCartTogglerRef}
                        
                        
                        
                        // variants:
                        {...basicVariantProps}
                        
                        
                        
                        // classes:
                        className='cartBtn'
                        
                        
                        
                        // behaviors:
                        actionCtrl={true}
                        
                        
                        
                        // handlers:
                        onClick={showCart}
                    >
                        <Icon icon='shopping_cart' size='lg' />
                        <CartStatus
                            // floatable:
                            floatingOn={cartTogglerRef}
                            floatingPlacement='right-start'
                            floatingOffset={-24}
                            floatingShift={10}
                        />
                    </ListItem>}
                    
                    {isBusy && <NavItem active={true}>
                        <Busy theme='secondary' size='lg' />
                        &nbsp;
                        {(isSigningOut || session) ? 'Signing out...' : 'Loading...'}
                    </NavItem>}
                    
                    {isFullySignedOut && <NavItem>
                        <Link href='/signin'>Sign In</Link>
                    </NavItem>}
                    
                    {isFullySignedIn  && <NavItem onClick={handleSignOut}>
                        Sign Out
                    </NavItem>}
                </Nav>
            </Collapse>
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}
