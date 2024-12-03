'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'


// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    OrderableList,
    type OrderableListItemProps,
}                           from '@heymarco/orderable-list'

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
    ModelCreateOuter,
    type ModelPreviewProps,
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
    paymentMethodLimitMax,
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
    const isMaxLimitReached = ((data?.total ?? 0) >= paymentMethodLimitMax);
    
    
    
    // handlers:
    const handleChildrenChange = useEvent((children: React.ReactElement<OrderableListItemProps<HTMLElement, unknown>>[]) => {
        const orderedIds = children.map(({props}) => props).filter((props): props is ModelPreviewProps<PaymentMethodDetail> => 'model' in props).map(({model}) => model.id);
        console.log('moved: ', orderedIds);
    });
    
    
    
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
                    createItemText={isMaxLimitReached ? `Max Payment Method is ${paymentMethodLimitMax}` : 'Add New Payment Method'}
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
                    modelAddComponent={
                        isMaxLimitReached
                        ? <ModelCreateOuter enabled={false} />
                        : undefined
                    }
                    listComponent={
                        <OrderableList
                            // handlers:
                            onChildrenChange={handleChildrenChange}
                        />
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}
