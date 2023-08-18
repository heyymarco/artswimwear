import '../libs/cssfn-preload'
import '@cssfn/cssfn-dom'

import '../theme.config';

import '@/styles/Site.global.scss'

import type { AppProps } from 'next/app'

// cssfn:
import {
    // writes css in javascript:
    styleSheets,
}                           from '@cssfn/core'          // writes css in javascript

import SiteNavbar from '../components/SiteNavbar'

import Head from 'next/head'
import { Alert, Container } from '@reusable-ui/components';

import { store, persistor } from '@/store/store'
import { Provider } from 'react-redux'
import { CartBar } from '@/components/CartBar';
import { PersistGate } from 'redux-persist/integration/react';
import { WEBSITE_FAVICON_PNG, WEBSITE_FAVICON_SVG } from '@/website.config'

// heymarco components:
import {
    // react components:
    DialogMessageProvider, FetchErrorTitle, FetchErrorMessage,
}                           from '@heymarco/dialog-message'



// defaults:
const fetchErrorTitleDefault   : Extract<FetchErrorTitle  , Function> = ({isRequestError, isServerError, errorCode, context}) => {
    switch (context) {
        case 'order'   : return 'Error Processing Your Order';
        case 'payment' : return 'Error Processing Your Payment';
        default        : return 'Error';
    } // switch
};
const fetchErrorMessageDefault : Extract<FetchErrorMessage, Function> = ({isRequestError, isServerError, errorCode, context}) => <>
    {(errorCode !== 402) && <p>
        Oops, there was an error processing {
            ((): React.ReactNode => {
                switch (context) {
                    case 'order'  : return <>your order</>;
                    case 'payment': return <>your payment</>;
                    default       : return <>the command</>;
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



// styles:
styleSheets(
    () => import(/* webpackPrefetch: true */ '@/styles/Site.global')
, { id: 'hxwx41lmsf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



const Header = () => {
    return (
        <>
            <Head>
                <link rel='icon' type='image/png' href={WEBSITE_FAVICON_PNG} />
                <link rel='icon' type='image/svg+xml' href={WEBSITE_FAVICON_SVG} />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            
            <header className='siteHeader'>
                {/* <Suspense fallback={
                    <Container
                        className='siteNavbar lazy'
                        theme='primary'
                        mild={false}
                        gradient={true}
                    />
                }>
                    <SiteNavbarLazy />
                </Suspense> */}
                <SiteNavbar />
            </header>
        </>
    );
}

const Footer = () => {
    return (
        <>
            <Container tag='footer' className='siteFooter' theme='primary' mild={false} gradient={true}>
                <p>
                    Copyright 2023 © Rossalia
                </p>
            </Container>
        </>
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (<Provider store={store}><PersistGate persistor={persistor}>
        <DialogMessageProvider
            fetchErrorTitleDefault={fetchErrorTitleDefault}
            fetchErrorMessageDefault={fetchErrorMessageDefault}
        >
            <Header />
            
            <Component {...pageProps} />
            
            <Footer />
            
            <CartBar />
        </DialogMessageProvider>
    </PersistGate></Provider>);
}
