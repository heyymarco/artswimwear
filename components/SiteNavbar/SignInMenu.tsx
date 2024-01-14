'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // composite-components:
    NavItemProps,
    NavItem,
    Nav,
    TabPanelProps,
    TabPanel,
    TabProps,
    Tab,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface SignInMenuProps
    extends
        // bases:
        NavItemProps
{
}
const SignInMenu = (props: SignInMenuProps): JSX.Element|null => {
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const isFullySignedIn  = !isSigningOut && (sessionStatus === 'authenticated')   && !!session;
    const isFullySignedOut = !isSigningOut && (sessionStatus === 'unauthenticated') &&  !session;
    const isBusy           =  isSigningOut || (sessionStatus === 'loading');
    const role = session?.role;
    const { name: customerName, image: customerImage } = session?.user ?? {};
    const customerNameParts = customerName?.split(/\s+/gi);
    const customerFirstName = customerNameParts?.[0];
    const customerShortRestName = !!customerNameParts && (customerNameParts.length >= 2) ? customerNameParts[customerNameParts.length - 1][0] : undefined;
    
    
    // handlers:
    const handleClick = useEvent(() => {

    });
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...props}
            
            
            
            // states:
            active={isBusy ? true : undefined}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            <Tab
                // states:
                expandedTabIndex={
                    isFullySignedOut
                    ? 0
                    :   isFullySignedIn
                        ? 2
                        : 1
                }
                
                
                // components:
                bodyComponent={<Basic nude={true} />}
                headerComponent={null} // headless <Tab>
            >
                <TabPanel>
                    Sign In
                </TabPanel>
                <TabPanel>
                    Loading...
                </TabPanel>
                <TabPanel>
                    <Icon icon='face' size='lg' />
                    <span>
                        {customerFirstName}
                    </span>
                    {customerShortRestName ? ' ' : ''}
                    <span>
                        {customerShortRestName}
                    </span>
                </TabPanel>
            </Tab>
        </NavItem>
    );
};
export {
    SignInMenu,
    SignInMenu as default,
}