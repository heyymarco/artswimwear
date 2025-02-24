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
    originPathname         : string|null
    nonInterceptedPathname : string
    
    
    
    // actions:
    startIntercept         : (callback: () => undefined|void|boolean|Promise<undefined|void|boolean>) => Promise<void>
}

const noopCallback = () => Promise.resolve<void>(undefined);
const defaultPageInterceptStateContext : PageInterceptState = {
    // states:
    originPathname         : null,
    nonInterceptedPathname : '/',
    
    
    
    // actions:
    startIntercept         : noopCallback,
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
    const mayInterceptedPathname = usePathname();
    const [originPathnameStack, setOriginPathnameStack] = useState<string[]>([]);
    const originPathname: string|null = originPathnameStack?.[0] ?? null;
    const nonInterceptedPathname = (originPathname ?? mayInterceptedPathname);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // actions:
    const router = useRouter();
    
    const signalPathnameUpdated = useRef<(() => void)|undefined>(undefined);
    const restorePathnameAsync = useEvent(async (originPathname: string): Promise<void> => {
        if (originPathname.toLowerCase() === mayInterceptedPathname.toLowerCase()) return; // already the same => ignore
        
        
        
        // wait until the router is fully applied:
        const { promise: routerUpdatedPromise, resolve: routerUpdatedSignal } = Promise.withResolvers<void>();
        signalPathnameUpdated.current = routerUpdatedSignal;
        
        router.push(originPathname, { scroll: false }); // go back to unintercepted pathName // do not scroll the page because it restores the unintercepted pathName
        
        await Promise.race([
            routerUpdatedPromise,
            setTimeoutAsync(100),
        ]);
    });
    useIsomorphicLayoutEffect(() => {
        signalPathnameUpdated.current?.(); // signal updated
        signalPathnameUpdated.current = undefined;
    }, [mayInterceptedPathname]);
    
    const startIntercept = useEvent<PageInterceptState['startIntercept']>(async (callback) => {
        // stack up:
        setOriginPathnameStack((current) => [...current, mayInterceptedPathname]); // append a new item to the last
        try {
            const restorePathname = (await callback()) ?? true;
            if (restorePathname) await restorePathnameAsync(mayInterceptedPathname);
        }
        finally {
            // stack down:
            setOriginPathnameStack((current) => current.length ? current.slice(0, -1) : current); // remove the last item (if any)
        } // try
    });
    
    
    
    // states:
    const pageInterceptState = useMemo<PageInterceptState>(() => ({
        // states:,
        originPathname,
        nonInterceptedPathname,
        
        
        
        // actions:
        startIntercept,
    }), [
        // states:,
        originPathname,
        nonInterceptedPathname,
        
        
        
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
