'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
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
    useSetTimeout,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // simple-components:
    type ButtonIconProps,
    
    
    
    // dialog-components:
    ModalCard,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type Address as EditorAddress,
    AddressEditor,
}                           from '@/components/editors/AddressEditor'

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
    useOnFinishOrder,
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

// states:
import {
    useTransactionState,
}                           from '@/components/payments/states'

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
    
    
    
    // props:
    const {
        // data:
        model = null,
    ...restComplexEditModelDialogProps} = props;
    const modelAliasName = model ? `${model.brand} •••• •••• •••• ${model.identifier}` : undefined;
    const modelType = ((): string|undefined => {
        if (!model) return undefined;
        switch(model.type) {
            case 'CARD'    : return 'card';
            case 'PAYPAL'  : return 'paypal';
            case 'EWALLET' : return 'e-wallet';
            default        : return undefined;
        } // switch
    })();
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // states:
    let [isLoadingTransaction, setIsLoadingTransaction] = useState<boolean>(false);
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // stores:
    const [updatePaymentMethod, {isLoading : isLoadingUpdate}] = useUpdatePaymentMethod();
    const [deletePaymentMethod, {isLoading : isLoadingDelete}] = useDeletePaymentMethod();
    const [createSetupPayment] = useCreateSetupPayment();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
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
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true); // enable paymentForm & billingAddress validation
        
        // wait for a validation state applied:
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        
        return true; // ready
    });
    const handleTransaction        = useEvent(async (transaction: (() => Promise<void>)): Promise<void> => {
        // conditions:
        if (isLoadingTransaction) return; // prevents for accidentally double transactions
        
        
        
        // actions:
        setIsLoadingTransaction(isLoadingTransaction = true); /* instant update without waiting for (slow|delayed) re-render */
        try {
            await transaction();
        }
        catch {
            // ignore any error
        }
        finally {
            setIsLoadingTransaction(isLoadingTransaction = false); /* instant update without waiting for (slow|delayed) re-render */
        } // try
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
    
    
    
    // jsx:
    const mainTabContent = (
        <ValidationProvider
            // validations:
            enableValidation={enableValidation}
            inheritValidation={false}
        >
            <CreditCardLayout />
        </ValidationProvider>
    );
    const mainTab = (
        !model
        ? <div className={styleSheet.creditCardTab}>
            {mainTabContent}
        </div>
        : <TabPanel label={PAGE_PAYMENT_METHODS_TAB_DATA} panelComponent={<Generic className={styleSheet.creditCardTab} />}>
            {mainTabContent}
        </TabPanel>
    );
    return (
        <CartStateProvider>
            <TransactionStateProvider
                // payment data:
                paymentValidation={enableValidation}
                
                
                
                // billing data:
                billingValidation={enableValidation}
                billingAddress={null}
                
                
                
                // states:
                isTransactionReady={true}
                
                
                
                // actions:
                onPrepareTransaction={handlePrepareTransaction}
                onTransaction={handleTransaction}
                onPlaceOrder={handlePlaceOrder}
                onCancelOrder={handleCancelOrder}
                onMakePayment={handleMakePayment}
            >
                <ConditionalPaymentScriptProvider
                    // required for purchasing:
                    totalShippingCost={null} // not_physical_product
                >
                    <ConditionalPaypalCardComposerProvider saveCardMode={true}>
                        <ComplexEditModelDialog<PaymentMethodDetail>
                            // other props:
                            {...restComplexEditModelDialogProps}
                            
                            
                            
                            // data:
                            modelName='Payment Method'
                            modelEntryName={modelAliasName}
                            model={model}
                            
                            
                            
                            // privileges:
                            privilegeAdd    = {true}
                            privilegeUpdate = {useMemo(() => ({
                                any : true,
                            }), [])}
                            privilegeDelete = {true}
                            
                            
                            
                            // stores:
                            isCommiting = {isLoadingUpdate || isLoadingTransaction}
                            isDeleting  = {isLoadingDelete}
                            
                            
                            
                            // variants:
                            horzAlign='stretch'
                            
                            
                            
                            // tabs:
                            tabDelete   = {PAGE_PAYMENT_METHODS_TAB_DELETE}
                            
                            
                            
                            // auto focusable:
                            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
                            
                            
                            
                            // components:
                            buttonSaveComponent={<ButtonSaveIntercept />}
                            modalCardComponent={<ModalCard className={styleSheet.dialog} />}
                            
                            
                            
                            // handlers:
                            onDelete={handleDelete}
                            
                            onConfirmDelete={handleConfirmDelete}
                        >
                            {mainTab}
                        </ComplexEditModelDialog>
                    </ConditionalPaypalCardComposerProvider>
                </ConditionalPaymentScriptProvider>
            </TransactionStateProvider>
        </CartStateProvider>
    );
};
export {
    EditPaymentMethodDialog,            // named export for readibility
    EditPaymentMethodDialog as default, // default export to support React.lazy
}



const CreditCardLayout = (): JSX.Element|null => {
    // styles:
    const styleSheet = useEditPaymentMethodDialogStyleSheet();
    
    
    
    // states:
    const {
        // sections:
        paymentCardSectionRef,
        billingAddressSectionRef,
    } = useTransactionState();
    
    
    
    // jsx:
    return (
        <form ref={paymentCardSectionRef} className={styleSheet.creditCardForm}>
            <section>
                <p>
                    Enter your card information:
                </p>
                <div className={styleSheet.creditCardLayout}>
                    <ConditionalCreditCardNumberEditor />
                    <ConditionalCreditCardNameEditor />
                    <ConditionalCreditCardExpiryEditor />
                    <ConditionalCreditCardCvvEditor />
                    {/* <ConditionalCreditCardButton>
                        Save
                    </ConditionalCreditCardButton> */}
                </div>
            </section>
            
            <hr />
            
            <section
                // refs:
                ref={billingAddressSectionRef}
                
                
                
                // classes:
                className='billing'
            >
                <p>
                    <em>Optionally</em>, enter the address that matches your card&apos;s billing address:
                </p>
                <AddressEditor
                    // types:
                    addressType       = 'billing'
                    
                    
                    
                    // values:
                    // value       = {editorAddress}
                    // onChange    = {handleChange}
                    
                    
                    
                    // validations:
                    required={false}
                    
                    
                    
                    // components:
                    companyEditorComponent={null}
                />
            </section>
        </form>
    );
};



const ButtonSaveIntercept = (props: ButtonIconProps): JSX.Element|null => {
    // props:
    const {
        // varaints:
        gradient = false,
        
        
        
        // handlers:
        onClick,
        
        
        
        // children:
        children = 'Save',
        
        
        
        // other props:
        ...restButtonSaveProps
    } = props;
    
    
    
    // handlers:
    const handleFinishOrder = useEvent((paymentDetail: PaymentDetail): void => {
        onClick?.(undefined as any);
    });
    
    
    
    // states:
    useOnFinishOrder(handleFinishOrder);
    
    
    
    // jsx:
    return (
        <ConditionalCreditCardButton
            // other props:
            {...restButtonSaveProps}
            
            
            
            // varaints:
            gradient={gradient}
        >
            {children}
        </ConditionalCreditCardButton>
    );
};
