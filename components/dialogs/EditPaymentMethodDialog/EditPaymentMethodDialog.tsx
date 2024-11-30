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

// cart components:
import {
    CartStateProvider,
}                           from '@/components/Cart/states/cartState'

// transaction components:
import {
    TransactionStateProvider,
}                           from '@/components/payments/states'

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
    // types:
    type ProductPreview,
    
    type ShippingAddressDetail,
    type BillingAddressDetail,
    
    type PaymentDetail,
    
    type CustomerOrGuestPreview,
    type CustomerPreferenceDetail,
    
    type CheckoutStep,
    type TotalShippingCostStatus,
    type PaymentMethod,
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
    type FinishedOrderState,
    type BusyState,
    type CheckoutSession,
    
    type CartDetail,
    type CartUpdateRequest,
    
    type PaymentMethodDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdatePaymentMethod,
    useDeletePaymentMethod,
    useCreateSetupPayment,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_PAYMENT_METHODS_TAB_DATA,
    PAGE_PAYMENT_METHODS_TAB_DELETE,
}                           from '@/website.config'



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
    
    
    
    // stores:
    const [updatePaymentMethod, {isLoading : isLoadingUpdate}] = useUpdatePaymentMethod();
    const [deletePaymentMethod, {isLoading : isLoadingDelete}] = useDeletePaymentMethod();
    const [createSetupPayment] = useCreateSetupPayment();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<PaymentMethodDetail>>(async ({id}) => {
        return await updatePaymentMethod({
            id : id ?? '',
            
            vaultToken : '', // TODO create|update the card with vaultToken
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
    
    const handlePrepareTransaction = useEvent(async (): Promise<boolean> => {
        return true;
    });
    const handleTransaction        = useEvent(async (transaction: (() => Promise<void>)): Promise<void> => {
        await transaction();
    });
    const handlePlaceOrder         = useEvent(async (options?: PlaceOrderRequestOptions): Promise<PlaceOrderDetail|PaymentDetail> => {
        return {
            orderId : await createSetupPayment({
                provider: 'PAYPAL',
            }).unwrap(),
        } satisfies PlaceOrderDetail;
    });
    const handleCancelOrder        = useEvent(async (orderId: string): Promise<void> => {
        console.log('error: ', orderId);
    });
    const handleMakePayment        = useEvent(async (orderId: string): Promise<PaymentDetail> => {
        const vaultToken = orderId;
        const newPaymentMethod = await updatePaymentMethod({
            id : '',
            
            vaultToken,
        }).unwrap();
        
        const {
            // records:
            id,
            
            
            
            // data:
            currency,
            
            type,
            brand,
            identifier,
            
            expiresAt,
            
            billingAddress,
        } = newPaymentMethod;
        return {
            type       : type,
            brand      : brand,
            identifier : identifier,
            amount     : 0,
            fee        : 0,
        } satisfies PaymentDetail;
    });
    const handleFinishOrder        = useEvent((paymentDetail: PaymentDetail): void => {
    });
    
    
    
    // jsx:
    const mainTabContent = (
        <CartStateProvider>
            <TransactionStateProvider
                // payment data:
                paymentValidation={false}
                
                
                
                // billing data:
                billingValidation={false}
                billingAddress={null}
                
                
                
                // states:
                isTransactionReady={true}
                
                
                
                // actions:
                onPrepareTransaction={handlePrepareTransaction}
                onTransaction={handleTransaction}
                onPlaceOrder={handlePlaceOrder}
                onCancelOrder={handleCancelOrder}
                onMakePayment={handleMakePayment}
                onFinishOrder={handleFinishOrder}
            >
                <ConditionalPaymentScriptProvider
                    // required for purchasing:
                    totalShippingCost={null} // not_physical_product
                >
                    <ConditionalPaypalCardComposerProvider saveCardMode={true}>
                        <ConditionalCreditCardNumberEditor />
                        <ConditionalCreditCardNameEditor />
                        <ConditionalCreditCardExpiryEditor />
                        <ConditionalCreditCardCvvEditor />
                        <ConditionalCreditCardButton>
                            Save
                        </ConditionalCreditCardButton>
                    </ConditionalPaypalCardComposerProvider>
                </ConditionalPaymentScriptProvider>
            </TransactionStateProvider>
        </CartStateProvider>
    );
    const mainTab = (
        !model
        ? <div className={styleSheet.collectionTab}>
            {mainTabContent}
        </div>
        : <TabPanel label={PAGE_PAYMENT_METHODS_TAB_DATA} panelComponent={<Generic className={styleSheet.collectionTab} />}>
            {mainTabContent}
        </TabPanel>
    );
    return (
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
    );
};
export {
    EditPaymentMethodDialog,
    EditPaymentMethodDialog as default,
}
