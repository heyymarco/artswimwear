'use client'

// styles:
import {
    useSavedCardCardStyleSheet,
}                           from './styles/loader'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// internal components:
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    PaymentMethodBrand,
}                           from '@/components/payments/PaymentMethodBrand'
import {
    PaymentMethodIdentifier,
}                           from '@/components/payments/PaymentMethodIdentifier'

// models:
import {
    type PaymentMethodDetail,
}                           from '@/models'



// react components:
export interface SavedCardCardProps extends ModelPreviewProps<PaymentMethodDetail> {}
const SavedCardCard = (props: SavedCardCardProps): JSX.Element|null => {
    // styles:
    const styles = useSavedCardCardStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={styles.main}
        >
            <RadioDecorator />
            <PaymentMethodBrand model={model} className='label' />
            <PaymentMethodIdentifier model={model} className='data' mild={!props.active} />
        </ListItem>
    );
};
export {
    SavedCardCard,            // named export for readibility
    SavedCardCard as default, // default export to support React.lazy
}
