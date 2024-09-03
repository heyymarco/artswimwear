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
    Generic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
    Main,
}                           from '@heymarco/section'
import {
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    LoadingBlankPage,
    ErrorBlankPage,
}                           from '@/components/BlankPage'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'

// models:
import {
    type ShipmentDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetShipment,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// styles:
const useShipmentPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./page-styles')
, { id: 'aq8up5vk1o' });
import './page-styles';



// react components:
export function ShipmentPageContent(): JSX.Element|null {
    // styles:
    const styleSheet = useShipmentPageStyleSheet();
    
    
    
    // navigations:
    const searchParams = useSearchParams();
    
    
    
    // states:
    const [token] = useState<string>(() => searchParams.get('token') ?? '');
    
    
    
    // apis:
    const [getShipment, {data: shipmentData, isLoading: isShipmentLoading, isError: isShipmentError, error: shipmentError}] = useGetShipment();
    
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    
    const isPageLoading = isShipmentLoading && !isLoaded;
    const hasData       = (!!shipmentData);
    const isPageError   = ((!isPageLoading && (isShipmentError)) || (!hasData && !!token)) && !isLoaded; /* considered as error if no data but has token*/ /* consider no error if isLoaded */
    const isPageReady   = !isPageLoading && !isPageError && !!token;
    
    
    
    // states:
    const [carrier          , setCarrier          ] = useState<string|null>(shipmentData?.carrier || null);
    const [number           , setNumber           ] = useState<string|null>(shipmentData?.number || null);
    const [preferredTimezone, setPreferredTimezone] = useState<number>(checkoutConfigShared.intl.defaultTimezone);
    const [logs             , setLogs             ] = useState<ShipmentDetail['logs']>([]);
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleGetConfirmationStatus   = useEvent(async (): Promise<void> => {
        // conditions:
        if (!token) return; // token is blank => abort
        
        
        
        // actions:
        try {
            const shipmentDetail = await getShipment({
                shipment : {
                    token,
                },
            }).unwrap();
            
            
            
            const {
                carrier,
                number,
                preferredTimezone,
                logs,
            } = shipmentDetail;
            
            
            
            setCarrier(carrier);
            setNumber(number);
            if (preferredTimezone !== null) setPreferredTimezone(preferredTimezone);
            setLogs(logs);
            
            
            
            setIsLoaded(true);
        }
        catch {
            // the error is already handled by `isPageError`
        } // try
    });
    const handleUpdatePreferredTimezone = useEvent(async (newPreferredTimezone: number): Promise<boolean> => {
        // update local setting:
        setPreferredTimezone(newPreferredTimezone);
        
        
        
        // update server setting:
        try {
            await getShipment({
                shipment   : {
                    token             : token,
                    
                    preferredTimezone : newPreferredTimezone, // acutally this is a POST action, but since changing the `preferredTimezone` is not a significant mutation, we decided to treat it as a GET action
                },
            }).unwrap();
        }
        catch (fetchError: any) {
            showMessageFetchError({ fetchError, context: 'shipment' });
            
            return false; // failed to save
        } // try
        
        
        
        return true; // succeeded to save
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
    if (isPageError && ((shipmentError as any)?.status !== 400)) return ( // display error other than 400 (bad payment confirmation token)
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
                
                {!!isPageReady && <div className={styleSheet.shipment}>
                    <h1 className={styleSheet.title}>
                        Delivery Tracking
                    </h1>
                    
                    <DataTable breakpoint='sm' className={styleSheet.tableInfo}>
                        <DataTableBody>
                            <DataTableItem
                                // accessibilities:
                                label='Ship By'
                            >
                                {carrier}
                            </DataTableItem>
                            <DataTableItem
                                // accessibilities:
                                label='Shipping Tracking Number'
                            >
                                {number}
                            </DataTableItem>
                        </DataTableBody>
                    </DataTable>
                    
                    {!logs?.length && <Content className={styleSheet.logsEmpty} theme='warning' mild={true}>
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
                    
                    {!!logs?.length && <>
                        <DataTable breakpoint='sm' className={styleSheet.tableLogs}>
                            <DataTableBody>
                                <DataTableItem
                                    // accessibilities:
                                    label='Timezone'
                                    
                                    
                                    
                                    // components:
                                    tableDataComponent={<Generic className={styleSheet.editTimezone} />}
                                >
                                    <TimezoneEditor
                                        // variants:
                                        theme='primary'
                                        mild={true}
                                        
                                        
                                        
                                        // values:
                                        value={preferredTimezone}
                                        onChange={handleUpdatePreferredTimezone}
                                    />
                                </DataTableItem>
                                {logs.map(({reportedAt, log}, index) =>
                                    <DataTableItem
                                        // identifiers:
                                        key={index}
                                        
                                        
                                        
                                        // accessibilities:
                                        label={
                                            !!reportedAt && <span className={styleSheet.dateTime}>
                                                <DateTimeDisplay dateTime={reportedAt} timezone={preferredTimezone} showTimezone={false} />
                                            </span>
                                        }
                                        
                                        
                                        
                                        // components:
                                        tableLabelComponent={<Generic className='labelDateTime' />}
                                    >
                                        {log}
                                    </DataTableItem>
                                )}
                            </DataTableBody>
                        </DataTable>
                    </>}
                </div>}
            </Section>
        </Main>
    );
}
