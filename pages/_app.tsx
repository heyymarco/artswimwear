import '../libs/cssfn-preload'
import '@cssfn/cssfn-dom'

import '../website.config';

// import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import SiteNavbar from '../components/SiteNavbar'

import Head from 'next/head'
import { Container } from '@reusable-ui/components';
import { Section } from '@/components/sections/Section';

const Header = () => {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/favicon.png" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            
            <header>
                <Container tag='aside' theme='warning' size='sm' style={{ paddingBlock: '0.25rem' }}>
                    <p style={{lineHeight: 1, fontSize: '0.75rem', textAlign: 'center'}}>
                        This site is <strong>under construction</strong>.
                    </p>
                </Container>
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
            <footer>
                <Section titleTag='h5' title='Support Us' theme='primary'>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque blanditiis vel molestias fuga amet, labore facere animi alias ab ullam quasi explicabo cumque qui neque totam ipsum perspiciatis harum incidunt.
                    </p>
                </Section>
            </footer>
        </>
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (<>
        <Header />
        
        <Component {...pageProps} />
        
        <Footer />
    </>);
}
