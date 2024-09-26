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
    const isGroupedWishes = (wishGroupId && (wishGroupId !== 'all'));
    
    const {
        data: dataRaw,
    } = usePaginationState<ProductPreview>();
    const data = dataRaw as GetWishPageResponse|undefined;
    
    /**
     * `undefined`       : AMBIGOUS: wish pagination of all wishes (grouped wishes + ungrouped wishes) -or- still loading.  
     * `WishGroupDetail` : wish pagination of a specific wishGroup.  
     */
    const wishGroup = (
        isGroupedWishes
        ? (
            (data === undefined)
            ? undefined           // still loading (undefined)
            : data.wishGroup      // wish pagination of a specific wishGroup (WishGroupDetail) -or- wish pagination of all wishes (grouped wishes + ungrouped wishes)
        )
        : undefined               // wish pagination of all wishes (grouped wishes + ungrouped wishes), known instantly without waiting for loading completed
    );
    
    const wishGroupNameFn = (
        (wishGroup === undefined) // AMBIGOUS: wish pagination of all wishes (grouped wishes + ungrouped wishes) -or- still loading
        ? (
            isGroupedWishes
            ? 'Loading...'        // still loading
            : 'All'               // wish pagination of all wishes (grouped wishes + ungrouped wishes)
        )
        : wishGroup.name          // wish pagination of a specific wishGroup
    );
    
    
    
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
                            dropdownListButtonComponent={(wishGroup === undefined) ? null : ({ model }) =>
                                <WishActionMenu
                                    // data:
                                    model={model}
                                    wishGroup={wishGroup}
                                />
                            }
                        />
                    }
                />
            </Section>
        </WideMainPage>
    );
}
