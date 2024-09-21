'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import {
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    ListSeparatorItem,
    
    ListProps,
    List,
    
    
    
    // menu-components:
    Dropdown,
    DropdownListExpandedChangeEvent,
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    SignInInfo,
}                           from '@/components/SignInInfo'

// internals:
import {
    useSignInMenuStyleSheet,
}                           from '../styles/loader'



// react components:
export type SignInDropdownResult =
    |'editProfile'
    |'signOut'
export interface SignInDropdownProps<TElement extends Element = HTMLElement, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<SignInDropdownResult> = DropdownListExpandedChangeEvent<SignInDropdownResult>>
    extends
        // bases:
        DropdownListProps<TElement, TDropdownListExpandedChangeEvent>
{
    // states:
    navbarExpanded : boolean // out of <NavbarContextProvider>, we need to drill props the navbar's state
}
const SignInDropdown = (props: SignInDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useSignInMenuStyleSheet();
    
    
    
    // rest props:
    const {
        // states:
        navbarExpanded,
        
        
        
        // components:
        listComponent = (<List /> as React.ReactComponentElement<any, ListProps>),
    ...restDropdownListProps} = props;
    
    
    
    // navigations:
    const router = useRouter();
    
    
    
    // handlers:
    const handleClose = useEvent((event: React.MouseEvent<HTMLElement, MouseEvent>, data: SignInDropdownResult): void => {
        props.onExpandedChange?.({ expanded: false, actionType: 'ui', data: data });
        event.preventDefault();
    });
    const handleNavigate = useEvent((href: string): void => {
        router.push(href);
    });
    
    
    
    // jsx:
    return (
        <DropdownList
            // other props:
            {...restDropdownListProps}
            
            
            
            // classes:
            className={styleSheet.signInDropdown}
            
            
            
            // components:
            listComponent={listComponent}
            dropdownComponent={
                <Dropdown
                    // classes:
                    className={`${styleSheet.signInDropdownDropdown} ${!navbarExpanded ? 'navbarCollapsed' : ''}`}
                >
                    {listComponent}
                </Dropdown>
            }
        >
            <ListItem
                // classes:
                className={styleSheet.signInEditProfile}
                
                
                
                // behaviors:
                actionCtrl={false}
            >
                <SignInInfo
                    // variants:
                    size='lg'
                    nude={true}
                    
                    
                    
                    // handlers:
                    onEdit={(event) => handleClose(event, 'editProfile')}
                />
            </ListItem>
            <ListSeparatorItem />
            <ListItem onClick={() => handleNavigate('/customer/wishes')}>
                <Link href='/customer/wishes'>
                    <Icon icon='favorite' size='md' theme='danger' />
                    <span>
                        My wishlist
                    </span>
                </Link>
            </ListItem>
            <ListItem onClick={() => handleNavigate('/customer/order-history')}>
                <Link href='/customer/order-history'>
                    <Icon icon='history' size='md' />
                    <span>
                        My order history
                    </span>
                </Link>
            </ListItem>
            <ListSeparatorItem />
            <ListItem onClick={(event) => handleClose(event, 'signOut')}>
                <Icon icon='logout' size='md' />
                <span>
                    Sign out
                </span>
            </ListItem>
        </DropdownList>
    );
};
export {
    SignInDropdown,
    SignInDropdown as default,
}