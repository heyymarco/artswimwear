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



// react components:
export function PaymentConfirmationPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = usePaymentConfirmationPageStyleSheet();
    
    
    
    // navigations:
    const searchParams = useSearchParams();
    
    
    
    // states:
    const [token] = useState<string>(() => searchParams.get('token') ?? '');
    
    
    
    // apis:
    const [paymentConfirmation, {data: paymentConfirmationData, isLoading: isPaymentConfirmationLoading, isError: isPaymentConfirmationError, error: paymentConfirmationError}] = usePaymentConfirmation();
    
    const isPageLoading = isPaymentConfirmationLoading;
    const hasData       = (!!paymentConfirmationData);
    const isPageError   = (!isPageLoading && (isPaymentConfirmationError)) || (!hasData && !!token) /* considered as error if no data but has token*/;
    const isPageReady   = !isPageLoading && !isPageError && !!token;
    
    
    
    // states:
    const [currency, setCurrency] = useState<string>(paymentConfirmationData?.currency || commerceConfig.defaultCurrency);
    const [amount, setAmount] = useState<number|null>(paymentConfirmationData?.amount ?? null);
    const [payerName, setPayerName] = useState<string|null>(paymentConfirmationData?.payerName || null);
    const [originatingBank, setOriginatingBank] = useState<string|null>(paymentConfirmationData?.originatingBank || null);
    const [destinationBank, setDestinationBank] = useState<string|null>(paymentConfirmationData?.destinationBank || null);
    const selectedCurrency = commerceConfig.currencies?.[currency as keyof typeof commerceConfig.currencies];
    
    const [isSent, setIsSent] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleGetConfirmationStatus = useEvent(() => {
        // conditions:
        if (!token) return; // token is blank => abort
        
        
        
        // actions:
        paymentConfirmation({
            paymentConfirmation : {
                token,
            },
        });
    });
    const handleDoConfirmation        = useEvent(() => {
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
                    <TabPanel className={styleSheet.paymentConfirmation}>
                        <h1 className='title'>
                            Payment Confirmation
                        </h1>
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
                            onChange={(value) => setPayerName(value ?? null)}
                            
                            
                            
                            // validations:
                            required={false}
                            minLength={2}
                            maxLength={50}
                            
                            
                            
                            // formats:
                            placeholder='Payer Name'
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
                            placeholder='Originating Bank'
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
                            placeholder='Destination Bank'
                        />
                        <ButtonIcon
                            // appearances:
                            icon='done'
                            
                            
                            
                            // handlers:
                            onClick={handleDoConfirmation}
                        >
                            Confirm
                        </ButtonIcon>
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
        </Main>
    );
}
