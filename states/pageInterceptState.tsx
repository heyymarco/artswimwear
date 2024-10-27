// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useState,
}                           from 'react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// hooks:

// states:

//#region pageInterceptState

// contexts:
export interface PageInterceptState {
    // states:
    originPathname : string|null
    
    
    
    // actions:
    startIntercept : (callback: (backPathname: string) => undefined|void|boolean|Promise<undefined|void|boolean>) => Promise<void>
}

const noopCallback = () => Promise.resolve<void>(undefined);
const defaultPageInterceptStateContext : PageInterceptState = {
    // states:
    originPathname : null,
    
    
    
    // actions:
    startIntercept : noopCallback,
}
const PageInterceptStateContext = createContext<PageInterceptState>(defaultPageInterceptStateContext);
PageInterceptStateContext.displayName  = 'PageInterceptState';

export const usePageInterceptState = (): PageInterceptState => {
    return useContext(PageInterceptStateContext);
}



// react components:
export interface PageInterceptStateProps {
}
const PageInterceptStateProvider = (props: React.PropsWithChildren<PageInterceptStateProps>): JSX.Element|null => {
    // states:
    const pathname = usePathname();
    const [originPathname, setOriginPathname] = useState<string|null>(null);
    
    
    
    // actions:
    const router = useRouter();
    const startIntercept = useEvent<PageInterceptState['startIntercept']>(async (callback) => {
        setOriginPathname(pathname);
        const restorePathname = (await callback(pathname)) ?? true;
        if (restorePathname) {
            router.push(pathname, { scroll: false });
        } // if
        setOriginPathname(null);
    });
    
    
    
    // states:
    const pageInterceptState = useMemo<PageInterceptState>(() => ({
        // states:,
        originPathname,
        
        
        
        // actions:
        startIntercept,
    }), [
        // states:,
        originPathname,
        
        
        
        // actions:
        // startIntercept, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <PageInterceptStateContext.Provider value={pageInterceptState}>
            {props.children}
        </PageInterceptStateContext.Provider>
    );
};
export {
    PageInterceptStateProvider,
    PageInterceptStateProvider as default,
}
//#endregion pageInterceptState
