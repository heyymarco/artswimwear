'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'



// contexts:
export interface ScrollerState
{
    // refs:
    footerRef : React.MutableRefObject<HTMLElement|null>
}
const ScrollerStateContext = createContext<ScrollerState|undefined>(undefined);
if (process.env.NODE_ENV !== 'production') ScrollerStateContext.displayName  = 'ScrollerState';



// hooks:
export const useScrollerState = (): ScrollerState => {
    const scrollerState = useContext(ScrollerStateContext);
    if (scrollerState === undefined) throw Error('Not in <ScrollerStateProvider>.');
    return scrollerState;
}



// react components:
export interface ScrollerStateProps
{
}
const ScrollerStateProvider = (props: React.PropsWithChildren<ScrollerStateProps>): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // refs:
    const footerRef = React.useRef<HTMLElement|null>(null);
    
    
    
    // states:
    const scrollerState = useMemo<ScrollerState>(() => ({
        // refs:
        footerRef,
    }), [
        // refs:
        // footerRef, // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <ScrollerStateContext.Provider value={scrollerState}>
            {children}
        </ScrollerStateContext.Provider>
    );
};
export {
    ScrollerStateProvider,            // named export for readibility
    ScrollerStateProvider as default, // default export to support React.lazy
}
