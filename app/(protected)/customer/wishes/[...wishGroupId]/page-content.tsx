'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useWishAllPageStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    NavItem,
    Nav,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    WideMainPage,
}                           from '@/components/pages/WideMainPage'
import {
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    ProductCard,
}                           from '@/components/views/ProductCard'
import {
    NotifyDialog,
}                           from '@/components/dialogs/NotifyDialog'
import {
    MoveWishDialog,
}                           from '@/components/dialogs/MoveWishDialog'

// models:
import {
    type Pagination,
    type PaginationArgs,
    
    type ProductPreview,
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishPage as _useGetWishPage,
    
    useUpdateWish,
    useDeleteWish,
}                           from '@/store/features/api/apiSlice'



// react components:
const useUseGetWishPageOfGroup = ({ groupId }: { groupId: string|undefined }) => {
    return (arg: PaginationArgs) => {
        return _useGetWishPage({
            ...arg,
            groupId,
        });
    };
};
export function WishAllPageContent({ wishGroupId }: { wishGroupId: string }): JSX.Element|null {
    // stores:
    const isGroupedWishes = (wishGroupId && (wishGroupId !== 'all'));
    const _useGetWishOfGroupPage = useUseGetWishPageOfGroup({
        groupId : isGroupedWishes ? wishGroupId : undefined,
    });
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<ProductPreview>
            // data:
            useGetModelPage={_useGetWishOfGroupPage}
        >
            <WishAllPageContentInternal wishGroupId={wishGroupId} />
        </PaginationStateProvider>
    );
}
function WishAllPageContentInternal({ wishGroupId }: { wishGroupId: string }): JSX.Element|null {
    // styles:
    const styleSheet = useWishAllPageStyleSheet();
    
    
    
    // stores:
    const {
        data: dataRaw,
    } = usePaginationState<ProductPreview>();
    const data = dataRaw as (Pagination<ProductPreview> & { wishGroup : WishGroupDetail|null })|undefined;
    const isGroupedWishes = (wishGroupId && (wishGroupId !== 'all'));
    const wishGroup = data?.wishGroup;
    const wishGroupNameFn = (
        isGroupedWishes
        ? wishGroup?.name ?? 'Loading...'
        : 'All'
    );
    
    
    
    // apis:
    const [updateWish] = useUpdateWish();
    const [deleteWish] = useDeleteWish();
    
    
    
    // dialogs:
    const {
        showDialog,
        showMessageError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleMoveToCollection     = useEvent(async (model: ProductPreview): Promise<void> => {
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
    const handleDeleteFromCollection = useEvent(async (model: ProductPreview): Promise<void> => {
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
    const handleDeleteFromWishlist   = useEvent(async (model: ProductPreview): Promise<void> => {
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
        <WideMainPage
            // classes:
            className={styleSheet.main}
        >
            <Section
                // classes:
                className={styleSheet.nav}
            >
                <Nav
                    // variants:
                    theme='primary'
                    listStyle='breadcrumb'
                    orientation='inline'
                >
                    <NavItem end>
                        <Link href='/customer/wishes'>
                            Wishlist
                        </Link>
                    </NavItem>
                    
                    <NavItem end>
                        <Link href={`/customer/wishes/${encodeURIComponent(wishGroupId)}`} >
                            {wishGroupNameFn}
                        </Link>
                    </NavItem>
                </Nav>
            </Section>
            
            <Section
                // variants:
                theme='primary'
                
                
                
                // classes:
                className={styleSheet.gallery}
            >
                <PaginationGallery<ProductPreview>
                    // appearances:
                    showPaginationTop={false}
                    autoHidePagination={true}
                    
                    
                    
                    // accessibilities:
                    textEmpty='The collection is empty'
                    
                    
                    
                    // components:
                    bodyComponent={
                        <Basic nude={true} />
                    }
                    modelPreviewComponent={
                        <ProductCard
                            // data:
                            model={undefined as any}
                            
                            
                            
                            // components:
                            buttonWishComponent={null}
                            dropdownListButtonComponent={({ model }) =>
                                <DropdownListButton>
                                    {isGroupedWishes && <>
                                        <ListItem onClick={() => handleMoveToCollection(model)}>
                                            <Icon icon='forward' /> Move to another collection
                                        </ListItem>
                                        <ListItem theme='danger' onClick={() => handleDeleteFromCollection(model)}>
                                            <Icon icon='delete' /> Delete from this collection
                                        </ListItem>
                                        <ListItem theme='danger' onClick={() => handleDeleteFromWishlist(model)}>
                                            <Icon icon='delete' /> Delete from this collection and wishlist
                                        </ListItem>
                                    </>}
                                    {!isGroupedWishes && <>
                                        <ListItem onClick={() => handleMoveToCollection(model)}>
                                            <Icon icon='forward' /> Add to collection
                                        </ListItem>
                                        <ListItem theme='danger' onClick={() => handleDeleteFromWishlist(model)}>
                                            <Icon icon='delete' /> Delete from wishlist
                                        </ListItem>
                                    </>}
                                </DropdownListButton>
                            }
                        />
                    }
                />
            </Section>
        </WideMainPage>
    );
}
