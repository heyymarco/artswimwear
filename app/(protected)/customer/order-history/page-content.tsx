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
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    OrderHistoryPreview,
}                           from '@/components/views/OrderHistoryPreview'

// models:
import {
    type PublicOrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetOrderHistoryPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function OrderHistoryPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider
            // data:
            useGetModelPage={useGetOrderHistoryPage}
        >
            <OrderHistoryPageContentInternal />
        </PaginationStateProvider>
    );
}
function OrderHistoryPageContentInternal(): JSX.Element|null {
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
                <PaginationList<PublicOrderDetail>
                    // components:
                    modelPreviewComponent={
                        <OrderHistoryPreview
                            // data:
                            model={undefined as any}
                        />
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}
