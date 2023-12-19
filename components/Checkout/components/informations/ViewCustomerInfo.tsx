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

// reusable-ui components:
import {
    // base-components:
    Generic,
    Basic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    DataTableHeader,
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    ViewCustomerContact,
}                           from '../informations/ViewCustomerContact'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewCustomerInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ViewCustomerInfo = (props: ViewCustomerInfoProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        title    = 'Customer Info',
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // actions:
        gotoStepInformation,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoContactInfo      = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'contactInfo');
    });
    
    
    
    // jsx:
    return (
        <DataTable breakpoint='sm'>
            {!!title && <DataTableHeader tableTitleComponent={<Basic />}>
                {title}
            </DataTableHeader>}
            
            <DataTableBody>
                <DataTableItem
                    // accessibilities:
                    label='Account'
                    
                    
                    
                    // components:
                    tableDataComponent={<Generic className={styleSheet.tableDataComposite} />}
                    
                    
                    
                    // children:
                    actionChildren={
                        !readOnly && <EditButton onClick={handleGotoContactInfo} />
                    }
                >
                    <ViewCustomerContact />
                </DataTableItem>
            </DataTableBody>
        </DataTable>
    );
};
export {
    ViewCustomerInfo,
    ViewCustomerInfo as default,
};
