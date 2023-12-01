'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// next-js:
import {
    // navigations:
    useSearchParams,
}                           from 'next/navigation'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Label,
    EditableButton,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    Group,
    Tab,
    TabPanel,
    
    
    
    // utility-components:
    WindowResizeCallback,
    useWindowResizeObserver,
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    LoadingBlankPage,
    ErrorBlankPage,
}                           from '@/components/BlankPage'
import {
    CurrencyEditor,
}                           from '@/components/editors/CurrencyEditor'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    DateTimeEditor,
}                           from '@/components/editors/DateTimeEditor'
import {
    WysiwygEditorState,
    WysiwygViewer,
}                           from '@/components/WysiwygEditor'

// stores:
import {
    // hooks:
    usePaymentConfirmation,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// styles:
const usePaymentConfirmationPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'ztb0mar5a4' });
import './page-styles';



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated)';



// react components:
export function PaymentConfirmationPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = usePaymentConfirmationPageStyleSheet();
    
    
    
    // navigations:
    const searchParams = useSearchParams();
    
    
    
    // states:
    const [token] = useState<string>(() => searchParams.get('token') ?? '');
    
    
    
    // apis:
    const [doPaymentConfirmation, {data: paymentConfirmationData, isLoading: isPaymentConfirmationLoading, isError: isPaymentConfirmationError, error: paymentConfirmationError}] = usePaymentConfirmation();
    
    const [isBusy  , setIsBusy  ] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    
    const isPageLoading = isPaymentConfirmationLoading && !isLoaded;
    const hasData       = (!!paymentConfirmationData);
    const isPageError   = ((!isPageLoading && (isPaymentConfirmationError)) || (!hasData && !!token)) && !isLoaded; /* considered as error if no data but has token*/ /* consider no error if isLoaded */
    const isPageReady   = !isPageLoading && !isPageError && !!token;
    
    
    
    // states:
    const [updatedAt       , setUpdatedAt       ] = useState<Date|null>(null);
    const [reviewedAt      , setReviewedAt      ] = useState<Date|null>(null);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [currency        , setCurrency        ] = useState<string>(paymentConfirmationData?.currency || commerceConfig.defaultCurrency);
    const [amount          , setAmount          ] = useState<number|null>(paymentConfirmationData?.amount ?? null);
    const [payerName       , setPayerName       ] = useState<string|null>(paymentConfirmationData?.payerName || null);
    const [paymentDate     , setPaymentDate     ] = useState<Date|null>(paymentConfirmationData?.paymentDate || null);
    const [preferedTimezone, setPreferedTimezone] = useState<number>(() => (0 - (new Date()).getTimezoneOffset()));
    const [originatingBank , setOriginatingBank ] = useState<string|null>(paymentConfirmationData?.originatingBank || null);
    const [destinationBank , setDestinationBank ] = useState<string|null>(paymentConfirmationData?.destinationBank || null);
    const selectedCurrency = commerceConfig.currencies?.[currency as keyof typeof commerceConfig.currencies];
    
    const [rejectionReason , setRejectionReason ] = useState<WysiwygEditorState|null>(null);
    const isReviewed    = !!reviewedAt;
    const isRejected    =  isReviewed && !!rejectionReason;
    const isApproved    =  isReviewed &&  !rejectionReason;
    const isUnderReview = !isReviewed && !!updatedAt;
    // const isApproved = true;
    // console.log({isRejected, isApproved, rejectionReason})
    
    const [hasInitialData  , setHasInitialData  ] = useState<boolean>(false);
    const [hasModified     , setHasModified     ] = useState<boolean>(false);
    const [isSent          , setIsSent          ] = useState<boolean>(false);
    
    
    
    // refs:
    const tabPanelConfirmationRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleGetConfirmationStatus = useEvent(async (): Promise<void> => {
        // conditions:
        if (!token) return; // token is blank => abort
        
        
        
        // actions:
        try {
            const paymentConfirmationDetail = await doPaymentConfirmation({
                paymentConfirmation : {
                    token,
                },
            }).unwrap();
            
            
            
            const {
                updatedAt  : updatedAtAsString,
                reviewedAt : reviewedAtAsString,
                
                currency,
                amount,
                payerName,
                paymentDate: paymentDateAsString,
                preferedTimezone,
                
                originatingBank,
                destinationBank,
                
                rejectionReason,
            } = paymentConfirmationDetail;
            
            
            
            setUpdatedAt(updatedAtAsString ? new Date(updatedAtAsString) : null);
            setReviewedAt(reviewedAtAsString ? new Date(reviewedAtAsString) : null);
            
            setCurrency(currency || commerceConfig.defaultCurrency);
            setAmount(amount);
            setPayerName(payerName);
            setPaymentDate(paymentDateAsString ? new Date(paymentDateAsString) : null); // the paymentDateAsString returned from server is a 'string', we need to convert back to Date type
            if (preferedTimezone !== null) setPreferedTimezone(preferedTimezone);
            
            setOriginatingBank(originatingBank);
            setDestinationBank(destinationBank);
            
            setRejectionReason(rejectionReason as unknown as WysiwygEditorState|null);
            
            
            
            setHasInitialData(amount !== null);
            setIsLoaded(true);
        }
        catch {
            // the error is already handled by `isPageError`
        } // try
    });
    const handleDoConfirmation        = useEvent(async (): Promise<void> => {
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true); // enable validation
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const fieldErrors = tabPanelConfirmationRef?.current?.querySelectorAll?.(invalidSelector);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return; // transaction aborted due to validation error
        } // if
        
        
        
        // do payment confirmation:
        setIsBusy(true);
        try {
            await doPaymentConfirmation({
                paymentConfirmation  : {
                    token            : token,
                    
                    currency         : currency,
                    amount           : amount,
                    payerName        : payerName       || null, // convert empty string to null
                    paymentDate      : paymentDate,
                    preferedTimezone : preferedTimezone,
                    
                    originatingBank  : originatingBank || null, // convert empty string to null
                    destinationBank  : destinationBank || null, // convert empty string to null
                },
            }).unwrap();
        }
        catch (fetchError: any) {
            showMessageFetchError({ fetchError, context: 'paymentConfirmation' });
            throw fetchError;
        }
        finally {
            setIsBusy(false);
        } // try
        
        
        
        // show the success status:
        setIsSent(true);
    });
    const handleGotoHome              = useEvent(() => {
        setIsSent(false); // TODO: replace with actual goto home after development finished
    });
    
    
    
    // dom effects:
    const hasInitialRefreshRef = useRef<boolean>(false); // ensures the payment confirmation token not re-refreshed twice (especially in dev mode)
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (hasInitialRefreshRef.current) return; // already scheduled => ignore the twice_dev_mode
        hasInitialRefreshRef.current = true;
        
        
        
        // actions:
        handleGetConfirmationStatus();
    }, [token]);
    
    
    
    // jsx:
    if (isPageLoading) return (
        <LoadingBlankPage
            // identifiers:
            key='busy' // avoids re-creating a similar dom during loading transition in different components
        />
    );
    if (isPageError && ((paymentConfirmationError as any)?.status !== 400)) return ( // display error other than 400 (bad payment confirmation token)
        <ErrorBlankPage
            // handlers:
            onRetry={handleGetConfirmationStatus}
        />
    );
    return (
        <Main
            // variants:
            theme='primary'
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <AccessibilityProvider
                // accessibilities:
                enabled={!isBusy && !isApproved} // disabled if busy or was approved
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    <Section>
                        {!isPageReady && <Alert
                            // variants:
                            theme='danger'
                            
                            
                            
                            // states:
                            expanded={true}
                            
                            
                            
                            // components:
                            controlComponent={<React.Fragment />}
                        >
                            <p>
                                This payment confirmation link is invalid or expired.
                            </p>
                        </Alert>}
                        {!!isPageReady && <Tab
                            // states:
                            expandedTabIndex={!isSent ? 0 : 1}
                            
                            
                            
                            // components:
                            headerComponent={null}
                            bodyComponent={<Content mild={true} />}
                        >
                            <TabPanel elmRef={tabPanelConfirmationRef} className={styleSheet.paymentConfirmation}>
                                <h1 className='title'>
                                    Payment Confirmation
                                </h1>
                                
                                {isUnderReview && <Alert
                                    // variants:
                                    theme='warning'
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={<React.Fragment />}
                                >
                                    <p>
                                        Your payment confirmation is <strong>being reviewed</strong>.
                                    </p>
                                    <p>
                                        We will notify you as soon as possible.
                                    </p>
                                </Alert>}
                                
                                {(isRejected || isApproved) && <>
                                    <Group>
                                        <Label theme='primary' className='solid'>
                                            Reviewed At
                                        </Label>
                                        <DateTimeEditor
                                            // variants:
                                            theme='success'
                                            
                                            
                                            
                                            // accessibilities:
                                            readOnly={true}
                                            
                                            
                                            
                                            // values:
                                            value={reviewedAt}
                                            timezone={preferedTimezone}
                                            onTimezoneChange={setPreferedTimezone}
                                        />
                                    </Group>
                                    
                                    {isRejected && <Alert
                                        // variants:
                                        theme='danger'
                                        
                                        
                                        
                                        // states:
                                        expanded={true}
                                        
                                        
                                        
                                        // components:
                                        controlComponent={<React.Fragment />}
                                    >
                                        <p>
                                            Sorry, your payment confirmation was <strong>rejected</strong>.
                                        </p>
                                        <p>
                                            But don&apos;t worry, you can <strong>revise</strong> the payment confirmation and <strong>update</strong> it.
                                            We will validate your confirmation and notify you again.
                                        </p>
                                        <p>
                                            Reason:
                                        </p>
                                        <WysiwygViewer
                                            // variants:
                                            nude={true}
                                            
                                            
                                            
                                            // values:
                                            value={rejectionReason}
                                        />
                                    </Alert>}
                                    
                                    {isApproved && <Alert
                                        // variants:
                                        theme='success'
                                        
                                        
                                        
                                        // states:
                                        expanded={true}
                                        
                                        
                                        
                                        // components:
                                        controlComponent={<React.Fragment />}
                                    >
                                        <p>
                                            Congratulations! Your payment has been approved.
                                        </p>
                                        <p>
                                            We are processing your order.
                                        </p>
                                    </Alert>}
                                    
                                    <hr />
                                </>}
                                
                                {(isUnderReview || isRejected || isApproved) && <hr />}
                                
                                {!!updatedAt && <Group>
                                    <Label theme='primary' className='solid'>
                                        Updated At
                                    </Label>
                                    <DateTimeEditor
                                        // variants:
                                        theme='success'
                                        
                                        
                                        
                                        // accessibilities:
                                        readOnly={true}
                                        
                                        
                                        
                                        // values:
                                        value={updatedAt}
                                        timezone={preferedTimezone}
                                        onTimezoneChange={setPreferedTimezone}
                                    />
                                </Group>}
                                
                                <Group>
                                    <DropdownListButton
                                        // variants:
                                        theme='primary'
                                        mild={true}
                                        
                                        
                                        
                                        // classes:
                                        className='solid'
                                        
                                        
                                        
                                        // accessibilities:
                                        aria-label='Payment Currency'
                                        
                                        
                                        
                                        // floatable:
                                        floatingPlacement='bottom-end'
                                        
                                        
                                        
                                        // components:
                                        buttonComponent={
                                            <EditableButton
                                                // accessibilities:
                                                assertiveFocusable={true}
                                                
                                                
                                                
                                                // validations:
                                                isValid={!!currency}
                                                
                                                
                                                
                                                // components:
                                                buttonComponent={
                                                    <ButtonIcon
                                                        // appearances:
                                                        icon='dropdown'
                                                        iconPosition='end'
                                                    />
                                                }
                                            >
                                                {currency}
                                            </EditableButton>
                                        }
                                    >
                                        {Object.keys(commerceConfig.currencies).map((currencyOption) =>
                                            <ListItem
                                                // identifiers:
                                                key={currencyOption}
                                                
                                                
                                                
                                                // accessibilities:
                                                active={(currencyOption === currency)}
                                                
                                                
                                                
                                                // handlers:
                                                onClick={() => setCurrency(currencyOption)}
                                            >
                                                {currencyOption}
                                            </ListItem>
                                        )}
                                    </DropdownListButton>
                                    <CurrencyEditor
                                        // appearances:
                                        currencySign={selectedCurrency?.sign}
                                        currencyFraction={selectedCurrency.fractionMax}
                                        
                                        
                                        
                                        // classes:
                                        className='fluid'
                                        
                                        
                                        
                                        // accessibilities:
                                        aria-label='Transfered Amount'
                                        
                                        
                                        
                                        // values:
                                        value={amount}
                                        onChange={(value) => setAmount(value)}
                                        
                                        
                                        
                                        // validations:
                                        enableValidation={(hasInitialData && !hasModified) ? false : true}
                                        required={true}
                                        min={0}
                                        
                                        
                                        
                                        // formats:
                                        placeholder='Transfered Amount'
                                    />
                                </Group>
                                
                                <NameEditor
                                    // classes:
                                    className='name editor'
                                    
                                    
                                    
                                    // accessibilities:
                                    aria-label='Payer Name'
                                    
                                    
                                    
                                    // values:
                                    value={payerName ?? ''}
                                    onChange={(value) => {
                                        setPayerName(value ?? null);
                                        setHasModified(true);
                                    }}
                                    
                                    
                                    
                                    // validations:
                                    required={false}
                                    minLength={2}
                                    maxLength={50}
                                    
                                    
                                    
                                    // formats:
                                    placeholder="Payer Name (can be blank if you don't remember)"
                                />
                                
                                <DateTimeEditor
                                    // classes:
                                    className='fluid'
                                    
                                    
                                    
                                    // accessibilities:
                                    aria-label='Transfered Amount'
                                    
                                    
                                    
                                    // values:
                                    value={paymentDate}
                                    onChange={(value) => {
                                        // console.log('onChange: ', {
                                        //     date  : value,
                                        //     local : value?.toLocaleString(),
                                        //     utc   : value?.toISOString(),
                                        // });
                                        setPaymentDate(value);
                                    }}
                                    timezone={preferedTimezone}
                                    onTimezoneChange={setPreferedTimezone}
                                    
                                    
                                    
                                    // validations:
                                    required={false}
                                    
                                    
                                    
                                    // formats:
                                    placeholder="Transfered Date (can be blank if you don't remember)"
                                />
                                
                                <NameEditor
                                    // classes:
                                    className='origin editor'
                                    
                                    
                                    
                                    // accessibilities:
                                    aria-label='Originating Bank'
                                    
                                    
                                    
                                    // values:
                                    value={originatingBank ?? ''}
                                    onChange={(value) => setOriginatingBank(value ?? null)}
                                    
                                    
                                    
                                    // validations:
                                    required={false}
                                    minLength={2}
                                    maxLength={50}
                                    
                                    
                                    
                                    // formats:
                                    placeholder="Originating Bank (can be blank if you don't remember)"
                                />
                                
                                <NameEditor
                                    // classes:
                                    className='dest editor'
                                    
                                    
                                    
                                    // accessibilities:
                                    aria-label='Destination Bank'
                                    
                                    
                                    
                                    // values:
                                    value={destinationBank ?? ''}
                                    onChange={(value) => setDestinationBank(value ?? null)}
                                    
                                    
                                    
                                    // validations:
                                    required={false}
                                    minLength={2}
                                    maxLength={50}
                                    
                                    
                                    
                                    // formats:
                                    placeholder="Destination Bank (can be blank if you don't remember)"
                                />
                                
                                {!isApproved && <ButtonIcon
                                    // appearances:
                                    icon={isBusy ? 'busy' : (hasInitialData ? 'save' : 'done')}
                                    
                                    
                                    
                                    // handlers:
                                    onClick={handleDoConfirmation}
                                >
                                    {hasInitialData ? 'Update' : 'Confirm'}
                                </ButtonIcon>}
                            </TabPanel>
                            <TabPanel className={styleSheet.paymentConfirmationSent}>
                                <h1 className='title'>
                                    Thank You!
                                </h1>
                                <Alert
                                    // variants:
                                    theme='success'
                                    
                                    
                                    
                                    // states:
                                    expanded={true}
                                    
                                    
                                    
                                    // components:
                                    controlComponent={<React.Fragment />}
                                >
                                    <p>
                                        Your payment confirmation has been sent. We will immediately review your confirmation and notify you back.
                                    </p>
                                </Alert>
                                <div className='actions'>
                                    <ButtonIcon
                                        // appearances:
                                        icon='home'
                                        
                                        
                                        
                                        // handlers:
                                        onClick={handleGotoHome}
                                    >
                                        Back to Home
                                    </ButtonIcon>
                                </div>
                            </TabPanel>
                        </Tab>}
                        {/* {JSON.stringify(paymentConfirmationData)} */}
                    </Section>
                </ValidationProvider>
            </AccessibilityProvider>
        </Main>
    );
}
