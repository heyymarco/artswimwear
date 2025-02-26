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
    
    const [signalPathnameUpdated] = useState<Map<string, (() => void)[]>>(() => new Map<string, (() => void)[]>());
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // actions:
    const router = useRouter();
    
    const restorePathnameAsync = useEvent(async (originPathname: string): Promise<void> => {
        if (originPathname.toLowerCase() === mayInterceptedPathname.toLowerCase()) return; // already the same => ignore
        
        
        
        // wait until the router is fully applied:
        const { promise: routerUpdatedPromise, resolve: routerUpdatedSignal } = Promise.withResolvers<void>();
        const signals = signalPathnameUpdated.get(originPathname) ?? (() => {
            const newSignals : (() => void)[] = [];
            signalPathnameUpdated.set(originPathname, newSignals);
            return newSignals;
        })();
        signals.push(routerUpdatedSignal); // register the signal for the desired pathname update
        
        router.push(originPathname, { scroll: false }); // go back to unintercepted pathName // do not scroll the page because it restores the unintercepted pathName
        
        await Promise.race([
            routerUpdatedPromise,
            setTimeoutAsync(1000), // assumes if the router is not updated within 1 second, it's failed
        ]);
    });
    
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
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        const signals = signalPathnameUpdated.get(mayInterceptedPathname);
        if (signals?.length) { // the pathname changes due to the interception
            // signal all the matched signals:
            for (const signal of signals) signal(); // signal updated
            signalPathnameUpdated.delete(mayInterceptedPathname); // remove the resolved signals
        }
        else { // the pathname changes due to the user's action
            // signal all the signals:
            for (const signals of signalPathnameUpdated.values()) {
                for (const signal of signals) signal(); // signal updated
            } // for
            signalPathnameUpdated.clear(); // remove all the signals
            
            // assumes all the interception is done:
            setOriginPathnameStack([]);
        } // if
    }, [mayInterceptedPathname]);
    
    
    
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
