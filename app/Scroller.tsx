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
    const scrollerRef         = useRef<HTMLDivElement|null>(null);
    const shifterTopRef       = useRef<HTMLDivElement|null>(null);
    const shifterBottomRef    = useRef<HTMLDivElement|null>(null);
    const scrollingContentRef = useRef<HTMLDivElement|null>(null);
    const footerRef           = useRef<HTMLElement|null>(null);
    
    
    
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
        shifterTopElm.style.blockSize    = '';
        shifterBottomElm.style.blockSize = '';
        footerElm.style.blockSize        = '';
        
        
        
        // calcuations:
        const scrollingDistance          = scrollerElm.scrollHeight - scrollerElm.clientHeight;
        const hasScrollbar               = (scrollingDistance > 0.5);
        if (hasScrollbar) {
            const footerIntrinsicHeight = footerElm.getBoundingClientRect().height;
            footerIntrinsicHeightRef.current = footerIntrinsicHeight;
        }
        else {
            footerIntrinsicHeightRef.current = null;
        } // if
        
        
        
        // restores:
        shifterTopElm.style.blockSize    = prevShifterTopSize;
        shifterBottomElm.style.blockSize = prevShifterBottomSize;
        footerElm.style.blockSize        = prevBlockSize;
    });
    
    const prevFooterHeightRef       = useRef<number>(-1);
    const updateFooterHeight        = useEvent((): void => {
        // conditions:
        const scrollerElm      = scrollerRef.current;
        const shifterTopElm    = shifterTopRef.current;
        const shifterBottomElm = shifterBottomRef.current;
        const footerElm        = footerRef.current;
        if (!scrollerElm || !shifterTopElm || !shifterBottomElm || !footerElm) return;
        
        
        
        // conditions:
        const footerIntrinsicHeight      = footerIntrinsicHeightRef.current;
        const hasScrollbar               = (footerIntrinsicHeight != null);
        if (!hasScrollbar) {
            // diffings:
            if (prevFooterHeightRef.current === -1) return; // dynamic <Footer> is already disabled => ingore
            prevFooterHeightRef.current = -1; // mark the <Footer> is already disabled
            
            
            
            // updates:
            shifterTopElm.style.blockSize    = '';
            shifterBottomElm.style.blockSize = '';
            footerElm.style.blockSize        = '';
            return;
        } // if
        
        
        
        // calculations:
        const scrollingDistance          = scrollerElm.scrollHeight - scrollerElm.clientHeight;
        const scrollTop                  = scrollerElm.scrollTop;
        const restScrollingDistance      = scrollingDistance - scrollTop;
        const footerHeight               = footerIntrinsicHeight - Math.min(footerIntrinsicHeight, restScrollingDistance);
        
        
        
        // diffings:
        if (prevFooterHeightRef.current === footerHeight) return; // already the same to prev => ignore
        const diffScrolling              = footerHeight - (prevFooterHeightRef.current ?? footerHeight);
        prevFooterHeightRef.current      = footerHeight;
        
        
        
        // updates:
        const shifterBottomHeight        = footerIntrinsicHeight - footerHeight;
        
        scrollerElm.scrollTop            = scrollTop + diffScrolling;
        shifterTopElm.style.blockSize    = `${footerHeight}px`;
        shifterBottomElm.style.blockSize = `${shifterBottomHeight}px`;
        footerElm.style.blockSize        = `${footerHeight}px`;
    });
    
    
    
    // effects:
    
    // Calculate <Footer> size once at startup:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to `measureScrollingBehaviors()` as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        // setups:
        measureScrollingBehaviors();
    }, []);
    
    // Monitor content size changes with ResizeObserver:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to `measureScrollingBehaviors()` as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
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
