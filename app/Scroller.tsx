'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
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
    const scrollerRef = useRef<HTMLDivElement|null>(null);
    const footerRef   = useRef<HTMLElement|null>(null);
    const shifterBottomRef  = useRef<HTMLDivElement|null>(null);
    const shifterTopRef  = useRef<HTMLDivElement|null>(null);
    
    
    
    // effects:
    const maxFooterHeightRef = useRef<number>(0);
    const calculateFooterHeight = useEvent((forceRefresh: boolean = false): void => {
        // conditions:
        const scrollerElm      = scrollerRef.current;
        const footerElm        = footerRef.current;
        const shifterTopElm    = shifterTopRef.current;
        const shifterBottomElm = shifterBottomRef.current;
        if (!scrollerElm || !footerElm || !shifterTopElm || !shifterBottomElm) return;
        
        
        
        // calcuations:
        const prevBlockSize         = forceRefresh ? '' : footerElm.style.blockSize;
        const prevShifterTopSize    = shifterTopElm.style.blockSize;
        const prevShifterBottomSize = shifterBottomElm.style.blockSize;
        
        footerElm.style.blockSize        = '';
        shifterTopElm.style.blockSize    = '';
        shifterBottomElm.style.blockSize = '';
        
        const maxFooterHeight = footerElm.getBoundingClientRect().height;
        maxFooterHeightRef.current = maxFooterHeight;
        
        
        
        // updates:
        const scrollingDistance          = scrollerElm.scrollHeight - scrollerElm.clientHeight;
        const hasScrollbar               = (scrollingDistance > 0.5);
        const footerHeightStr = prevBlockSize || (() => {
            if (scrollingDistance <= maxFooterHeight) return `${maxFooterHeight}px`;
            return '0px';
        })();
        footerElm.style.blockSize        = footerHeightStr;
        shifterTopElm.style.blockSize    = hasScrollbar ? (forceRefresh ? '0px'                  : prevShifterTopSize   ) : '';
        shifterBottomElm.style.blockSize = hasScrollbar ? (forceRefresh ? `${maxFooterHeight}px` : prevShifterBottomSize) : '';
    });
    
    useEffect(() => {
        // conditions:
        const scrollerElm      = scrollerRef.current;
        const footerElm        = footerRef.current;
        const shifterTopElm    = shifterTopRef.current;
        const shifterBottomElm = shifterBottomRef.current;
        if (!scrollerElm || !footerElm || !shifterTopElm || !shifterBottomElm) return;
        
        
        
        // states:
        let prevFooterHeight : number|undefined = undefined;
        
        
        
        // handlers:
        const handleScroll = () => {
            // calcuations:
            const scrollingDistance          = scrollerElm.scrollHeight - scrollerElm.clientHeight;
            const hasScrollbar               = (scrollingDistance > 0.5);
            if (!hasScrollbar) {
                // footerElm.style.blockSize        = ''; // no need to update for performance reason, should already done in `calculateFooterHeight()`
                // shifterTopElm.style.blockSize    = ''; // no need to update for performance reason, should already done in `calculateFooterHeight()`
                // shifterBottomElm.style.blockSize = ''; // no need to update for performance reason, should already done in `calculateFooterHeight()`
                return;
            } // if
            const scrollTop                  = scrollerElm.scrollTop;
            const restScrollingDistance      = scrollingDistance - scrollTop;
            const maxFooterHeight            = maxFooterHeightRef.current;
            const footerHeight               = maxFooterHeight - Math.min(maxFooterHeight, restScrollingDistance);
            
            
            
            // diffings:
            if (prevFooterHeight === footerHeight) return; // already the same to prev => ignore
            const diffScrolling              = footerHeight - (prevFooterHeight ?? footerHeight);
            prevFooterHeight                 = footerHeight;
            
            
            
            // updates:
            const shifterBottomHeight        = maxFooterHeight - footerHeight;
            footerElm.style.blockSize        = `${footerHeight}px`;
            shifterTopElm.style.blockSize    = `${footerHeight}px`;
            shifterBottomElm.style.blockSize = `${shifterBottomHeight}px`;
            scrollerElm.scrollTop            = scrollTop + diffScrolling;
        }
        
        
        
        // setups:
        scrollerElm.addEventListener('scroll', handleScroll);
        
        
        
        // cleanups:
        return () => {
            scrollerElm.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const pathName = usePathname();
    useEffect(() => {
        // setups:
        calculateFooterHeight(true);
    }, [pathName]); // non-delayed refresh after soft navigation
    
    useEffect(() => {
        // setups:
        const delayedCalculation = setTimeout(() => {
            calculateFooterHeight(true);
        }, 1000);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(delayedCalculation);
        };
    }, []); // delayed refresh after hard navigation
    
    
    
    // jsx:
    return (
        <>
            <div ref={scrollerRef} className='main-scroller'>
                <div ref={shifterTopRef} />
                {children}
                <div ref={shifterBottomRef} />
            </div>
            <Footer elmRef={footerRef} />
        </>
    );
};
