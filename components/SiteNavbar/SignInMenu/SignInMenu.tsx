'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
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
    TabPanel,
    Tab,
    useNavbarState,
    
    
    
    // utility-components:
    PromiseDialog,
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    SignInDropdownResult,
    SignInDropdown,
}                           from './SignInDropdown'

// internals:
import {
    useSignInMenuStyleSheet,
}                           from './styles/loader'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    authConfigClient,
}                           from '@/auth.config.client'



// react components:
export interface SignInMenuProps
    extends
        // bases:
        NavItemProps
{
}
const SignInMenu = (props: SignInMenuProps): JSX.Element|null => {
    // configs:
    const {
        signIn : {
            path : signInPath,
        }
    } = authConfigClient;
    
    
    
    // states:
    const {
        // states:
        navbarExpanded,
        
        
        
        // handlers:
        toggleList,
    } = useNavbarState();
    
    
    
    // styles:
    const styleSheet = useSignInMenuStyleSheet();
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const isFullySignedIn  = !isSigningOut && (sessionStatus === 'authenticated')   && !!session;
    const isFullySignedOut = !isSigningOut && (sessionStatus === 'unauthenticated') &&  !session;
    const isBusy           =  isSigningOut || (sessionStatus === 'loading');
    const { name: customerName, email: customerEmail, image: customerImage } = session?.user ?? {};
    const customerNameParts = customerName?.split(/\s+/gi);
    const customerFirstName = customerNameParts?.[0];
    const customerShortRestName = !!customerNameParts && (customerNameParts.length >= 2) ? customerNameParts[customerNameParts.length - 1][0] : undefined;
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (!isFullySignedIn && !isFullySignedOut) return;
        
        
        
        // actions:
        setIsSigningOut(false); // reset signing out
    }, [isFullySignedIn, isFullySignedOut]);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownMenu, setShownMenu] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const router = useRouter();
    const pathname = usePathname();
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (isFullySignedOut) {
            router.push(signInPath);
            toggleList(false); // collapse the <Navbar> manually
        }
        else if (isFullySignedIn) {
            if (shownMenu) {
                shownMenu.closeDialog(undefined);
            }
            else {
                const newShownMenu = showDialog<SignInDropdownResult>(
                    <SignInDropdown
                        // variants:
                        theme='primary'
                        
                        
                        
                        // states:
                        navbarExpanded={navbarExpanded} // out of <NavbarContextProvider>, we need to drill props the navbar's state
                        
                        
                        
                        // floatable:
                        floatingOn={menuRef}
                        floatingPlacement='bottom-end'
                        
                        
                        
                        // auto focusable:
                        restoreFocusOn={menuRef}
                    />
                );
                setShownMenu(newShownMenu);
                newShownMenu.collapseStartEvent().then(() => {
                    setShownMenu(null);
                });
                newShownMenu.collapseEndEvent().then((event) => {
                    switch (event.data) {
                        case 'editProfile':
                            router.push('/profile');
                            break;
                        
                        case 'signOut':
                            setIsSigningOut(true); // set signing out
                            signOut();
                            break;
                    } // switch
                    toggleList(false); // collapse the <Navbar> manually
                });
            } // if
        } // if
    });
    
    
    
    // refs:
    const menuRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <NavItem
            // other props:
            {...props}
            
            
            
            // refs:
            elmRef={menuRef}
            
            
            
            // classes:
            className={!navbarExpanded ? 'navbarCollapsed' : undefined}
            
            
            
            // behaviors:
            actionCtrl={props.actionCtrl ?? (isFullySignedOut || isFullySignedIn)}
            
            
            
            // states:
            active={(isBusy || pathname?.startsWith(signInPath) || !!shownMenu) ? true : undefined}
            
            
            
            // handlers:
            onClick={handleClick}
        >
            <Tab
                // classes:
                className={styleSheet.signInWrapper}
                
                
                
                // states:
                expandedTabIndex={
                    isFullySignedOut
                    ? 0
                    :   isFullySignedIn
                        ? 2
                        : 1
                }
                
                
                
                // components:
                bodyComponent={
                    <Basic
                        // variants:
                        nude={true}
                    />}
                headerComponent={null} // headless <Tab>
            >
                <TabPanel
                    // classes:
                    className={styleSheet.signInMenu}
                >
                    <Icon
                        // appearances:
                        icon='login'
                        
                        
                        
                        // variants:
                        size='lg'
                    />
                    <span>
                        Sign In
                    </span>
                </TabPanel>
                <TabPanel className={styleSheet.signInMenu}>
                    <Icon icon='busy' size='lg' />
                    <span>
                        Loading...
                    </span>
                </TabPanel>
                <TabPanel className={styleSheet.signInMenu}>
                    <ProfileImage
                        // appearances:
                        src={resolveMediaUrl(customerImage ?? undefined)}
                        
                        
                        
                        // variants:
                        profileImageStyle='circle'
                    />
                    <span className={styleSheet.signInName}>
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