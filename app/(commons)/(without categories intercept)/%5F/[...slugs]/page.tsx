'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    LoadingBlankPage,
}                           from '@/components/BlankPage'



// react components:
export default function GoToPage(props: { params: { slugs: string[] } }): JSX.Element|null {
    // props:
    const {
        params: {
            slugs,
        },
    } = props;
    const pathname = `/${slugs.join('/')}`;
    
    
    
    // effects:
    const router = useRouter();
    useIsomorphicLayoutEffect(() => {
        router.replace(pathname);
    }, []);
    
    
    
    // jsx:
    return (
        <LoadingBlankPage
            // identifiers:
            key='busy' // avoids re-creating a similar dom during loading transition in different components
        />
    );
}
