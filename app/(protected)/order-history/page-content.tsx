'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    // style sheets:
    useOrderHistoryPageStyleSheet,
}                           from './styles/loader'

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'

// internal components:
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
    // styles:
    const styleSheets = useOrderHistoryPageStyleSheet();
    
    
    
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
        <Main className={styleSheets.main}>
            <PaginationExplorer<PublicOrderDetail>
                // components:
                modelPreviewComponent={
                    <OrderHistoryPreview
                        // data:
                        model={undefined as any}
                    />
                }
            />
        </Main>
    );
}
