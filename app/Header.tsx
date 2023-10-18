import Head from 'next/head'
import { SiteNavbar } from '@/components/SiteNavbar'
import { WEBSITE_FAVICON_PNG, WEBSITE_FAVICON_SVG } from '@/website.config'



export const Header = () => {
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
