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
    useIsomorphicLayoutEffect,
    useSetTimeout,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // dialog-components:
    ModalCard,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internal components:
import {
    type Address as EditorAddress,
    AddressEditor,
}                           from '@/components/editors/AddressEditor'
import {
    SelectCurrencyEditor,
}                           from '@/components/editors/SelectCurrencyEditor'

// payment components:
import {
    usePaymentProcessorPriority,
}                           from '@/components/payments/hooks'
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
    type ImperativeClick,
    ConditionalCreditCardButton,
}                           from '@/components/payments/ConditionalCreditCardButton'

// cart components:
import {
    useCartState,
    CartStateProvider,
}                           from '@/components/Cart/states/cartState'

// transaction components:
import {
    type PrepareTransactionArg,
    type TransactionArg,
    TransactionStateProvider,
}                           from '@/components/payments/states'

// internal components:
import {
    // types:
    type UpdateHandler,
    
    type DeleteHandler,
    
    type ConfirmDeleteHandler,
    
    
    
    // react components:
    type ComplexEditModelDialogProps,
    type ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    // types:
    type BillingAddressDetail,
    
    type PaymentDetail,
    
    type PlaceOrderRequestOptions,
    type PlaceOrderDetail,
    
    type PaymentMethodSetupDetail,
    type PaymentMethodDetail,
    type PaymentMethodProvider,
    type AffectedPaymentMethods,
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
    useCreatePaymentMethodSetup,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_PAYMENT_METHODS_TAB_DATA,
    PAGE_PAYMENT_METHODS_TAB_DELETE,
}                           from '@/website.config'
import {
    checkoutConfigClient,
}                           from '@/checkout.config.client'
import {
    paypalPaymentMethodEnabledOfCardMethod,
    stripePaymentMethodEnabledOfCardMethod,
    midtransPaymentMethodEnabledOfCardMethod,
}                           from '@/libs/payment-method-enabled'



