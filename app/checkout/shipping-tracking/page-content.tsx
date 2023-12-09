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
    Icon,
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
    useDialogMessage,
    paragraphify,
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
}                           from '@/components/editors/WysiwygEditor'

// stores:
import {
    // hooks:
    ShippingTrackingDetail,
    useShippingTracking,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// styles:
const useShippingTrackingPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'aq8up5vk1o' });
import './page-styles';



// react components:
export function ShippingTrackingPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = useShippingTrackingPageStyleSheet();
    
    
    
    // navigations:
    const searchParams = useSearchParams();
    
    
    
    // states:
    const [token] = useState<string>(() => searchParams.get('token') ?? '');
    
    
    
    // apis:
    const [doShippingTracking, {data: shippingTrackingData, isLoading: isShippingTrackingLoading, isError: isShippingTrackingError, error: shippingTrackingError}] = useShippingTracking();
    
    const [isBusy  , setIsBusy  ] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    
    const isPageLoading = isShippingTrackingLoading && !isLoaded;
    const hasData       = (!!shippingTrackingData);
    const isPageError   = ((!isPageLoading && (isShippingTrackingError)) || (!hasData && !!token)) && !isLoaded; /* considered as error if no data but has token*/ /* consider no error if isLoaded */
    const isPageReady   = !isPageLoading && !isPageError && !!token;
    
    
    
    // states:
    const [shippingCarrier     , setShippingCarrier     ] = useState<string|null>(shippingTrackingData?.shippingCarrier || null);
    const [shippingNumber      , setShippingNumber      ] = useState<string|null>(shippingTrackingData?.shippingNumber || null);
    const [preferredTimezone   , setPreferredTimezone   ] = useState<number>(() => (0 - (new Date()).getTimezoneOffset()));
    const [shippingTrackingLogs, setShippingTrackingLogs] = useState<ShippingTrackingDetail['shippingTrackingLogs']>([]);
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleGetConfirmationStatus = useEvent(async (): Promise<void> => {
        // conditions:
        if (!token) return; // token is blank => abort
        
        
        
        // actions:
        try {
            const shippingTrackingDetail = await doShippingTracking({
                shippingTracking : {
                    token,
                },
            }).unwrap();
            
            
            
            const {
                shippingCarrier,
                shippingNumber,
                preferredTimezone,
                shippingTrackingLogs,
            } = shippingTrackingDetail;
            
            
            
            setShippingCarrier(shippingCarrier);
            setShippingNumber(shippingNumber);
            if (preferredTimezone !== null) setPreferredTimezone(preferredTimezone);
            setShippingTrackingLogs(shippingTrackingLogs);
            
            
            
            setIsLoaded(true);
        }
        catch {
            // the error is already handled by `isPageError`
        } // try
    });
    const handleDoConfirmation        = useEvent(async (): Promise<void> => {
        // do payment confirmation:
        setIsBusy(true);
        try {
            await doShippingTracking({
                shippingTracking   : {
                    token             : token,
                    
                    preferredTimezone : preferredTimezone,
                },
            }).unwrap();
        }
        catch (fetchError: any) {
            showMessageFetchError({ fetchError, context: 'shippingTracking' });
            
            return; // skip the success status
        }
        finally {
            setIsBusy(false);
        } // try
        
        
        
        // show the success status:
        // TODO
    });
    const handleGotoHome              = useEvent(() => {
        // TODO
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
    if (isPageError && ((shippingTrackingError as any)?.status !== 400)) return ( // display error other than 400 (bad payment confirmation token)
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
                        This shipping tracking link is invalid or expired.
                    </p>
                </Alert>}
                
                {!!isPageReady && <div className={styleSheet.shippingTracking}>
                    <h1 className='title'>
                        Delivery Tracking
                    </h1>
                    
                    <table className='info'>
                        <tbody>
                            <tr>
                                <th>
                                    Ship By
                                </th>
                                <td>
                                    {shippingCarrier}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Shipping Tracking Number
                                </th>
                                <td>
                                    {shippingNumber}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {!shippingTrackingLogs?.length && <Content className='logsEmpty' theme='warning' mild={true}>
                        <p>
                            <Icon icon='timer' theme='primary' size='xl' />
                        </p>
                        <p className='h5'>
                            There are no tracking logs yet.
                        </p>
                        <p>
                            Please check it again later.
                        </p>
                    </Content>}
                    
                    {!!shippingTrackingLogs?.length && <>
                    </>}
                </div>}
            </Section>
        </Main>
    );
}
