import React  from 'react';

import { Navbar, navbarValues } from '@reusable-ui/components'
import SiteNavbarMenu from './SiteNavbarMenu';



navbarValues.boxSizing = 'border-box';
navbarValues.blockSize = '4rem';



const SiteNavbar = () => {
    return (
        <Navbar theme='primary' gradient={true} className='siteNavbar' breakpoint='md'>{(params) =>
            <SiteNavbarMenu {...params} />
        }</Navbar>
    );
}
export {
    SiteNavbar,
    SiteNavbar as default,
}
