'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    Footer,
}                           from './Footer'



export interface ScrollerProps {
    children ?: React.ReactNode
}
export const Scroller = (props: ScrollerProps): JSX.Element|null => {
    // props:
    const {
        children,
    } = props;
    
    
    
    // refs:
    const scrollerRef            = useRef<HTMLDivElement|null>(null);
    const shifterTopRef          = useRef<HTMLDivElement|null>(null);
    const shifterBottomRef       = useRef<HTMLDivElement|null>(null);
    const scrollingContentRef    = useRef<HTMLDivElement|null>(null);
    const footerRef              = useRef<HTMLElement|null>(null);
    const delayedScrollUpdateRef = useRef<ReturnType<typeof requestAnimationFrame>|null>(null);
    
    
    
    // handlers:
    const footerIntrinsicHeightRef  = useRef<null|number>(null); // `null`: no auto_size <Footer>, `number`: has auto_size <Footer> with known <Footer>'s intrinsic height
    const measureScrollingBehaviors = useEvent((): void => {
        // conditions:
        const scrollerElm      = scrollerRef.current;
        const shifterTopElm    = shifterTopRef.current;
        const shifterBottomElm = shifterBottomRef.current;
        const footerElm        = footerRef.current;
        if (!scrollerElm || !shifterTopElm || !shifterBottomElm || !footerElm) return;
        
        
        
        // backups:
        const prevShifterTopSize    = shifterTopElm.style.blockSize;
        const prevShifterBottomSize = shifterBottomElm.style.blockSize;
        const prevBlockSize         = footerElm.style.blockSize;
        
        
        
        // re-conditions:
        shifterTopElm.style.blockSize     = '';
        shifterBottomElm.style.blockSize  = '';
        footerElm.style.blockSize         = '';
        
        
        
        // calcuations:
        const scrollingDistance           = scrollerElm.scrollHeight - scrollerElm.clientHeight;
        const hasScrollbar                = (scrollingDistance > 0.5);
        if (hasScrollbar) {
            const footerIntrinsicHeight = footerElm.getBoundingClientRect().height;
            footerIntrinsicHeightRef.current = footerIntrinsicHeight;
        }
        else {
            footerIntrinsicHeightRef.current = null;
        } // if
        
        
        
        // restores:
        shifterTopElm.style.blockSize     = prevShifterTopSize;
        shifterBottomElm.style.blockSize  = prevShifterBottomSize;
        footerElm.style.blockSize         = prevBlockSize;
    });
    
    const prevFooterHeightRef       = useRef<number|null>(null);
    const updateFooterHeight        = useEvent((): void => {
        // conditions:
        const scrollerElm      = scrollerRef.current;
        const shifterTopElm    = shifterTopRef.current;
        const shifterBottomElm = shifterBottomRef.current;
        const footerElm        = footerRef.current;
        if (!scrollerElm || !shifterTopElm || !shifterBottomElm || !footerElm) return;
        
        
        
        // conditions:
        const footerIntrinsicHeight       = footerIntrinsicHeightRef.current;
        const hasScrollbar                = (footerIntrinsicHeight !== null);
        if (!hasScrollbar) {
            // diffings:
            if (prevFooterHeightRef.current === null) return; // auto_size <Footer> is already disabled => ingore
            prevFooterHeightRef.current = null; // mark the auto_size <Footer> is already disabled
            
            
            
            // updates:
            shifterTopElm.style.blockSize    = '';
            shifterBottomElm.style.blockSize = '';
            footerElm.style.blockSize        = '';
            return;
        } // if
        
        
        
        // calculations:
        const scrollingDistance           = scrollerElm.scrollHeight - scrollerElm.clientHeight;
        const scrollTop                   = scrollerElm.scrollTop;
        const restScrollingDistance       = scrollingDistance - scrollTop;
        const footerHeight                = footerIntrinsicHeight - Math.min(footerIntrinsicHeight, restScrollingDistance);
        
        
        
        // diffings:
        if (prevFooterHeightRef.current === footerHeight) return; // already the same to prev => ignore
        const diffScrolling               = footerHeight - (prevFooterHeightRef.current ?? footerHeight);
        prevFooterHeightRef.current       = footerHeight;
        
        
        
        // updates:
        const shifterBottomHeight         = footerIntrinsicHeight - footerHeight;
        
        if (diffScrolling) {
            const expectedScrollToInTheFuture = scrollTop + diffScrolling;
            
            // Cancel the previous animation frame request, if any, to prevent conflicts:
            if (delayedScrollUpdateRef.current !== null) cancelAnimationFrame(delayedScrollUpdateRef.current);
            
            // Use requestAnimationFrame to synchronize with the browser's rendering cycle:
            delayedScrollUpdateRef.current = requestAnimationFrame(() => {
                scrollerElm.scrollTop = expectedScrollToInTheFuture;
            });
        } // if
        
        shifterTopElm.style.blockSize     = `${footerHeight}px`;
        shifterBottomElm.style.blockSize  = `${shifterBottomHeight}px`;
        footerElm.style.blockSize         = `${footerHeight}px`;
    });
    
    
    
    // effects:
    
    /* 
     * Calculate <Footer> size once at startup:
     * We use `useIsomorphicLayoutEffect` to call `measureScrollingBehaviors()` as quickly as possible *before* the browser has a chance to repaint the page.
     * This ensures that the initial measurements are taken synchronously to prevent any potential flicker or layout shifts.
     */
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to `measureScrollingBehaviors()` as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        // setups:
        measureScrollingBehaviors();
    }, []);
    
    /* 
     * Monitor content size changes with ResizeObserver:
     * The ResizeObserver is used to monitor changes in the size of the .scrolling-content element.
     * This observer will trigger the measureScrollingBehaviors() function whenever the content size changes,
     * including when new content is loaded, or existing content is resized. This ensures that the footer height
     * is recalculated to accommodate the new content size. The observer is set to use the 'border-box' option,
     * which means it observes changes to the entire element's size, including content, padding, and border.
     * The initial invocation of the observer will also call the measureScrollingBehaviors() function to set up
     * the initial measurements. However, note that the initial invocation may be called *after* the browser has
     * already painted the page.
     */
    // We use `useEffect` instead of `useIsomorphicLayoutEffect` to setup `ResizeObserver` to set up `ResizeObserver` because the initial invocation of the observer may occur after the browser has already painted the page. Using `useEffect` allows the setup to run asynchronously after the initial render, which is sufficient for observing subsequent content size changes.
    useEffect(() => {
        // conditions:
        const scrollingContentElm = scrollingContentRef.current;
        if (!scrollingContentElm) return;
        
        
        
        // setups:
        const observer = new ResizeObserver(() => {
            measureScrollingBehaviors();
            updateFooterHeight(); // update the <Footer>'s height based on <Scroller>'s scroll position
        });
        observer.observe(scrollingContentElm, { box: 'border-box' });
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, []);
    
    // Monitor scrollbar position changes with `scroll` event:
    // We use `useEffect` instead of `useIsomorphicLayoutEffect` to `updateFooterHeight()` because the user won't be scrolling the page immediately, so an asynchronous update is sufficient.
    useEffect(() => {
        // conditions:
        const scrollerElm = scrollerRef.current;
        if (!scrollerElm) return;
        
        
        
        // setups:
        scrollerElm.addEventListener('scroll', updateFooterHeight);
        
        
        
        // cleanups:
        return () => {
            scrollerElm.removeEventListener('scroll', updateFooterHeight);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <>
            <div ref={scrollerRef} className='main-scroller'>
                <div ref={shifterTopRef} />
                <div ref={scrollingContentRef} className='scrolling-content'>
                    {children}
                </div>
                <div ref={shifterBottomRef} />
            </div>
            <Footer elmRef={footerRef} />
        </>
    );
};
