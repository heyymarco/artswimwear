'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    useEditPaymentMethodDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// payment components:
import {
    ConditionalPaymentScriptProvider,
}                           from '@/components/payments/ConditionalPaymentScriptProvider'
import {
    ConditionalPaypalCardComposerProvider,
}                           from '@/components/payments/ConditionalPaypalCardComposerProvider'
import {
    ConditionalCreditCardNumberEditor,
}                           from '@/components/payments/ConditionalCreditCardNumberEditor'
import {
    ConditionalCreditCardNameEditor,
}                           from '@/components/payments/ConditionalCreditCardNameEditor'
import {
    ConditionalCreditCardExpiryEditor,
}                           from '@/components/payments/ConditionalCreditCardExpiryEditor'
import {
    ConditionalCreditCardCvvEditor,
}                           from '@/components/payments/ConditionalCreditCardCvvEditor'
import {
    ConditionalCreditCardButton,
}                           from '@/components/payments/ConditionalCreditCardButton'

// internal components:
import {
    // types:
    UpdateHandler,
    
    DeleteHandler,
    
    ConfirmDeleteHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type PaymentMethodDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdatePaymentMethod,
    useDeletePaymentMethod,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_PAYMENT_METHODS_TAB_DATA,
    PAGE_PAYMENT_METHODS_TAB_DELETE,
}                           from '@/website.config'
import {
    type checkoutConfigClient,
}                           from '@/checkout.config.client'



// react components:
export interface EditPaymentMethodDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<PaymentMethodDetail>
{
}
const EditPaymentMethodDialog = (props: EditPaymentMethodDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditPaymentMethodDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
    ...restComplexEditModelDialogProps} = props;
    const modelAliasName = model ? `${model.brand} •••${model.identifier}` : undefined;
    const modelType = ((): string|undefined => {
        if (!model) return undefined;
        switch(model.type) {
            case 'CARD'    : return 'card';
            case 'PAYPAL'  : return 'paypal';
            case 'EWALLET' : return 'e-wallet';
            default        : return undefined;
        } // switch
    })();
    
    const appropriatePaymentProcessors : (typeof checkoutConfigClient.payment.preferredProcessors) = [
        'paypal',
    ];
    
    
    
    // stores:
    const [updatePaymentMethod, {isLoading : isLoadingUpdate}] = useUpdatePaymentMethod();
    const [deletePaymentMethod, {isLoading : isLoadingDelete}] = useDeletePaymentMethod();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<PaymentMethodDetail>>(async ({id}) => {
        return await updatePaymentMethod({
            id : id ?? '',
            
            // name,
        }).unwrap();
    });
    
    const handleDelete         = useEvent<DeleteHandler<PaymentMethodDetail>>(async ({id}) => {
        await deletePaymentMethod({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<PaymentMethodDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete {modelType ? `${modelType} ` : ''}<strong>{modelAliasName}</strong>?
                </p>
            </>,
        };
    });
    
    
    
    // jsx:
    const mainTabContent = (
        <>
            <ConditionalCreditCardNumberEditor appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardNameEditor   appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardExpiryEditor appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardCvvEditor    appropriatePaymentProcessors={appropriatePaymentProcessors} />
            <ConditionalCreditCardButton />
        </>
    );
    const mainTab = (
        !model
        ? <form className={styleSheet.collectionTab}>
            {mainTabContent}
        </form>
        : <TabPanel label={PAGE_PAYMENT_METHODS_TAB_DATA} panelComponent={<Generic className={styleSheet.collectionTab} />}>
            {mainTabContent}
        </TabPanel>
    );
    return (
        <ConditionalPaymentScriptProvider
            // required:
            currency='USD'
        >
            <ConditionalPaypalCardComposerProvider>
                <ComplexEditModelDialog<PaymentMethodDetail>
                    // other props:
                    {...restComplexEditModelDialogProps}
                    
                    
                    
                    // data:
                    modelName='Payment Method'
                    modelEntryName={modelAliasName}
                    model={model}
                    
                    
                    
                    // privileges:
                    privilegeAdd    = {true}
                    privilegeUpdate = {undefined}
                    privilegeDelete = {true}
                    
                    
                    
                    // stores:
                    isCommiting = {isLoadingUpdate}
                    isDeleting  = {isLoadingDelete}
                    
                    
                    
                    // tabs:
                    tabDelete   = {PAGE_PAYMENT_METHODS_TAB_DELETE}
                    
                    
                    
                    // auto focusable:
                    autoFocusOn={props.autoFocusOn ?? firstEditorRef}
                    
                    
                    
                    // handlers:
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    
                    onConfirmDelete={handleConfirmDelete}
                >
                    {mainTab}
                </ComplexEditModelDialog>
            </ConditionalPaypalCardComposerProvider>
        </ConditionalPaymentScriptProvider>
    );
};
export {
    EditPaymentMethodDialog,
    EditPaymentMethodDialog as default,
}