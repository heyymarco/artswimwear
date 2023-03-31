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
import { Container } from '@reusable-ui/components';

import { store, persistor } from '@/store/store'
import { Provider } from 'react-redux'
import { CartBar } from '@/components/CartBar';
import { PersistGate } from 'redux-persist/integration/react';
import { WEBSITE_FAVICON_PNG, WEBSITE_FAVICON_SVG } from '@/website.config'


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
        <Header />
        
        <Component {...pageProps} />
        
        <Footer />
        
        <CartBar />
    </PersistGate></Provider>);
}
