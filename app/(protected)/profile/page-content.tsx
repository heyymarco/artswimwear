'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
const useProfilePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './page-styles')
, { id: 'pmmu5ep2va' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export function ProfilePageContent() {
    // styles:
    const styleSheet = useProfilePageStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    const { name: customerName, email: customerEmail, image: customerImage } = session?.user ?? {};
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                <ProfileImage
                    // appearances:
                    src={resolveMediaUrl(customerImage ?? undefined)}
                    
                    
                    
                    // variants:
                    profileImageStyle='circle'
                    
                    
                    
                    // classes:
                    className='image'
                />
            </Section>
        </Main>
    );
}
