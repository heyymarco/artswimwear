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



// contexts:
export type StartInterceptHandler = (callback: () => undefined|void|boolean|Promise<undefined|void|boolean>) => Promise<void>
export interface InterceptRouterState {
    // states:
    originPathname         : string|null
    nonInterceptedPathname : string
    isInInterception       : boolean
    
    
    
    // actions:
    interceptPush          : (...params: Parameters<ReturnType<typeof useRouter>['push']>) => Promise<boolean>
    interceptBack          : () => Promise<boolean>
    interceptForward       : () => Promise<boolean>
    
    startIntercept         : StartInterceptHandler
}
const InterceptRouterStateContext = createContext<InterceptRouterState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') InterceptRouterStateContext.displayName  = 'InterceptRouterState';



// hooks:
export const useInterceptRouter = (): InterceptRouterState => {
    const interceptRouterState = useContext(InterceptRouterStateContext);
    if (interceptRouterState === undefined) throw Error('Not in <InterceptRouterProvider>.');
    return interceptRouterState;
}



// react components:
export interface InterceptRouterProviderProps {
}
const InterceptRouterProvider = (props: React.PropsWithChildren<InterceptRouterProviderProps>): JSX.Element|null => {
    // states:
    const mayInterceptedPathname = usePathname();
    const [originPathnameStack, setOriginPathnameStack] = useState<string[]>([]);
    const originPathname: string|null = originPathnameStack?.[0] ?? null;
    const nonInterceptedPathname = (originPathname ?? mayInterceptedPathname);
    const isInInterception = (originPathname !== null);
    
    const [pathnameUpdatedSignals] = useState<(() => void)[]>(() => []);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // utilities:
    const router   = useRouter();
    const navigate = useEvent(async (action: () => void): Promise<boolean> => {
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
        return true;
    });
    
    
    
    // stable callbacks:
    const interceptPush    = useEvent<InterceptRouterState['interceptPush']>(async (pathname, options = { scroll: false /* do not scroll the page because it is the intercepting navigation */ }) => {
        // conditions:
        if (!isInInterception) return false; // not in interception => ignore
        if (pathname.toLowerCase() === mayInterceptedPathname.toLowerCase()) return true; // already the same => ignore
        
        
        
        // actions:
        return navigate(() => router.push(pathname, options));
    });
    const interceptBack    = useEvent<InterceptRouterState['interceptBack']>(async () => {
        // conditions:
        if (!isInInterception) return false; // not in interception => ignore
        
        
        
        // actions:
        return navigate(() => router.back());
    });
    const interceptForward = useEvent<InterceptRouterState['interceptForward']>(async () => {
        // conditions:
        if (!isInInterception) return false; // not in interception => ignore
        
        
        
        // actions:
        return navigate(() => router.forward());
    });
    
    const startIntercept   = useEvent<InterceptRouterState['startIntercept']>(async (callback) => {
        // stack up:
        setOriginPathnameStack((current) => [...current, mayInterceptedPathname]); // append a new item to the last
        try {
            await new Promise<void>((resolve) => setTimeout(resolve, 0)); // wait for the stack to be updated (already rerendered)
            const restorePathname = (await callback()) ?? true;
            if (restorePathname) await interceptPush(mayInterceptedPathname); // go back to unintercepted pathName
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
            setOriginPathnameStack((current) => current.length ? [] : current); // clear the stack
        } // if
    }, [mayInterceptedPathname]);
    
    
    
    // states:
    const interceptRouterState = useMemo<InterceptRouterState>(() => ({
        // states:
        originPathname,
        nonInterceptedPathname,
        isInInterception,
        
        
        
        // actions:
        interceptPush,
        interceptBack,
        interceptForward,
        
        startIntercept,
    }), [
        // states:
        originPathname,
        nonInterceptedPathname,
        isInInterception,
        
        
        
        // actions:
        // interceptPush,    // stable ref
        // interceptBack,    // stable ref
        // interceptForward, // stable ref
        
        // startIntercept,   // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <InterceptRouterStateContext.Provider value={interceptRouterState}>
            {props.children}
        </InterceptRouterStateContext.Provider>
    );
};
export {
    InterceptRouterProvider,
    InterceptRouterProvider as default,
}
