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
    WishlistGroupImage,
}                           from '@/components/views/WishlistGroupImage'

// models:
import {
    type PublicOrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishlistGroupPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function WishlistPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider
            // data:
            useGetModelPage={useGetWishlistGroupPage}
        >
            <WishlistPageContentInternal />
        </PaginationStateProvider>
    );
}
function WishlistPageContentInternal(): JSX.Element|null {
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<PublicOrderDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <Section theme='primary'>
                <PaginationGallery<PublicOrderDetail>
                    // components:
                    modelPreviewComponent={
                        <WishlistGroupImage
                            // data:
                            model={undefined as any}
                        />
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}
