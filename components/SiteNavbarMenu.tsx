'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useInsertionEffect,
    useEffect,
    useState,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIcon,
    HamburgerMenuButton,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
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
}                           from '@/components/Cart'



// react components:
const SiteNavbarMenu = ({
        basicVariantProps,
        navbarExpanded,
        listExpanded,
        handleClickToToggleList,
    } : NavbarParams) => {
    
    
    
    // contexts:
    const {
        // states:
        isCartEmpty,
        
        
        
        // cart data:
        totalProductQuantity,
        
        
        
        // actions:
        showCart,
    } = useCartState();
    
    
    
    // dom effects:
    
    // dynamically modify <Navbar> layout when the <CartButton> shown:
    useInsertionEffect(() => {
        navbars.listGridAreaCollapse = (isCartEmpty ? '2/1/2/3' : '2/1/2/4') as any;
    }, [isCartEmpty]);
    
    // animate <CartButton> when the `totalProductQuantity` changed:
    const [cartTogglerRef   , setCartTogglerRef   ] = useState<HTMLElement|null>(null);
    const [cartStatusExcited, setCartStatusExcited] = useState<boolean>(false)
    const CartStatus = () => <Badge excited={cartStatusExcited} onExcitedChange={({excited}) => setCartStatusExcited(excited)} floatingOn={cartTogglerRef} theme='danger' badgeStyle='pill' floatingPlacement='right-start' floatingOffset={!navbarExpanded ? -16 : -24} floatingShift={!navbarExpanded ? 3 : 10}>{totalProductQuantity}</Badge>
    useEffect(() => {
        if (isCartEmpty) return;
        if (!totalProductQuantity) return;
        
        
        
        setCartStatusExcited(true);
    }, [isCartEmpty, totalProductQuantity]); // if the quantity changes => make an animation
    
    
    
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
                <CartStatus />
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
                        <CartStatus />
                    </ListItem>}
                </Nav>
            </Collapse>
        </>
    );
};
export {
    SiteNavbarMenu,
    SiteNavbarMenu as default,
}
