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

// styles:
import {
    useSignInInfoStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    type BasicProps,
    Basic,
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
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface SignInInfoProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        BasicProps<TElement>
{
    // handlers:
    onEdit ?: EventHandler<unknown>
}
const SignInInfo = <TElement extends Element = HTMLElement>(props: SignInInfoProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onEdit,
        
        
        
        // other props:
        ...restSignInInfoProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useSignInInfoStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // default props:
    const {
        // variants:
        mild      = true,
        
        
        
        // classes:
        mainClass = styleSheet.main,
        
        
        
        // other props:
        ...restContentProps
    } = restSignInInfoProps;
    
    
    
    // jsx:
    if (!session) return null;
    const { name: customerName, email: customerEmail, image: customerImage } = session.user ?? {};
    return (
        <Basic<TElement>
            // other props:
            {...restContentProps}
            
            
            
            // variants:
            mild={mild}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <ProfileImage
                // appearances:
                src={resolveMediaUrl(customerImage ?? undefined)}
                
                
                
                // variants:
                profileImageStyle='circle'
                
                
                
                // classes:
                className='image'
            />
            
            <span
                // classes:
                className='name'
            >
                {customerName}
            </span>
            
            <span
                // classes:
                className='email'
            >
                {customerEmail}
            </span>
            
            {!!onEdit &&<EditButton
                // classes:
                className='edit'
                
                
                
                // handlers:
                onClick={onEdit}
            >
                Edit Profile
            </EditButton>}
        </Basic>
    );
};
export {
    SignInInfo,            // named export for readibility
    SignInInfo as default, // default export to support React.lazy
}
