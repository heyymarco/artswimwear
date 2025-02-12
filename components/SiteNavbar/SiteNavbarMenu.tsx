'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useInsertionEffect,
    useState,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Button,
    ButtonIcon,
    HamburgerMenuButton,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    useNavbarState,
    navbars,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SiteLogo,
}                           from './SiteLogo'
import {
    CurrencyMenu,
}                           from './CurrencyMenu'
import {
    SignInMenu,
}                           from './SignInMenu'
import {
    ProductMenu,
}                           from './ProductMenu'
import {
    SearchMenu,
}                           from './SearchMenu'

// contexts:
import {
    // hooks:
    useCartState,
    
    
    
    // react components:
    CartStatus,
}                           from '@/components/Cart'



// react components:
const SiteNavbarMenu = () => {
    // states:
    const {
        // variants:
        basicVariantProps,
        
        
        
        // states:
        navbarExpanded,
        listExpanded,
        
        
        
        // handlers:
        handleClickToToggleList,
    } = useNavbarState();
    
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
            />}
            
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
                    <NavItem><Link href='/' prefetch={true}>Home</Link></NavItem>
                    <ProductMenu />
                    <NavItem><Link href='/about'>About</Link></NavItem>
                    <NavItem><Link href='/contact'>Contact Us</Link></NavItem>
                    <NavItem href='https://www.instagram.com/art_ethnicswim/'><Icon icon='instagram' size='lg' /></NavItem>
                    <SearchMenu />
                    
                    <CurrencyMenu theme='primary' buttonComponent={<Button />} />
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
                    </ListItem>}
                    
                    <SignInMenu />
                </Nav>
            </Collapse>
            
            {!isCartEmpty && <CartStatus
                // floatable:
                floatingOn={cartTogglerRef}
                floatingPlacement='right-start'
                floatingOffset={navbarExpanded ? -24 : -16}
                floatingShift={navbarExpanded ? 10 : 3}
            />}
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}
