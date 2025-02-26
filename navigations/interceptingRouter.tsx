// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useRef,
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

//#region interceptingRouter

// contexts:
export type StartInterceptHandler = (callback: () => undefined|void|boolean|Promise<undefined|void|boolean>) => Promise<void>
export interface InterceptingRouterState {
    // states:
    originPathname         : string|null
    nonInterceptedPathname : string
    
    
    
    // actions:
    interceptingPush       : (...params: Parameters<ReturnType<typeof useRouter>['push']>) => Promise<void>
    interceptingBack       : () => Promise<void>
    interceptingForward    : () => Promise<void>
    
    startIntercept         : StartInterceptHandler
}

const noopCallback = () => Promise.resolve<void>(undefined);
const defaultInterceptingRouterStateContext : InterceptingRouterState = {
    // states:
    originPathname         : null,
    nonInterceptedPathname : '/',
    
    
    
    // actions:
    interceptingPush       : noopCallback,
    interceptingBack       : noopCallback,
    interceptingForward    : noopCallback,
    
    startIntercept         : noopCallback,
}
const InterceptingRouterStateContext = createContext<InterceptingRouterState>(defaultInterceptingRouterStateContext);
InterceptingRouterStateContext.displayName  = 'InterceptingRouterState';

export const useInterceptingRouter = (): InterceptingRouterState => {
    return useContext(InterceptingRouterStateContext);
}



// react components:
export interface InterceptingRouterProviderProps {
}
const InterceptingRouterProvider = (props: React.PropsWithChildren<InterceptingRouterProviderProps>): JSX.Element|null => {
    // states:
    const mayInterceptedPathname = usePathname();
    const [originPathnameStack, setOriginPathnameStack] = useState<string[]>([]);
    const originPathname: string|null = originPathnameStack?.[0] ?? null;
    const nonInterceptedPathname = (originPathname ?? mayInterceptedPathname);
    
    const [pathnameUpdatedSignals] = useState<(() => void)[]>(() => []);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // utilities:
    const router   = useRouter();
    const navigate = useEvent(async (action: () => void): Promise<void> => {
        // create a signal for the pathname update:
        const { promise: routerUpdatedPromise, resolve: routerUpdatedSignal } = Promise.withResolvers<void>();
        pathnameUpdatedSignals.push(routerUpdatedSignal); // register the signal for the pathname update
        
        // do the work:
        action();
        
        // wait until the router is fully applied:
        await Promise.race([
            routerUpdatedPromise,
            setTimeoutAsync(1000), // assumes if the router is not updated within 1 second, it's failed
        ]);
    });
    
    
    
    // stable callbacks:
    const interceptingPush    = useEvent<InterceptingRouterState['interceptingPush']>(async (pathname, options = { scroll: false /* do not scroll the page because it is the intercepting navigation */ }) => {
        // conditions:
        if (originPathname === null) return; // not in interception => ignore
        if (pathname.toLowerCase() === mayInterceptedPathname.toLowerCase()) return; // already the same => ignore
        
        
        
        // actions:
        await navigate(() => router.push(pathname, options));
    });
    const interceptingBack    = useEvent<InterceptingRouterState['interceptingBack']>(async () => {
        // conditions:
        if (originPathname === null) return; // not in interception => ignore
        
        
        
        // actions:
        await navigate(() => router.back());
    });
    const interceptingForward = useEvent<InterceptingRouterState['interceptingForward']>(async () => {
        // conditions:
        if (originPathname === null) return; // not in interception => ignore
        
        
        
        // actions:
        await navigate(() => router.forward());
    });
    
    const startIntercept      = useEvent<InterceptingRouterState['startIntercept']>(async (callback) => {
        // stack up:
        setOriginPathnameStack((current) => [...current, mayInterceptedPathname]); // append a new item to the last
        try {
            const restorePathname = (await callback()) ?? true;
            if (restorePathname) await interceptingPush(mayInterceptedPathname); // go back to unintercepted pathName
        }
        finally {
            // stack down:
            setOriginPathnameStack((current) => current.length ? current.slice(0, -1) : current); // remove the last item (if any)
        } // try
    });
    
    
    
    // effects:
    
    // Detects whether the pathname changes due to the interception or the user's action:
    const prevMayInterceptedPathnameRef = useRef<string|null>(mayInterceptedPathname);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (prevMayInterceptedPathnameRef.current === mayInterceptedPathname) return; // already the same => ignore
        prevMayInterceptedPathnameRef.current = mayInterceptedPathname;               // sync
        
        
        
        // actions:
        if (pathnameUpdatedSignals.length) { // the pathname changes due to the interception
            // signal that the pathname has been updated:
            for (const pathnameUpdatedSignal of pathnameUpdatedSignals) pathnameUpdatedSignal();
            
            // clear all the resolved signals:
            pathnameUpdatedSignals.splice(0);
        }
        else { // the pathname changes due to the user's action
            // assumes all the interceptions are canceled:
            setOriginPathnameStack([]);
        } // if
    }, [mayInterceptedPathname]);
    
    
    
    // states:
    const interceptingRouterState = useMemo<InterceptingRouterState>(() => ({
        // states:,
        originPathname,
        nonInterceptedPathname,
        
        
        
        // actions:
        interceptingPush,
        interceptingBack,
        interceptingForward,
        
        startIntercept,
    }), [
        // states:,
        originPathname,
        nonInterceptedPathname,
        
        
        
        // actions:
        // interceptingPush,    // stable ref
        // interceptingBack,    // stable ref
        // interceptingForward, // stable ref
        
        // startIntercept,      // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <InterceptingRouterStateContext.Provider value={interceptingRouterState}>
            {props.children}
        </InterceptingRouterStateContext.Provider>
    );
};
export {
    InterceptingRouterProvider,
    InterceptingRouterProvider as default,
}
//#endregion interceptingRouter
