'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    PaginationExplorerStateProvider,
    usePaginationExplorerState,
    PaginationExplorer,
}                           from '@/components/explorers/PaginationExplorer'
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
        <PaginationExplorerStateProvider
            // data:
            useGetModelPage={useGetOrderHistoryPage}
        >
            <OrderHistoryPageContentInternal />
        </PaginationExplorerStateProvider>
    );
}
function OrderHistoryPageContentInternal(): JSX.Element|null {
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationExplorerState<PublicOrderDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <PaginationExplorer<PublicOrderDetail>
                // components:
                modelPreviewComponent={
                    <OrderHistoryPreview
                        // data:
                        model={undefined as any}
                    />
                }
            />
        </SimpleMainPage>
    );
}
