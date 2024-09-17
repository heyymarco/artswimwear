'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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
    NotifyWishlistAddedDialog,
}                           from '@/components/dialogs/NotifyWishlistAddedDialog'
import {
    NotifyDialog,
}                           from '@/components/dialogs/NotifyDialog'

// models:
import {
    type WishlistGroupDetail,
}                           from '@/models'

// stores:
import {
    // types:
    type ProductPreview,
    
    
    
    // hooks:
    useGetWishlists,
    useUpdateWishlist,
    useDeleteWishlist,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface ButtonWishlistProps
    extends
        // bases:
        ButtonIconProps
{
    // data:
    model : ProductPreview
}
const ButtonWishlist = (props: ButtonWishlistProps) => {
    // props:
    const {
        // data:
        model : {
            // records:
            id,
        },
        
        
        
        // other props:
        ...restButtonWishlistProps
    } = props;
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // apis:
    const [getWishlists, { data: wishlists }] = useGetWishlists();
    const [updateWishlist] = useUpdateWishlist();
    const [deleteWishlist] = useDeleteWishlist();
    const isWishlisted = (!!wishlists && !!wishlists.entities[id]);
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (sessionStatus !== 'authenticated') return; // only interested to signedIn customer
        
        
        
        // actions:
        getWishlists({ groupId: undefined /* all wishlists in current signedIn customer */ });
    }, [sessionStatus]);
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleWishlistClick = useEvent(async (): Promise<void> => {
        try {
            if (!isWishlisted) {
                await updateWishlist({
                    productId : id,
                    groupId   : undefined,
                }).unwrap();
                
                
                
                const wishlistGroup = await showDialog<WishlistGroupDetail>(
                    <NotifyWishlistAddedDialog />
                );
                if (wishlistGroup === undefined) return;
                
                
                
                await updateWishlist({
                    productId : id,
                    groupId   : wishlistGroup.id,
                }).unwrap();
                
                
                
                showDialog<unknown>(
                    <NotifyDialog theme='success'>
                        <p>
                            Item has been added to your <strong>{wishlistGroup.name}</strong> collection!
                        </p>
                    </NotifyDialog>
                );
            }
            else {
                await deleteWishlist({
                    productId : id,
                }).unwrap();
                
                
                
                showDialog<unknown>(
                    <NotifyDialog>
                        <p>
                            Item has been removed from wishlist!
                        </p>
                    </NotifyDialog>
                );
            } // if
        }
        catch {
            showMessageError({
                title : <h1>Error Updating Wishlist</h1>,
                error : <>
                    <p>
                        Oops, something went wrong while <strong>updating your last wishlist</strong>.
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
        icon        = isWishlisted ? 'favorite' : 'favorite_outline',
        
        
        
        // variants:
        buttonStyle = 'link',
        theme       = 'danger',
        
        
        
        // other props:
        ...restButtonIconProps
    } = restButtonWishlistProps;
    
    
    
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
            onClick={handleWishlistClick}
        />
    );
};
export {
    ButtonWishlist,            // named export for readibility
    ButtonWishlist as default, // default export to support React.lazy
}
