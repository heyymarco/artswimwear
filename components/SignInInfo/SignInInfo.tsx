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

// reusable-ui components:
import {
    // base-content-components:
    type ContentProps,
    Content,
    useContentStyleSheet,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
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
        ContentProps<TElement>
{
}
const SignInInfo = <TElement extends Element = HTMLElement>(props: SignInInfoProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // other props:
        ...restSignInInfoProps
    } = props;
    
    
    
    // styles:
    const contentStyleSheet = useContentStyleSheet();
    const styleSheet        = useSignInInfoStyleSheet();
    
    
    
    // sessions:
    const { data: session } = useSession();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = `${contentStyleSheet.main} ${styleSheet.main}`,
        
        
        
        // other props:
        ...restContentProps
    } = restSignInInfoProps;
    
    
    
    // jsx:
    if (!session) return null;
    const { name: customerName, email: customerEmail, image: customerImage } = session.user ?? {};
    return (
        <Content<TElement>
            // other props:
            {...restContentProps}
            
            
            
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
        </Content>
    );
};
export {
    SignInInfo,            // named export for readibility
    SignInInfo as default, // default export to support React.lazy
}
