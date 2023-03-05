import Link from 'next/link';
import { ButtonIcon, Collapse, HamburgerMenuButton, Icon, List, ListItem, Nav, NavbarParams, navbars, NavItem } from '@reusable-ui/components';
import { selectCartTotalQuantity, toggleCart } from '@/store/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEvent } from '@reusable-ui/core';




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
    const dispatch = useDispatch();
    const handleToggleCart = useEvent(() => {
        dispatch(toggleCart());
    });
    
    
    return (
        <>
            <SiteLogo />
            
            {!navbarExpanded && <ButtonIcon icon='shopping_cart' size='lg' onClick={handleToggleCart} />}
            
            {!navbarExpanded && !!cartTotalQuantity && <HamburgerMenuButton {...basicVariantProps} className='toggler' active={listExpanded} onClick={handleClickToToggleList} />}
            
            <Collapse className='list' mainClass={navbarExpanded ? '' : undefined} expanded={listExpanded}>
                <Nav tag='ul' role='' {...basicVariantProps} orientation={navbarExpanded ? 'inline' : 'block'} listStyle='flat' gradient={navbarExpanded ? 'inherit' : false}>
                    <NavItem><Link href='/'>Home</Link></NavItem>
                    <NavItem><Link href='/products'>Products</Link></NavItem>
                    <NavItem><Link href='/about'>About</Link></NavItem>
                    <NavItem><Link href='/contact'>Contact Us</Link></NavItem>
                    <NavItem href='https://www.instagram.com/'><Icon icon='instagram' size='lg' /></NavItem>
                    
                    {navbarExpanded && !!cartTotalQuantity && <ListItem className='cartBtn' {...basicVariantProps} actionCtrl={true} onClick={handleToggleCart}>
                        <Icon icon='shopping_cart' size='lg' />
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