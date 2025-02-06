'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

import {
    useViewShipmentDialogStyleSheet,
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
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'

// models:
import {
    type ModelRetryErrorEventHandler,
    
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



// react components:
export interface ViewShipmentDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<ShipmentDetail & { id: never }>,
            // data:
            |'model'
        >
{
    token : string
}
export const ViewShipmentDialog = (props: ViewShipmentDialogProps) => {
    // props:
    const {
        token,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useViewShipmentDialogStyleSheet();
    
    
    
    // stores:
    const [getShipment, {data: model, isLoading : isLoadingAndNoData, isError: isErrorModel}] = useGetShipment();
    const refetchModel = useEvent((): void => {
        getShipment({
            token,
        });
    });
    const performFirstFetchRef = useRef<boolean>(false);
    useEffect(() => {
        // conditions:
        if (performFirstFetchRef.current) return; // already performed => ingore
        performFirstFetchRef.current = true;      // sync
        
        
        
        // actions:
        refetchModel();
    }, []);
    const isErrorAndNoData = isErrorModel && !model;
    
    
    
    // handlers:
    const handleModelRetry = useEvent<ModelRetryErrorEventHandler<void>>((): void => {
        refetchModel();
    });
    
    
    
    // states:
    const [preferredTimezone, setPreferredTimezone] = useState<number>(model?.preferredTimezone ?? checkoutConfigShared.intl.defaultTimezone);
    // TODO: auto save setPreferredTimezone to the database
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ShipmentDetail & { id: never }>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Delivery Tracking'
            modelEntryName='Delivery Tracking'
            model={model as (ShipmentDetail & { id: never })}
            
            
            
            // privileges:
            privilegeAdd    = {false}
            
            
            
            // stores:
            isModelLoading = {isLoadingAndNoData}
            isModelError   = {isErrorAndNoData}
            onModelRetry   = {handleModelRetry}
        >
            <div className={styleSheet.page}>
                <DataTable breakpoint='sm' className={styleSheet.tableInfo}>
                    <DataTableBody>
                        <DataTableItem
                            // accessibilities:
                            label='Ship By'
                        >
                            {model?.carrier}
                        </DataTableItem>
                        <DataTableItem
                            // accessibilities:
                            label='Shipping Tracking Number'
                        >
                            {model?.number}
                        </DataTableItem>
                    </DataTableBody>
                </DataTable>
                
                {!model?.logs?.length && <Content className={styleSheet.logsEmpty} theme='warning' mild={true}>
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
                
                {!!model?.logs?.length && <>
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
                                    onChange={setPreferredTimezone}
                                />
                            </DataTableItem>
                            {model?.logs.map(({reportedAt, log}, index) =>
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
            </div>
        </ComplexEditModelDialog>
    );
};
