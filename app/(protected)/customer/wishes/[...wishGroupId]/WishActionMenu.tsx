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
    // layout-components:
    ListItem,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // menu-components:
    type DropdownListButtonProps,
    DropdownListButton,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    NotifyDialog,
}                           from '@/components/dialogs/NotifyDialog'
import {
    MoveWishDialog,
}                           from '@/components/dialogs/MoveWishDialog'

// models:
import {
    type ProductPreview,
    
    type WishGroupDetail,
    type GetWishPageResponse,
}                           from '@/models'

// stores:
import {
    useUpdateWish,
    useDeleteWish,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface WishActionMenuProps
    extends
        // bases:
        Omit<DropdownListButtonProps,
            |'children' // no nested children
        >,
        Pick<GetWishPageResponse,
            |'wishGroup'
        >
{
    // data:
    model     : ProductPreview
}
const WishActionMenu = (props: WishActionMenuProps): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        wishGroup,
        
        
        
        // other props:
        ...restDropdownListButtonProps
    } = props;
    const isGroupedWishes = !!wishGroup;
    
    
    
    // apis:
    const [updateWish] = useUpdateWish();
    const [deleteWish] = useDeleteWish();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleMoveToCollection     = useEvent(async (): Promise<void> => {
        // conditions:
        const fromWishGroup = (
            isGroupedWishes
            ? wishGroup
            : null
        );
        if (fromWishGroup === undefined) return;
        
        const toWishGroup = await showDialog<WishGroupDetail>(
            <MoveWishDialog />
        );
        if (toWishGroup === undefined) return;
        
        
        
        // actions:
        try {
            await updateWish({
                productId       : model.id,
                groupId         : toWishGroup.id,
                originalGroupId : fromWishGroup?.id ?? null,
            }).unwrap();
            
            
            
            showDialog<unknown>(
                <NotifyDialog theme='success'>
                    <p>
                        Item has been moved to <strong>{toWishGroup.name}</strong> collection!
                    </p>
                </NotifyDialog>
            );
        }
        catch {
            showMessageError({
                title : <h1>Error Moving Wish</h1>,
                error : <>
                    <p>
                        Oops, something went wrong while <strong>moving your last wish</strong>.
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
    const handleDeleteFromCollection = useEvent(async (): Promise<void> => {
        // conditions:
        const fromWishGroup = (
            isGroupedWishes
            ? wishGroup
            : null
        );
        if (!fromWishGroup) return;
        
        
        
        // actions:
        try {
            await updateWish({
                productId       : model.id,
                groupId         : null,
                originalGroupId : fromWishGroup.id,
            }).unwrap();
            
            
            
            showDialog<unknown>(
                <NotifyDialog theme='success'>
                    <p>
                        Item has been deleted from <strong>{fromWishGroup.name}</strong> collection!
                    </p>
                </NotifyDialog>
            );
        }
        catch {
            showMessageError({
                title : <h1>Error Deleting Wish</h1>,
                error : <>
                    <p>
                        Oops, something went wrong while <strong>deleting your last wish</strong>.
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
    const handleDeleteFromWishlist   = useEvent(async (): Promise<void> => {
        // conditions:
        const fromWishGroup = (
            isGroupedWishes
            ? wishGroup
            : null
        );
        if (fromWishGroup === undefined) return;
        
        
        
        // actions:
        try {
            await deleteWish({
                productId       : model.id,
                originalGroupId : (fromWishGroup !== null) ? fromWishGroup.id : null,
            }).unwrap();
            
            
            
            showDialog<unknown>(
                <NotifyDialog theme='success'>
                    <p>
                        Item has been deleted from wishlist!
                    </p>
                </NotifyDialog>
            );
        }
        catch {
            showMessageError({
                title : <h1>Error Deleting Wish</h1>,
                error : <>
                    <p>
                        Oops, something went wrong while <strong>deleting your last wish</strong>.
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
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restDropdownListButtonProps}
        >
            {isGroupedWishes && <>
                <ListItem onClick={handleMoveToCollection}>
                    <Icon icon='forward' /> Move to another collection
                </ListItem>
                <ListItem theme='danger' onClick={handleDeleteFromCollection}>
                    <Icon icon='delete' /> Delete from this collection
                </ListItem>
                <ListItem theme='danger' onClick={handleDeleteFromWishlist}>
                    <Icon icon='delete' /> Delete from this collection and wishlist
                </ListItem>
            </>}
            {!isGroupedWishes && <>
                <ListItem onClick={handleMoveToCollection}>
                    <Icon icon='forward' /> Add to collection
                </ListItem>
                <ListItem theme='danger' onClick={handleDeleteFromWishlist}>
                    <Icon icon='delete' /> Delete from wishlist
                </ListItem>
            </>}
        </DropdownListButton>
    );
};
export {
    WishActionMenu,            // named export for readibility
    WishActionMenu as default, // default export to support React.lazy
}
