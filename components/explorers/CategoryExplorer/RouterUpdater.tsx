'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'
import {
    useImmer,
}                           from 'use-immer'

// next-js:
import {
    usePathname,
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

// states:
import {
    useInterceptingRouter,
}                           from '@/navigations/interceptingRouter'

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
    
    const mayInterceptedPathname = usePathname();
    const {
        // actions:
        interceptingPush,
        interceptingBack,
    } = useInterceptingRouter();
    
    
    
    // effects:
    
    // sync the mayInterceptedPathname to '/categories/**':
    const prevParentCategoriesRef       = useRef<CategoryParentInfo[]|undefined>(undefined /* initially unsynced */);
    const [historyUrls, setHistoryUrls] = useImmer<string[]>(() => [mayInterceptedPathname]);
    useEffect(() => {
        // conditions:
        if (prevParentCategoriesRef.current === parentCategories) return; // already the same => ignore
        prevParentCategoriesRef.current = parentCategories;               // sync
        
        
        
        // actions:
        const newPathname = `${categoriesPath}${!parentCategories.length ? '' : `/${parentCategories.map(({category: {path}}) => path).join('/')}`}`;
        if (newPathname.toLowerCase() !== mayInterceptedPathname.toLowerCase()) {
            const backPathname = (historyUrls.length < 2) ? undefined : historyUrls.at(-2);
            if (newPathname === backPathname) { // if a back action detected
                setHistoryUrls((historyUrls) => {
                    historyUrls.pop();
                });
                interceptingBack();
            }
            else {
                setHistoryUrls((historyUrls) => {
                    historyUrls.push(newPathname);
                });
                interceptingPush(newPathname); // change the pathName for accessibility reason
            } // if
        } // if
    }, [parentCategories, mayInterceptedPathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}
