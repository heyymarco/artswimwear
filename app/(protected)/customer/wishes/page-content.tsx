'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useWishesPageStyleSheet,
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
    InterceptPaginationStateProvider,
}                           from '@/components/explorers/Pagination'
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    WishGroupImage,
}                           from '@/components/views/WishGroupImage'
import {
    EditWishGroupDialog,
}                           from '@/components/dialogs/EditWishGroupDialog'

// models:
import {
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishGroupPage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    handleWishGroupPageIntercept,
}                           from './utilities'



// react components:
export function WishPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider<WishGroupDetail>
            // data:
            useGetModelPage={useGetWishGroupPage}
        >
            <InterceptPaginationStateProvider
                // handlers:
                onIntercept={handleWishGroupPageIntercept}
            >
                <WishPageContentInternal />
            </InterceptPaginationStateProvider>
        </PaginationStateProvider>
    );
}
function WishPageContentInternal(): JSX.Element|null {
    // styles:
    const styleSheet = useWishesPageStyleSheet();
    
    
    
    // jsx:
    return (
        <WideMainPage>
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
                </Nav>
            </Section>
            
            <Section
                // variants:
                theme='primary'
                
                
                
                // classes:
                className={styleSheet.gallery}
            >
                <PaginationGallery<WishGroupDetail>
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
                        <WishGroupImage
                            // data:
                            model={undefined as any}
                        />
                    }
                    modelCreateComponent={
                        <EditWishGroupDialog
                            // data:
                            model={null} // create a new model
                        />
                    }
                />
            </Section>
        </WideMainPage>
    );
}
