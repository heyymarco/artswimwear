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
    ListSeparatorItem,
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    ProfileImage,
}                           from '@/components/ProfileImage'

// internals:
import {
    useSignInMenuStyleSheet,
}                           from '../styles/loader'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export type SignInDropdownResult =
    |'editProfile'
    |'signOut'
export interface SignInDropdownProps<TElement extends Element = HTMLElement, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<SignInDropdownResult> = DropdownListExpandedChangeEvent<SignInDropdownResult>>
    extends
        // bases:
        DropdownListProps<TElement, TDropdownListExpandedChangeEvent>
{
    // data:
    customerName  : string|null|undefined
    customerEmail : string|null|undefined
    customerImage : string|null|undefined
}
const SignInDropdown = (props: SignInDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useSignInMenuStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        customerName,
        customerEmail,
        customerImage,
    ...restDropdownListProps} = props;
    
    
    
    // handlers:
    const handleClose = useEvent((event: React.MouseEvent<HTMLElement, MouseEvent>, data: SignInDropdownResult): void => {
        props.onExpandedChange?.({ expanded: false, actionType: 'ui', data: data });
        event.preventDefault();
    });
    
    
    
    // jsx:
    return (
        <DropdownList
            // other props:
            {...restDropdownListProps}
            
            
            
            // classes:
            className={styleSheet.signInDropdown}
        >
            <ListItem
                // classes:
                className={styleSheet.signInEditProfile}
                
                
                
                // behaviors:
                actionCtrl={false}
                
                
                
                // handlers:
                onClick={(event) => handleClose(event, 'editProfile')}
            >
                <ProfileImage
                    // appearances:
                    src={resolveMediaUrl(customerImage ?? undefined)}
                    
                    
                    
                    // variants:
                    profileImageStyle='circle'
                    
                    
                    
                    // classes:
                    className='image'
                />
                <span className='name'>
                    {customerName}
                </span>
                <span className='email'>
                    {customerEmail}
                </span>
                <EditButton className='edit'>
                    Edit Profile
                </EditButton>
            </ListItem>
            <ListSeparatorItem />
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