// react components:
export interface EditPaymentMethodDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<PaymentMethodDetail>
{
}
const EditPaymentMethodDialog = (props: EditPaymentMethodDialogProps): JSX.Element|null => {
    // jsx:
    return (
        <CartStateProvider>
            <EditPaymentMethodDialogInternal {...props} />
        </CartStateProvider>
    );
};
const EditPaymentMethodDialogInternal = (props: EditPaymentMethodDialogProps): JSX.Element|null => {
    // styles:
    const styles = useEditPaymentMethodDialogStyleSheet();
    
    
    
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
            // case 'EWALLET' : return 'e-wallet';
            default        : return undefined;
        } // switch
    })();
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // states:
    let [isLoadingTransaction, setIsLoadingTransaction] = useState<boolean>(false);
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    const [billingAddress  , setBillingAddress  ] = useState<BillingAddressDetail|null>(model?.billingAddress ?? null);
    const editorAddress = useMemo((): EditorAddress|null => {
        if (!billingAddress) return null;
        return {
            ...billingAddress,
            company : '',
            zip: billingAddress.zip ?? '',
        };
    }, [billingAddress]);
    
    const {
        // accessibilities:
        currency,
    } = useCartState();
    const [savePaymentMethodEnabled, setSavePaymentMethodEnabled] = useState<boolean>(false);
    
    
    
    // stores:
    const [updatePaymentMethod, {isLoading : isLoadingUpdate}] = useUpdatePaymentMethod();
    const [deletePaymentMethod, {isLoading : isLoadingDelete}] = useDeletePaymentMethod();
    const [createPaymentMethodSetup] = useCreatePaymentMethodSetup();
    
    
    
    // refs:
    const firstEditorRef             = useRef<HTMLInputElement|null>(null);
    const imperativeClickRef         = useRef<ImperativeClick>(null);
    const paymentPriorityProviderRef = useRef<PaymentMethodProvider|null>(null);
    
    
    
    // handlers:
    const handleUpdate              = useEvent<UpdateHandler<PaymentMethodDetail>>(async ({id}) => {
        const paymentDetail = await imperativeClickRef.current?.click();
        if (!paymentDetail) throw undefined;
        
        
        
        // downgrade PaymentDetail (more data) to PaymentMethodDetail (less data):
        const {
            // data:
            type,
            brand,
            identifier,
            
            expiresAt,
            
            billingAddress,
            
            paymentId,
            
            amount,
            fee,
        } = paymentDetail;
        
        switch (type) {
            // recognized:
            case 'CARD'   :
            case 'PAYPAL' : break;
            
            // not yet recognized:
            default       : throw Error('app error');
        } // switch
        
        return {
            id : '',
            currency,
            ...paymentDetail,
            type,
            brand          : brand          ?? '',
            identifier     : identifier     ?? '',
            expiresAt      : expiresAt      ?? null,
            billingAddress : billingAddress ?? null,
        } satisfies Omit<PaymentMethodDetail, 'priority'>;
    });
    
    const handleDelete              = useEvent<DeleteHandler<PaymentMethodDetail>>(async ({id}) => {
        await deletePaymentMethod({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete       = useEvent<ConfirmDeleteHandler<PaymentMethodDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete {modelType ? `${modelType} ` : ''}<strong>{modelAliasName}</strong>?
                </p>
            </>,
        };
    });
    
    const handleEditorAddressChange = useEvent<EditorChangeEventHandler<EditorAddress|null, React.ChangeEvent<HTMLInputElement>>>((newValue, event) => {
        const address : BillingAddressDetail|null = (
            !newValue
            ? null
            : (() => {
                const {
                    company : _company,
                    ...restValue
                } = newValue;
                return {
                    ...restValue,
                    zip : newValue.zip.trim() || null,
                } satisfies BillingAddressDetail;
            })()
        );
        setBillingAddress(address);
    });
    
    const handlePrepareTransaction  = useEvent(async (arg: PrepareTransactionArg): Promise<boolean> => {
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true); // enable paymentForm & billingAddress validation
        
        // wait for a validation state applied:
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
        
        return true; // ready
    });
    const handleTransaction         = useEvent(async (arg: TransactionArg): Promise<void> => {
        // conditions:
        if (isLoadingTransaction) return; // prevents for accidentally double transactions
        
        
        
        // options:
        const {
            transaction,
        } = arg;
        
        
        
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
    const handlePlaceOrder          = useEvent(async (options?: PlaceOrderRequestOptions): Promise<PlaceOrderDetail|PaymentDetail> => {
        const paymentPriorityProvider = paymentPriorityProviderRef.current;
        if (!paymentPriorityProvider) throw undefined;
        const paymentMethodSetupOrNewPaymentMethod = await createPaymentMethodSetup({
            paymentMethodProvider : paymentPriorityProvider,
            billingAddress,
            cardToken : options?.cardToken,
            
            // data for immediately updated without returning setup token:
            id : model?.id ?? '',
            currency,
        }).unwrap();
        
        
        
        if (!Array.isArray(paymentMethodSetupOrNewPaymentMethod)) {
            const {
                paymentMethodSetupToken,
                redirectData,
            } = paymentMethodSetupOrNewPaymentMethod satisfies PaymentMethodSetupDetail;
            return {
                orderId      : paymentMethodSetupToken,
                redirectData : redirectData,
            } satisfies PlaceOrderDetail;
        }
        else {
            const [newPaymentMethod] = paymentMethodSetupOrNewPaymentMethod satisfies [PaymentMethodDetail, AffectedPaymentMethods];
            return {
                ...newPaymentMethod,
                amount     : 0,
                fee        : 0,
            } satisfies PaymentDetail;
        } // if
    });
    const handleCancelOrder         = useEvent(async (orderId: string): Promise<void> => {
        console.log('error: ', orderId);
    });
    const handleMakePayment         = useEvent(async (orderId: string): Promise<PaymentDetail> => {
        const vaultToken = orderId;
        const [newPaymentMethod] = await updatePaymentMethod({
            id : model?.id ?? '',
            
            vaultToken,
            currency,
        }).unwrap();
        
        return {
            ...newPaymentMethod,
            amount     : 0,
            fee        : 0,
        } satisfies PaymentDetail;
    });
    
    
    
    // jsx:
    const mainTabContent = (
        <ConditionalPaymentScriptProvider
            // behaviors:
            saveCardMode={true}
            
            
            
            // required for purchasing:
            totalShippingCost={null} // not_physical_product
        >
            <ConditionalPaypalCardComposerProvider
                // behaviors:
                saveCardMode={true}
            >
                <UpdateSavePaymentMethodStatus setSavePaymentMethodEnabled={setSavePaymentMethodEnabled} />
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                    inheritValidation={false}
                >
                    <CreditCardLayout
                        // data:
                        editorAddress={editorAddress}
                        onEditorAddressChange={handleEditorAddressChange}
                        
                        
                        
                        // refs:
                        imperativeClickRef={imperativeClickRef}
                        paymentPriorityProviderRef={paymentPriorityProviderRef}
                        
                        
                        
                        // states:
                        savePaymentMethodEnabled={savePaymentMethodEnabled}
                    />
                </ValidationProvider>
            </ConditionalPaypalCardComposerProvider>
        </ConditionalPaymentScriptProvider>
    );
    const mainTab = (
        !model
        ? <div className={styles.creditCardTab}>
            {mainTabContent}
        </div>
        : <TabPanel label={PAGE_PAYMENT_METHODS_TAB_DATA} panelComponent={<Generic className={styles.creditCardTab} />}>
            {mainTabContent}
        </TabPanel>
    );
    return (
        <TransactionStateProvider
            // payment data:
            paymentValidation={enableValidation}
            
            
            
            // billing data:
            billingValidation={enableValidation}
            billingAddress={billingAddress}
            
            
            
            // states:
            isTransactionReady={true}
            
            
            
            // actions:
            onPrepareTransaction={handlePrepareTransaction}
            onTransaction={handleTransaction}
            onPlaceOrder={handlePlaceOrder}
            onCancelOrder={handleCancelOrder}
            onMakePayment={handleMakePayment}
        >
            <ComplexEditModelDialog<PaymentMethodDetail>
                // other props:
                {...restComplexEditModelDialogProps}
                
                
                
                // data:
                modelName='Payment Method'
                modelEntryName={modelAliasName}
                model={model}
                
                
                
                // privileges:
                privilegeAdd    = {savePaymentMethodEnabled}
                privilegeUpdate = {useMemo(() => ({
                    any : savePaymentMethodEnabled,
                }), [savePaymentMethodEnabled])}
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
                modalCardComponent={<ModalCard className={styles.dialog} />}
                
                
                
                // handlers:
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                
                onConfirmDelete={handleConfirmDelete}
            >
                {mainTab}
            </ComplexEditModelDialog>
        </TransactionStateProvider>
    );
};
export {
    EditPaymentMethodDialog,            // named export for readibility
    EditPaymentMethodDialog as default, // default export to support React.lazy
}




interface UpdateSavePaymentMethodStatusProps {
    // refs:
    setSavePaymentMethodEnabled: React.Dispatch<React.SetStateAction<boolean>>
}
const UpdateSavePaymentMethodStatus = (props: UpdateSavePaymentMethodStatusProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        setSavePaymentMethodEnabled,
    } = props;
    
    
    
    // states:
    const {
        isPaymentPriorityPaypal,
        isPaymentPriorityStripe,
        isPaymentPriorityMidtrans,
    } = usePaymentProcessorPriority();
    const savePaymentMethodEnabled = (
        (isPaymentPriorityPaypal   && paypalPaymentMethodEnabledOfCardMethod)
        ||
        (isPaymentPriorityStripe   && stripePaymentMethodEnabledOfCardMethod)
        ||
        (isPaymentPriorityMidtrans && midtransPaymentMethodEnabledOfCardMethod)
    );
    useIsomorphicLayoutEffect(() => {
        setSavePaymentMethodEnabled(savePaymentMethodEnabled);
    }, [savePaymentMethodEnabled, setSavePaymentMethodEnabled]);
    
    
    
    // jsx:
    return null;
};



