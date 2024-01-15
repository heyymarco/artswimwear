'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// next-auth:
import {
    useSession,
    signOut,
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
    console.log({customerImage, resolved: resolveMediaUrl(customerImage ?? undefined)});
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (!isFullySignedIn && !isFullySignedOut) return;
        
        
        
        // actions:
        setIsSigningOut(false); // reset signing out
    }, [isFullySignedIn, isFullySignedOut]);
    
    
    
    // handlers:
    const router = useRouter();
    const pathname = usePathname();
    const handleClick = useEvent(() => {
        if (isFullySignedOut) {
            router.push('/signin');
        }
        else if (isFullySignedIn) {
            setIsSigningOut(true); // set signing out
            signOut();
        } // if
    });
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...props}
            
            
            
            // states:
            active={(isBusy || (pathname === '/signin')) ? true : undefined}
            
            
            
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
                    <Icon icon='login' size='lg' />
                    <span>
                        Sign In
                    </span>
                </TabPanel>
                <TabPanel>
                    <Icon icon='busy' size='lg' />
                    <span>
                        Loading...
                    </span>
                </TabPanel>
                <TabPanel>
                    <Icon icon='person' size='lg' style={customerImage ? { backgroundImage: `url("${resolveMediaUrl(customerImage)}")` } : undefined} />
                    <span>
                        <span>
                            {customerFirstName}
                        </span>
                        {customerShortRestName ? ' ' : ''}
                        <span>
                            {customerShortRestName}
                        </span>
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