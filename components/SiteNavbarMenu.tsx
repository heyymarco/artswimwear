import Link from 'next/link';
import { Badge, ButtonIcon, Collapse, HamburgerMenuButton, Icon, List, ListItem, Nav, NavbarParams, navbars, NavItem } from '@reusable-ui/components';
import { selectCartTotalQuantity, toggleCart } from '@/store/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEvent } from '@reusable-ui/core';
import { useEffect, useInsertionEffect, useRef, useState } from 'react';




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
        navbars.listGridArea = (!hasCart ? '2/1/2/3' : '2/1/2/4') as any;
    }, [hasCart]);
    
    
    
    const [cartStatusExcited, setCartStatusExcited] = useState(false);
    const cartTogglerRef = useRef<any|null>(null);
    const cartStatusRef = useRef<HTMLElement|null>(null)
    const CartStatus = () => <Badge elmRef={cartStatusRef} floatingOn={cartTogglerRef} theme='danger' badgeStyle='pill' floatingPlacement='right-start' floatingOffset={!navbarExpanded ? -16 : -24} floatingShift={!navbarExpanded ? 3 : 10}>{cartTotalQuantity}</Badge>
    useEffect(() => {
        if (!hasCart) return;
        const cartStatusElm = cartStatusRef.current;
        if (!cartStatusElm) return;
        
        
        
        const cartStatusStyle = cartStatusElm.style;
        const transitionDuration = 300; // ms
        cartStatusStyle.transition = `scale ease ${transitionDuration}ms`;
        setTimeout(() => {
            cartStatusStyle.scale = '200%';
            setTimeout(() => {
                cartStatusStyle.scale = '';
                setTimeout(() => {
                    cartStatusStyle.transition = '';
                    cartStatusStyle.scale = '';
                }, 300);
            }, 300);
        }, 0);
    }, [hasCart, cartTotalQuantity]); // if the quantity changes => make an animation
    
    
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && hasCart && <ButtonIcon icon='shopping_cart' elmRef={cartTogglerRef} size='lg' onClick={handleToggleCart}>
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
                    
                    {navbarExpanded && hasCart && <ListItem className='cartBtn' {...basicVariantProps} elmRef={cartTogglerRef} actionCtrl={true} onClick={handleToggleCart}>
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