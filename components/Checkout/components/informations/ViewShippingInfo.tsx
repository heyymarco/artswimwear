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
    ViewShippingAddress,
}                           from './ViewShippingAddress'
import {
    ViewShippingMethod,
}                           from './ViewShippingMethod'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewShippingInfoProps {
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const ViewShippingInfo = (props: ViewShippingInfoProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        title    = 'Shipping Info',
        readOnly = false,
    } = props;
    
    
    
    // states:
    const {
        // states:
        checkoutStep,
        
        
        
        // shipping data:
        isShippingAddressRequired,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepShipping,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleGotoShippingAddress  = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepInformation(/* focusTo: */'shippingAddress');
    });
    const handleGotoShippingProvider = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        gotoStepShipping();
    });
    
    
    
    // jsx:
    if (!isShippingAddressRequired) return null;
    return (
        <DataTable breakpoint='sm'>
            {!!title && <DataTableHeader tableTitleComponent={<Basic />}>
                {title}
            </DataTableHeader>}
            
            <DataTableBody>
                <DataTableItem
                    // appearances:
                    label='Ship To'
                    
                    
                    
                    // components:
                    tableDataComponent={<Generic className={styleSheet.tableDataAddress} />}
                    
                    
                    
                    // children:
                    actionChildren={
                        !readOnly && <EditButton onClick={handleGotoShippingAddress} />
                    }
                >
                    <ViewShippingAddress />
                </DataTableItem>
                
                {(checkoutStep !== 'shipping') && <DataTableItem
                    // appearances:
                    label='Ship By'
                    
                    
                    
                    // components:
                    tableDataComponent={<Generic className={styleSheet.tableDataComposite} />}
                    
                    
                    
                    // children:
                    actionChildren={
                        !readOnly && <EditButton onClick={handleGotoShippingProvider} />
                    }
                >
                    <ViewShippingMethod />
                </DataTableItem>}
            </DataTableBody>
        </DataTable>
    );
};
export {
    ViewShippingInfo,
    ViewShippingInfo as default,
};
