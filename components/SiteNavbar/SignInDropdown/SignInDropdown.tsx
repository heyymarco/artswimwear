'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface SignInDropdownProps
    extends
        // bases:
        DropdownListProps
{
}
const SignInDropdown = (props: SignInDropdownProps): JSX.Element|null => {
    // jsx:
    return (
        <DropdownList
            // other props:
            {...props}
        >
            <ListItem>
                <Icon icon='edit' size='md' />
                <span>
                    Edit Profile
                </span>
            </ListItem>
            <ListItem>
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