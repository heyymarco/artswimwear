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
    PaymentMethodView,
}                           from '@/components/views/PaymentMethodView'

// models:
import {
    type PaymentMethodDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPaymentMethodPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function PaymentMethodPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider<PaymentMethodDetail>
            // data:
            useGetModelPage={useGetPaymentMethodPage}
        >
            <PaymentMethodPageContentInternal />
        </PaginationStateProvider>
    );
}
function PaymentMethodPageContentInternal(): JSX.Element|null {
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<PaymentMethodDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage theme='primary'>
            <Section>
                <PaginationList<PaymentMethodDetail>
                    // components:
                    modelPreviewComponent={
                        <PaymentMethodView
                            // data:
                            model={undefined as any}
                        />
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}
