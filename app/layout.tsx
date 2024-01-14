'use client'

// themes:
import '@/theme.config'
import './layout-styles.scss'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import {
    Provider,
}                           from 'react-redux'
import {
    PersistGate,
}                           from 'redux-persist/integration/react'

// next-auth:
import {
    NextAuthSessionProvider,
}                           from './NextAuthSessionProvider'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook
import {
    StylesCSR,
}                           from './StylesCSR'                  // client_side_rendering CSS (required)
import {
    StylesSSR,
}                           from './StylesSSR'                  // server_side_rendering CSS (optional)

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
    CartStateProvider,
    CartDialog,
}                           from '@/components/Cart'
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

// configs:
import {
    WEBSITE_LANGUAGE,
}                           from '@/website.config'



// styles:
const useDocumentStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './layout-styles')
, { id: 'edtsxmzhph' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './layout-styles';



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
    {(context === 'payment') && <Alert theme='warning' mild={false} expanded={true} controlComponent={<></>}>
        <p>
            Make sure your funds have not been deducted.<br />
            If you have, please contact us for assistance.
        </p>
    </Alert>}
</>;



// react components:
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
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
                    <Provider store={store}><PersistGate persistor={persistor}>
                        <DialogMessageProvider
                            fetchErrorTitleDefault={fetchErrorTitleDefault}
                            fetchErrorMessageDefault={fetchErrorMessageDefault}
                        >
                            <CartStateProvider>
                                <Header />
                                
                                {children}
                                
                                <Footer />
                                
                                <CartDialog />
                            </CartStateProvider>
                        </DialogMessageProvider>
                    </PersistGate></Provider>
                </NextAuthSessionProvider>
            </body>
        </html>
    );
}
