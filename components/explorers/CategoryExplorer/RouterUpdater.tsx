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
export interface RouterUpdaterProps {
    // handlers:
    onClose ?: ((navigated: boolean) => void)   
}
const RouterUpdater = (props: RouterUpdaterProps): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const {
        // states:
        parentCategories,
    } = useCategoryExplorerState();
    
    
    
    // effects:
    
    // sync the pathname to '/categories/**':
    const pathname                      = usePathname();
    const router                        = useRouter();
    const prevParentCategoriesRef       = useRef<CategoryParentInfo[]|undefined>(undefined /* initially unsynced */);
    const [historyUrls, setHistoryUrls] = useImmer<string[]>(() => [pathname]);
    useEffect(() => {
        // conditions:
        if (prevParentCategoriesRef.current === parentCategories) return; // already the same => ignore
        prevParentCategoriesRef.current = parentCategories;               // sync
        
        
        
        // actions:
        const newPathname = `${categoriesPath}${!parentCategories.length ? '' : `/${parentCategories.map(({category: {path}}) => path).join('/')}`}`;
        if (newPathname.toLowerCase() !== pathname.toLowerCase()) {
            const backPathname = (historyUrls.length < 2) ? undefined : historyUrls.at(-2);
            if (newPathname === backPathname) { // if a back action detected
                setHistoryUrls((historyUrls) => {
                    historyUrls.pop();
                });
                router.back();
            }
            else {
                setHistoryUrls((historyUrls) => {
                    historyUrls.push(newPathname);
                });
                router.push(newPathname, { scroll: false }); // change the pathName for accessibility reason // do not scroll the page because it just change the pathName for accessibility reason
            } // if
        } // if
    }, [parentCategories, pathname]);
    
    // Closes the dropdown if the `pathname` exits from '/categories/**':
    const hasOpenedRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        const isInDropdown = pathname.startsWith(categoriesPath) && ['', '/'].includes(pathname.slice(categoriesPath.length, categoriesPath.length + 1)); // determines if the `pathname` is exact '/categories' or sub '/categories/**'
        if (!hasOpenedRef.current) { // only interested if the pathname is never entered to '/categories/**'
            if (isInDropdown) hasOpenedRef.current = true; // mark ever entered to '/categories/**'
            return; // returns earlier
        } // if
        
        
        
        // actions:
        if (!isInDropdown) { // the `pathname` exits from '/categories/**'
            onClose?.(true);
        } // if
    }, [pathname]);
    
    
    
    // jsx:
    return null;
};
export {
    RouterUpdater,
    RouterUpdater as default,
}
