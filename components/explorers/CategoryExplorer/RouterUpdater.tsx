'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// models:
import {
    // types:
    type CategoryParentInfo,
}                           from '@/models'

// internals:
import {
    // states:
    useCategoryExplorerState,
}                           from './states/categoryExplorerState'

// configs:
import {
    categoriesPath,
}                           from './configs'



// react components:
const RouterUpdater = (): JSX.Element|null => {
    // states:
    const {
        // states:
        parentCategories,
    } = useCategoryExplorerState();
    
    
    
    // effects:
    // sync the pathname to the path of selected category:
    const pathname                = usePathname();
    const router                  = useRouter();
    const prevParentCategoriesRef = useRef<CategoryParentInfo[]|undefined>(undefined /* initially unsynced */);
    useEffect(() => {
        // conditions:
        if (prevParentCategoriesRef.current === parentCategories) return; // already the same => ignore
        const prevParentCategories = prevParentCategoriesRef.current;
        prevParentCategoriesRef.current = parentCategories;               // sync
        if (!parentCategories.length) return; // the root category is not yet selected or loaded => ignore
        
        
        
        // actions:
        const oldPathname = !prevParentCategories ? undefined : `${categoriesPath}/${prevParentCategories.map(({category: {path}}) => path).join('/')}`;
        const newPathname = `${categoriesPath}/${parentCategories.map(({category: {path}}) => path).join('/')}`;
        if (newPathname.toLowerCase() !== pathname.toLowerCase()) {
            if ((prevParentCategories?.length === (parentCategories.length + 1)) && ((): boolean => { // if a back action detected
                for (let index = 0, maxIndex = parentCategories.length - 1; index <= maxIndex; index++) {
                    if (parentCategories[index] !== prevParentCategories[index]) return false;
                } // for
                return (pathname.toLowerCase() === oldPathname?.toLowerCase());
            })()) {
                router.back();
            }
            else {
                router.push(newPathname, { scroll: false }); // intercept the url
            } // if
        } // if
    }, [parentCategories, pathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}
