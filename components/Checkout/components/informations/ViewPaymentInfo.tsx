'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    ViewPaymentMethod,
}                           from '../informations/ViewPaymentMethod'
import {
    ViewBillingAddress,
}                           from '../informations/ViewBillingAddress'

// models:
import {
    type PaymentMethod,
}                           from '@/models'

// internals:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
export interface ViewPaymentInfoProps {
    // accessibilities:
    title ?: React.ReactNode
}
const ViewPaymentInfo = (props: ViewPaymentInfoProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        title = 'Payment Info',
    } = props;
    
    
    
    // states:
    const {
        // billing data:
        isBillingAddressRequired,
        
        
        
        // payment data:
        paymentMethod,
    } = useCheckoutState();
    const isPaid = (paymentMethod !== null) && !((['manual', 'indomaret', 'alfamart'] satisfies PaymentMethod[]) as PaymentMethod[]).includes(paymentMethod);
    
    
    
    // jsx:
    if (!isPaid) return null;
    return (
        <DataTable breakpoint='sm'>
            {!!title && <DataTableHeader tableTitleComponent={<Basic />}>
                {title}
            </DataTableHeader>}
            
            <DataTableBody>
                <DataTableItem
                    // accessibilities:
                    label='Payment Method'
                    
                    
                    
                    // components:
                    tableDataComponent={<Generic className={styleSheet.tableDataComposite} />}
                >
                    <ViewPaymentMethod />
                </DataTableItem>
                
                {isBillingAddressRequired && <DataTableItem
                    // accessibilities:
                    label='Billing Address'
                    
                    
                    
                    // components:
                    tableDataComponent={<Generic className={styleSheet.tableDataAddress} />}
                >
                    <ViewBillingAddress />
                </DataTableItem>}
            </DataTableBody>
        </DataTable>
    );
};
export {
    ViewPaymentInfo,
    ViewPaymentInfo as default,
};
