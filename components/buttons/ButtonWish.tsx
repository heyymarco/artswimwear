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

// next-js:
import {
    usePathname,
    useRouter,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type ButtonIconProps,
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internal components:
import {
    NotifyWishAddedDialog,
}                           from '@/components/dialogs/NotifyWishAddedDialog'
import {
    NotifyDialog,
}                           from '@/components/dialogs/NotifyDialog'
import {
    SignInDialog,
}                           from '@/components/dialogs/SignInDialog'
import {
    type Session,
    SignIn,
}                           from '@/components/SignIn'

// models:
import {
    type ProductPreview,
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateWish,
    useDeleteWish,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ButtonWishProps
    extends
        // bases:
        ButtonIconProps
{
    // data:
    model : ProductPreview|undefined
}
const ButtonWish = (props: ButtonWishProps) => {
    // props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restButtonWishProps
    } = props;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const isSignedIn = !!session;
    
    
    
    // apis:
    const [updateWish] = useUpdateWish();
    const [deleteWish] = useDeleteWish();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
    } = useDialogMessage();
    
    
    
    // hooks:
    const pathName = usePathname();
    const router   = useRouter();
    
    
    
    // handlers:
    const handleWishClick = useEvent(async (): Promise<void> => {
        // conditions:
        if (!model) return;
        if (!isSignedIn) {
            router.push('/signin', { scroll: false });
            
            
            
            const backPathname = pathName;
            
            showDialog<false|Session>(
                <SignInDialog
                    // components:
                    signInComponent={
                        <SignIn<Element>
                            // back to current checkout page after signed in:
                            defaultCallbackUrl={backPathname}
                        />
                    }
                />
            )
            .then(() => { // on fully closed:
                router.push(backPathname, { scroll: false });
            });
            
            
            
            return; // done
        } // if
        
        
        
        // actions:
        try {
            if (model.wished === undefined) { // undefined: unwished; null: wished (ungrouped); string: wished (grouped)
                await updateWish({
                    productId       : model.id,
                    groupId         : null,
                    originalGroupId : model.wished, // the `originalGroupId` IS ALWAYS `undefined` (was not grouped) because the product WAS NEITHER wished NOR grouped
                }).unwrap();
                
                
                
                const wishGroup = await showDialog<WishGroupDetail>(
                    <NotifyWishAddedDialog />
                );
                if (wishGroup === undefined) return;
                
                
                
                await updateWish({
                    productId       : model.id,
                    groupId         : wishGroup.id,
                    originalGroupId : model.wished, // the `originalGroupId` IS ALWAYS `undefined` (was not grouped) because the product WAS NEITHER wished NOR grouped
                }).unwrap();
                
                
                
                showDialog<unknown>(
                    <NotifyDialog theme='success'>
                        <p>
                            Item has been added to your <strong>{wishGroup.name}</strong> collection!
                        </p>
                    </NotifyDialog>
                );
            }
            else {
                await deleteWish({
                    productId       : model.id,
                    originalGroupId : model.wished,
                }).unwrap();
                
                
                
                showDialog<unknown>(
                    <NotifyDialog theme='success'>
                        <p>
                            Item has been removed from wishlist!
                        </p>
                    </NotifyDialog>
                );
            } // if
        }
        catch {
            showMessageError({
                title : <h1>Error Updating Wish</h1>,
                error : <>
                    <p>
                        Oops, something went wrong while <strong>updating your last wish</strong>.
                        <br />
                        Your last changes were not saved.
                    </p>
                    <p>
                        There was a <strong>problem contacting our server</strong>.<br />
                        Make sure your internet connection is available.
                    </p>
                    <p>
                        Please try again in a few minutes.
                    </p>
                </>,
            });
        } // try
    });
    
    
    
    // default props:
    const {
        // appearances:
        icon        = (model?.wished !== undefined /* undefined: unwished; null: wished (ungrouped); string: wished (grouped) */) ? 'favorite' : 'favorite_outline',
        
        
        
        // variants:
        buttonStyle = 'link',
        theme       = 'danger',
        
        
        
        // states:
        active      = (model?.wished !== undefined),
        
        
        
        // other props:
        ...restButtonIconProps
    } = restButtonWishProps;
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restButtonIconProps}
            
            
            
            // appearances:
            icon={icon}
            
            
            
            // variants:
            buttonStyle={buttonStyle}
            theme={theme}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            onClick={handleWishClick}
        />
    );
};
export {
    ButtonWish,            // named export for readibility
    ButtonWish as default, // default export to support React.lazy
}
