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

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // composite-components:
    NavItem,
    Nav,
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
    WideGalleryPage,
}                           from '@/components/pages/WideGalleryPage'
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
    // styles:
    const styleSheet = useWishAllPageStyleSheet();
    
    
    
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
        <WideGalleryPage theme='primary'>
            <Section
                // classes:
                className={styleSheet.nav}
            >
                <Nav
                    // variants:
                    listStyle='breadcrumb'
                    orientation='inline'
                >
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
                </Nav>
            </Section>
            
            <Section
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
            </Section>
        </WideGalleryPage>
    );
}
