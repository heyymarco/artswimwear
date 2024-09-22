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

// models:
import {
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // types:
    type ProductPreview,
    
    
    
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
    model : ProductPreview
}
const ButtonWish = (props: ButtonWishProps) => {
    // props:
    const {
        // data:
        model : {
            // records:
            id,
            wished,
        },
        
        
        
        // other props:
        ...restButtonWishProps
    } = props;
    
    
    
    // apis:
    const [updateWish] = useUpdateWish();
    const [deleteWish] = useDeleteWish();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleWishClick = useEvent(async (): Promise<void> => {
        try {
            if (!wished) {
                await updateWish({
                    productId : id,
                    groupId   : undefined,
                }).unwrap();
                
                
                
                const wishGroup = await showDialog<WishGroupDetail>(
                    <NotifyWishAddedDialog />
                );
                if (wishGroup === undefined) return;
                
                
                
                await updateWish({
                    productId : id,
                    groupId   : wishGroup.id,
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
                    productId : id,
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
            })
        } // try
    });
    
    
    
    // default props:
    const {
        // appearances:
        icon        = wished ? 'favorite' : 'favorite_outline',
        
        
        
        // variants:
        buttonStyle = 'link',
        theme       = 'danger',
        
        
        
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
            
            
            
            // handlers:
            onClick={handleWishClick}
        />
    );
};
export {
    ButtonWish,            // named export for readibility
    ButtonWish as default, // default export to support React.lazy
}
