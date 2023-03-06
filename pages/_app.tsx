import '../libs/cssfn-preload'
import '@cssfn/cssfn-dom'

import '../website.config';

import '@/styles/Site.global.scss'
import type { AppProps } from 'next/app'

import SiteNavbar from '../components/SiteNavbar'

import Head from 'next/head'
import { Container } from '@reusable-ui/components';

import { store } from '@/store/store'
import { Provider } from 'react-redux'
import { CartBar } from '@/components/CartBar';

const Header = () => {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/artswimwear.png" />
                <link rel="icon" type="image/svg+xml" href="/artswimwear.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    return (<Provider store={store}>
        <Header />
        
        <Component {...pageProps} />
        
        <Footer />
        
        <CartBar />
    </Provider>);
}
