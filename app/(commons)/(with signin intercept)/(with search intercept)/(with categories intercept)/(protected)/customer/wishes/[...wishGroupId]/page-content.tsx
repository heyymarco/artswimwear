'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // composite-components:
    NavItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    ProductCard,
    EmptyProductCard,
}                           from '@/components/views/ProductCard'
import {
    ProductGalleryPage,
}                           from '@/components/views/ProductGalleryPage'

// private components:
import {
    WishActionMenu,
}                           from './WishActionMenu'

// models:
import {
    type PaginationArgs,
    
    type ProductPreview,
    type GetWishPageResponse,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishPage as _useGetWishPage,
}                           from '@/store/features/api/apiSlice'



// hooks:
const useUseGetWishPageOfGroup = ({ groupId }: { groupId: string|undefined }) => {
    return (arg: PaginationArgs) => {
        return _useGetWishPage({
            ...arg,
            groupId,
        });
    };
};



// react components:
export function WishAllPageContent({ wishGroupId }: { wishGroupId: string }): JSX.Element|null {
    // stores:
    const isGroupedWishes = (!!wishGroupId && (wishGroupId !== 'all')); // empty_string|'all' => ungrouped wishes
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
    // stores:
    const isGroupedWishes = (!!wishGroupId && (wishGroupId !== 'all')); // empty_string|'all' => ungrouped wishes
    
    const {
        data: dataRaw,
    } = usePaginationState<ProductPreview>();
    const data = dataRaw as GetWishPageResponse|undefined;
    
    /**
     * `false`           : still loading -or- load error.  
     * `undefined`       : wish pagination of all wishes (grouped wishes + ungrouped wishes).  
     * `WishGroupDetail` : wish pagination of a specific wishGroup.  
     */
    const wishGroup = (
        isGroupedWishes
        ? (
            (data === undefined)
            ? false                   // still loading -or- load error
            : data.wishGroup          // wish pagination of a specific wishGroup -or- wish pagination of all wishes (grouped wishes + ungrouped wishes)
        )
        : undefined                   // wish pagination of all wishes (grouped wishes + ungrouped wishes), known instantly without waiting for loading completed
    );
    
    const wishGroupName = (
        (wishGroup === false)
        ? 'Loading...'                // still loading -or- load error
        : (
            (wishGroup === undefined)
            ? 'All'                   // wish pagination of all wishes (grouped wishes + ungrouped wishes)
            : wishGroup.name          // wish pagination of a specific wishGroup
        )
    );
    
    
    
    // jsx:
    return (
        <ProductGalleryPage
            // children:
            navItems={
                <>
                    <NavItem active={false}>
                        <Link href='/customer/wishes' prefetch={true}>
                            Wishlist
                        </Link>
                    </NavItem>
                    
                    <NavItem active={true}>
                        <Link href={`/customer/wishes/${encodeURIComponent(wishGroupId)}`} prefetch={true}>
                            {wishGroupName}
                        </Link>
                    </NavItem>
                </>
            }
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
                modelEmptyComponent={
                    <EmptyProductCard
                        // accessibilities:
                        emptyText='There are no products on this collection.'
                    />
                }
                modelPreviewComponent={
                    <ProductCard
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // components:
                        buttonWishComponent={null}
                        dropdownListButtonComponent={
                            (wishGroup || (wishGroup === undefined))
                            ? ({ model }) => // `WishGroupDetail`|`undefined` => wish pagination of a specific wishGroup -or- wish pagination of all wishes (grouped wishes + ungrouped wishes) => shows action menu
                                <WishActionMenu
                                    // data:
                                    model={model}
                                    wishGroup={wishGroup}
                                />
                            : null // `false` => still loading -or- load error => no action menu needed
                        }
                    />
                }
            />
        </ProductGalleryPage>
    );
}
