// private components:
import {
    SiteNavbar,
}                           from '@/components/SiteNavbar'



export const Header = (): JSX.Element|null => {
    // jsx:
    return (
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
    );
}
