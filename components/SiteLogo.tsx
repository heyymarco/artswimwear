'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'



// react components:
const SiteLogo = () => {
    // jsx:
    return (
        <Link href='/'>
            <Icon
                // appearances:
                icon='artswimwear'
                
                
                
                // variants:
                size='xl'
            />
        </Link>
    );
};
export {
    SiteLogo,
    SiteLogo as default,
}
