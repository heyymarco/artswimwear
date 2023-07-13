import Link from 'next/link';
import { Badge, ButtonIcon, Collapse, HamburgerMenuButton, Icon, List, ListItem, Nav, NavbarParams, navbars, NavItem } from '@reusable-ui/components';
import { selectCartTotalQuantity, toggleCart } from '@/store/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEvent } from '@reusable-ui/core';
import { useEffect, useInsertionEffect, useState } from 'react';



const SiteLogo = () => {
    return (
        <Link href='/'>
            <Icon icon='artswimwear' size='xl' />
        </Link>
    );
}

const SiteNavbarMenu = ({
        basicVariantProps,
        navbarExpanded,
        listExpanded,
        handleClickToToggleList,
    } : NavbarParams) => {
    
    
    
    const cartTotalQuantity = useSelector(selectCartTotalQuantity);
    const hasCart = !!cartTotalQuantity;
    const dispatch = useDispatch();
    const handleToggleCart = useEvent(() => {
        dispatch(toggleCart());
    });
    
    
    
    useInsertionEffect(() => {
        navbars.listGridAreaCollapse = (!hasCart ? '2/1/2/3' : '2/1/2/4') as any;
    }, [hasCart]);
    
    
    
    const [cartTogglerRef, setCartTogglerRef] = useState<HTMLElement|null>(null);
    const [cartStatusExcited, setCartStatusExcited] = useState<boolean>(false)
    const CartStatus = () => <Badge excited={cartStatusExcited} onExcitedChange={({excited}) => setCartStatusExcited(excited)} floatingOn={cartTogglerRef} theme='danger' badgeStyle='pill' floatingPlacement='right-start' floatingOffset={!navbarExpanded ? -16 : -24} floatingShift={!navbarExpanded ? 3 : 10}>{cartTotalQuantity}</Badge>
    useEffect(() => {
        if (!hasCart) return;
        if (!cartTotalQuantity) return;
        
        
        
        setCartStatusExcited(true);
    }, [hasCart, cartTotalQuantity]); // if the quantity changes => make an animation
    
    
    
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && hasCart && <ButtonIcon icon='shopping_cart' elmRef={setCartTogglerRef} size='lg' onClick={handleToggleCart}>
                <CartStatus />
            </ButtonIcon>}
            
            {!navbarExpanded && <HamburgerMenuButton {...basicVariantProps} className='toggler' active={listExpanded} onClick={handleClickToToggleList} />}
            
            <Collapse className='list' mainClass={navbarExpanded ? '' : undefined} expanded={listExpanded}>
                <Nav tag='ul' role='' {...basicVariantProps} orientation={navbarExpanded ? 'inline' : 'block'} listStyle='flat' gradient={navbarExpanded ? 'inherit' : false}>
                    <NavItem><Link href='/'>Home</Link></NavItem>
                    <NavItem><Link href='/products'>Products</Link></NavItem>
                    <NavItem><Link href='/about'>About</Link></NavItem>
                    <NavItem><Link href='/contact'>Contact Us</Link></NavItem>
                    <NavItem href='https://www.instagram.com/'><Icon icon='instagram' size='lg' /></NavItem>
                    
                    {navbarExpanded && hasCart && <ListItem<HTMLElement> className='cartBtn' {...basicVariantProps} elmRef={setCartTogglerRef} actionCtrl={true} onClick={handleToggleCart}>
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