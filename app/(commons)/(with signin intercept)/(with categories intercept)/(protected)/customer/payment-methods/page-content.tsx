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
import {
    EditPaymentMethodDialog,
}                           from '@/components/dialogs/EditPaymentMethodDialog'

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
            // states:
            initialPerPage={10}
            
            
            
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
                    // appearances:
                    showPaginationTop={false}
                    autoHidePagination={true}
                    
                    
                    
                    // accessibilities:
                    createItemText='Add New Payment Method'
                    textEmpty='Your payment method is empty'
                    
                    
                    
                    // components:
                    modelPreviewComponent={
                        <PaymentMethodView
                            // data:
                            model={undefined as any}
                        />
                    }
                    modelCreateComponent={
                        <EditPaymentMethodDialog
                            // data:
                            model={null} // create a new model
                        />
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}