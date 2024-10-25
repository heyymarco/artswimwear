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



// react components:
export default function GoToPage({ params: { slugs } }: { params: { slugs: string[] } }): JSX.Element|null {
    // effects:
    const router = useRouter();
    useIsomorphicLayoutEffect(() => {
        const href = slugs.join('/');
        router.replace(`/${href}`);
    }, []);
    
    
    
    // jsx:
    return null;
}
