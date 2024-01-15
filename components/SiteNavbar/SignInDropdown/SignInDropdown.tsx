'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
}
const SignInDropdown = (props: SignInDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useSignInMenuStyleSheet();
    
    
    
    // handlers:
    const handleClose = useEvent((event: React.MouseEvent<HTMLElement, MouseEvent>, data: SignInDropdownResult): void => {
        props.onExpandedChange?.({ expanded: false, actionType: 'ui', data: data });
        event.preventDefault();
    });
    
    
    
    // jsx:
    return (
        <DropdownList
            // other props:
            {...props}
            
            
            
            // classes:
            className={styleSheet.signInDropdown}
        >
            <ListItem onClick={(event) => handleClose(event, 'editProfile')}>
                <Icon icon='edit' size='md' />
                <span>
                    Edit Profile
                </span>
            </ListItem>
            <ListItem onClick={(event) => handleClose(event, 'signOut')}>
                <Icon icon='logout' size='md' />
                <span>
                    Sign Out
                </span>
            </ListItem>
        </DropdownList>
    );
};
export {
    SignInDropdown,
    SignInDropdown as default,
}