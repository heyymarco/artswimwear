'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // composite-components:
    Navbar,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals components:
import {
    SiteNavbarMenu,
}                           from './SiteNavbarMenu'



// react components:
const SiteNavbar = (): JSX.Element|null => {
    // jsx:
    return (
        <Navbar theme='primary' gradient={true} className='siteNavbar' breakpoint='md'>
            <SiteNavbarMenu />
        </Navbar>
    );
};
export {
    SiteNavbar,
    SiteNavbar as default,
}
