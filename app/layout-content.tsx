'use client'

// styles:
import {
    StylesCSR,
}                           from './StylesCSR'                  // client_side_rendering CSS (required)
import {
    StylesSSR,
}                           from './StylesSSR'                  // server_side_rendering CSS (optional)
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// themes:
import '@/theme.config'
import './layout-styles.scss'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// redux:
import {
    Provider,
}                           from 'react-redux'
import {
    PersistGate,
}                           from 'redux-persist/integration/react'

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// next-auth:
import {
    NextAuthSessionProvider,
}                           from './NextAuthSessionProvider'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // notification-components:
    Alert,
    
    
    
    // utility-components:
    FetchErrorTitle,
    FetchErrorMessage,
    DialogMessageProvider,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    SigninTabStateProvider,
}                           from '@/components/SignIn'
import {
    CartStateProvider,
    CartDialog,
}                           from '@/components/Cart'
import {
    SearchExplorerStateProvider,
}                           from '@/components/explorers/SearchExplorer'
import {
    Header,
}                           from './Header'
import {
    Footer,
}                           from './Footer'

// stores:
import {
    store,
    persistor,
}                           from '@/store/store'
import {
    // hooks:
    useSignedInCacheRefresh,
}                           from '@/store/features/api/hooks'

// states:
import {
    PageInterceptStateProvider,
}                           from '@/states/pageInterceptState'

// configs:
import {
    WEBSITE_LANGUAGE,
}                           from '@/website.config'



// styles:
const useDocumentStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './layout-styles')
, { id: 'edtsxmzhph' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// defaults:
const fetchErrorTitleDefault   : Extract<FetchErrorTitle  , Function> = ({isRequestError, isServerError, errorCode, context}) => {
    switch (context) {
        case 'order'               : return <h1>Error Processing Your Order</h1>;
        case 'payment'             : return <h1>Error Processing Your Payment</h1>;
        case 'paymentConfirmation' : return <h1>Error Processing Your Payment Confirmation</h1>;
        default                    : return <h1>Error</h1>;
    } // switch
};
const fetchErrorMessageDefault : Extract<FetchErrorMessage, Function> = ({isRequestError, isServerError, errorCode, context}) => <>
    {(errorCode !== 402) && <p>
        Oops, there was an error processing {
            ((): React.ReactNode => {
                switch (context) {
                    case 'order'               : return <>your order</>;
                    case 'payment'             : return <>your payment</>;
                    case 'paymentConfirmation' : return <>your payment confirmation</>;
                    default                    : return <>the command</>;
                } // switch
            })()
        }.
    </p>}
    {(errorCode === 402) && <>
        <p>
            Sorry, we were unable to process your payment.
        </p>
        <p>
            There was a <strong>problem authorizing your card</strong>.
            <br />
            Make sure your card is still valid and has not reached the transaction limit.
        </p>
        <p>
            Try using a different credit card and try again.
            <br />
            If the problem still persists, please change to another payment method.
        </p>
    </>}
    {isRequestError && <p>
        There was a <strong>problem contacting our server</strong>.
        <br />
        Make sure your internet connection is available.
    </p>}
    {isServerError && <p>
        There was a <strong>problem on our server</strong>.
        <br />
        The server may be busy or currently under maintenance.
    </p>}
    {isServerError && <p>
        Please try again in a few minutes.
        <br />
        If the problem still persists, please contact us manually.
    </p>}
    {(context === 'payment') && <Alert theme='warning' mild={false} expanded={true} controlComponent={null}>
        <p>
            Make sure your funds have not been deducted.<br />
            If you have, please contact us for assistance.
        </p>
    </Alert>}
</>;



// react components:
export function RootLayoutContent({
    children,
}: {
    children : React.ReactNode
}): JSX.Element|null {
    // styles:
    const styleSheet = useDocumentStyleSheet();
    
    
    
    // jsx:
    return (
        <html
            // classes:
            className={styleSheet.main}
            
            
            
            // metas:
            lang={WEBSITE_LANGUAGE}
        >
            <head>
                <StylesCSR />
                <StylesSSR />
            </head>
            <body>
                <NextAuthSessionProvider>
                    <SigninTabStateProvider>
                        <Provider store={store}><PersistGate persistor={persistor}>
                            <DialogMessageProvider
                                fetchErrorTitleDefault={fetchErrorTitleDefault}
                                fetchErrorMessageDefault={fetchErrorMessageDefault}
                            >
                                <PageInterceptStateProvider>
                                    <CartStateProvider>
                                        <SearchExplorerStateProvider>
                                                <RootLayoutContentInternal>
                                                    {children}
                                                </RootLayoutContentInternal>
                                        </SearchExplorerStateProvider>
                                    </CartStateProvider>
                                </PageInterceptStateProvider>
                            </DialogMessageProvider>
                        </PersistGate></Provider>
                    </SigninTabStateProvider>
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}
function RootLayoutContentInternal({
    children,
}: {
    children : React.ReactNode
}): JSX.Element|null {
    // stores:
    useSignedInCacheRefresh();
    
    
    
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
            <Header />
            
            <div ref={scrollerRef} className='main-scroller'>
                <div ref={shifterTopRef} />
                {children}
                <div ref={shifterBottomRef} />
            </div>
            <Footer elmRef={footerRef} />
            
            <CartDialog />
        </>
    );
}
