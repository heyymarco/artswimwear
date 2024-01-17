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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    Badge,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'

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
    const customerUsername = 'session.username';
    
    
    
    // handlers:
    const handleEdit = useEvent((edit: 'image'|'name'|'username') => {

    });
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                {/* profile image + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={10}
                            floatingOffset={-30}
                        >
                            <EditButton className='edit overlay' onClick={() => handleEdit('image')}>
                                <></>
                            </EditButton>
                        </Badge>
                    }
                    elementComponent={
                        <ProfileImage
                            // appearances:
                            src={resolveMediaUrl(customerImage ?? undefined)}
                            
                            
                            
                            // variants:
                            // profileImageStyle='circle'
                            
                            
                            
                            // classes:
                            className='image'
                        />
                    }
                />
                
                <h3 className='name'>
                    <span className='label'>
                        Name:
                    </span>
                    {customerName}
                    <EditButton onClick={() => handleEdit('name')} />
                </h3>
                
                <p className='username'>
                    <span className='label'>
                        Username:
                    </span>
                    {customerUsername || <span className='noValue'>No Username</span>}
                    <EditButton onClick={() => handleEdit('username')} />
                </p>
                
                <p className='email'>
                    <span className='label'>
                        Email:
                    </span>
                    {customerEmail}
                </p>
            </Section>
        </Main>
    );
}