interface CreditCardLayoutProps {
    // data:
    editorAddress              : EditorAddress|null
    onEditorAddressChange      : EditorChangeEventHandler<EditorAddress|null, React.ChangeEvent<HTMLInputElement>>
    
    
    
    // refs:
    imperativeClickRef         : React.RefObject<ImperativeClick> // getter ref
    paymentPriorityProviderRef : React.MutableRefObject<PaymentMethodProvider|null> // setter ref
    
    
    
    // states:
    savePaymentMethodEnabled   : boolean
}
const CreditCardLayout = (props: CreditCardLayoutProps): JSX.Element|null => {
    // props:
    const {
        // data:
        editorAddress,
        onEditorAddressChange,
        
        
        
        // refs:
        imperativeClickRef,
        paymentPriorityProviderRef,
        
        
        
        // states:
        savePaymentMethodEnabled,
    } = props;
    
    
    
    // styles:
    const styles = useEditPaymentMethodDialogStyleSheet();
    
    
    
    // states:
    const {
        paymentPriorityProvider,
    } = usePaymentProcessorPriority();
    paymentPriorityProviderRef.current = paymentPriorityProvider;
    
    const {
        // sections:
        paymentCardSectionRef,
        billingAddressSectionRef,
    } = useTransactionState();
    
    
    
    // jsx:
    return (
        <form ref={paymentCardSectionRef} className={styles.creditCardForm}>
            <section>
                <p>
                    Please select the currency for your transactions:
                </p>
                <SelectCurrencyImplementation />
            </section>
            
            <hr />
            
            {!savePaymentMethodEnabled && <Alert theme='warning' expanded={true} controlComponent={null}>
                <p>
                    The selected currency is not supported for adding or editing a card.
                    We apologize for any inconvenience this may cause.
                </p>
                <p>
                    Please select another currency.
                </p>
            </Alert>}
            
            {savePaymentMethodEnabled && <>
                <section>
                    <p>
                        Enter your card information:
                    </p>
                    <div className={styles.creditCardLayout}>
                        <ConditionalCreditCardNumberEditor />
                        <ConditionalCreditCardNameEditor />
                        <ConditionalCreditCardExpiryEditor />
                        <ConditionalCreditCardCvvEditor />
                        <ConditionalCreditCardButton clickRef={imperativeClickRef} />
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
                        <em>Optionally</em>, enter your billing address as it appears on your credit card statement for successful processing:
                    </p>
                    <AddressEditor
                        // types:
                        addressType       = 'billing'
                        
                        
                        
                        // values:
                        value       = {editorAddress}
                        onChange    = {onEditorAddressChange}
                        
                        
                        
                        // validations:
                        required={!!editorAddress} // leave all the address field blank or fill all the address field
                        
                        
                        
                        // components:
                        companyEditorComponent={null}
                    />
                </section>
            </>}
        </form>
    );
};



const SelectCurrencyImplementation = (): JSX.Element|null => {
    // styles:
    const styles = useEditPaymentMethodDialogStyleSheet();
    
    
    
    // states:
    const {
        // accessibilities:
        currency,
        setCurrency,
    } = useCartState();
    
    
    
    return (
        <SelectCurrencyEditor
            // variants:
            theme='primary'
            
            
            
            // classes:
            className={styles.selectCurrency}
            
            
            
            // values:
            value             = {currency}
            onChange          = {setCurrency}
            
            
            
            // floatable:
            floatingPlacement='bottom'
        />
    );
};
