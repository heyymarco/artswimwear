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
    useRef,
}                           from 'react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useSetTimeout,
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
    const signalPathnameUpdated = useRef<(() => void)|undefined>(undefined);
    useIsomorphicLayoutEffect(() => {
        signalPathnameUpdated.current?.(); // signal updated
        signalPathnameUpdated.current = undefined;
    }, [pathname]);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // actions:
    const router = useRouter();
    const startIntercept = useEvent<PageInterceptState['startIntercept']>(async (callback) => {
        setOriginPathname(pathname);
        const restorePathname = (await callback(pathname)) ?? true;
        if (restorePathname) {
            await restorePathnameAsync(pathname);
            
            
            
            // reset the intercepting state:
            setOriginPathname(null);
        }
        else {
            // reset the intercepting state:
            setOriginPathname(null);
        } // if
    });
    const restorePathnameAsync = useEvent(async (originPathname: string): Promise<void> => {
        if (originPathname.toLowerCase() === pathname.toLowerCase()) return; // already the same => ignore
        
        
        
        // wait until the router is fully applied:
        const { promise: routerUpdatedPromise, resolve: routerUpdatedSignal } = Promise.withResolvers<void>();
        signalPathnameUpdated.current = routerUpdatedSignal;
        
        router.push(originPathname, { scroll: false });
        
        await Promise.race([
            routerUpdatedPromise,
            setTimeoutAsync(100),
        ]);
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
