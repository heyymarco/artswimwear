'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    SimpleMainPage,
}                           from '@/components/pages/SimpleMainPage'
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    PaginationStateProvider,
    usePaginationState,
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
    type PublicOrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishGroupPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function WishPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider
            // data:
            useGetModelPage={useGetWishGroupPage}
        >
            <WishPageContentInternal />
        </PaginationStateProvider>
    );
}
function WishPageContentInternal(): JSX.Element|null {
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<PublicOrderDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    // if (isLoadingAndNoData) return <PageLoading />;
    // if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <Section theme='primary'>
                <PaginationGallery<PublicOrderDetail>
                    // accessibilities:
                    textEmpty='The collection is empty'
                    
                    
                    
                    // components:
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
        </SimpleMainPage>
    );
}
