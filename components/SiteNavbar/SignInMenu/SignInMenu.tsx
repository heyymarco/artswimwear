'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
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
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    SignInDropdownResult,
    SignInDropdown,
}                           from './SignInDropdown'
import {
    type Session,
    SignIn,
}                           from '@/components/SignIn'
import {
    PrefetchKind,
    PrefetchRouter,
}                           from '@/components/prefetches/PrefetchRouter'

// internals:
import {
    useSignInMenuStyleSheet,
}                           from './styles/loader'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// states:
import {
    usePageInterceptState,
}                           from '@/states/pageInterceptState'

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
    const [isLoading, setIsLoading] = useState<boolean>(sessionStatus === 'loading'); // the `sessionStatus === 'loading'` is not quite reliable, so we use additional loading state
    const isSignedIn  = !isLoading && (sessionStatus === 'authenticated');
    const isSignedOut = !isLoading && (sessionStatus === 'unauthenticated');
    const isBusy      =  isLoading || (sessionStatus === 'loading');
    const { name: customerName, email: customerEmail, image: customerImage } = session?.user ?? {};
    const customerNameParts = customerName?.split(/\s+/gi);
    const customerFirstName = customerNameParts?.[0];
    const customerShortRestName = !!customerNameParts && (customerNameParts.length >= 2) ? customerNameParts[customerNameParts.length - 1][0] : undefined;
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (sessionStatus === 'loading') return; // only interested to FULLY signedIn|signedOut
        
        
        
        // actions:
        setIsLoading(false); // reset
    }, [sessionStatus]);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    const [shownMenu, setShownMenu] = useState<PromiseDialog<any>|null>(null);
    
    
    
    // handlers:
    const {
        startIntercept,
    } = usePageInterceptState();
    const router = useRouter();
    const pathname = usePathname();
    const handleClick = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        event.preventDefault();  // prevent the `href='/signin'` to HARD|SOFT navigate
        event.stopPropagation(); // prevents the <Navbar> from auto collapsing, we'll collapse the <Navbar> manually
        
        
        
        if (isSignedOut) {
            //#region a fix for signIn page interceptor when on /checkout page
            // intercepts home|products/**|categories/**|checkout/** */ => show <SignInDialog>:
            if ((/^\/($)|((products|categories|checkout)($|\/))/i).test(pathname)) {
                startIntercept(async (backPathname): Promise<boolean> => {
                    toggleList(false); // collapse the <Navbar> manually
                    router.push(signInPath); // goto signIn page
                    
                    
                    
                    const shownDialogPromise = showDialog<false|Session>(
                        <SignInDialog
                            // components:
                            signInComponent={
                                <SignIn<Element>
                                    // back to current checkout page after signed in:
                                    defaultCallbackUrl={backPathname}
                                />
                            }
                        />
                    );
                    
                    
                    
                    // on collapsing (start to close):
                    await shownDialogPromise.collapseStartEvent();
                    // restore the url:
                    return true;
                });
            } // if
            //#endregion a fix for signIn page interceptor when on /checkout page
        }
        else if (isSignedIn) {
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
                            router.push('/customer'); // goto customer's profile page
                            break;
                        
                        case 'signOut':
                            setIsLoading(true); // the `sessionStatus === 'loading'` is not quite reliable, so we use additional loading state
                            signOut({ redirect: false, callbackUrl: pathname }); // when signed in back, redirects to current url
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
        <>
            <NavItem
                // other props:
                {...props}
                
                
                
                // refs:
                elmRef={menuRef}
                
                
                
                // classes:
                className={!navbarExpanded ? 'navbarCollapsed' : undefined}
                
                
                
                // behaviors:
                actionCtrl={props.actionCtrl ?? (isSignedOut || isSignedIn)}
                href={isSignedOut ? '/signin' : undefined}
                
                
                
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
                        isSignedOut
                        ? 0
                        :   isSignedIn
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
                            Sign in
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
            
            {/* PREFETCH for displaying the signin PAGE */}
            <PrefetchRouter
                // data:
                href='/signin'
                prefetchKind={PrefetchKind.FULL}
            />
        </>
    );
};
export {
    SignInMenu,
    SignInMenu as default,
}