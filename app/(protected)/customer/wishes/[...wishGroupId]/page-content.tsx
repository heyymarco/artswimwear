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

// models:
import {
    type PaginationArgs,
    type Pagination,
}                           from '@/libs/types'
import {
    type ProductPreview,
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishPage as _useGetWishPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function WishAllPageContent({ wishGroupId }: { wishGroupId: string }): JSX.Element|null {
    // stores:
    const useGetWishPageIntercept = useEvent((arg: PaginationArgs) => {
        return _useGetWishPage({
            ...arg,
            groupId : (wishGroupId && (wishGroupId !== 'all')) ? wishGroupId : undefined,
        });
    });
    
    
    
    // jsx:
    return (
        <PaginationStateProvider<ProductPreview>
            // data:
            useGetModelPage={useGetWishPageIntercept}
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
    const wishGroupNameFn = (
        (!wishGroupId || (wishGroupId === 'all'))
        ? 'All'
        : data?.wishGroup?.name ?? 'Loading...'
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
                        />
                    }
                />
            </Section>
        </WideMainPage>
    );
}
