'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    usePaymentMethodViewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

import {
    OrderableListItem,
    type OrderableListItemDragStartEvent,
}                           from '@heymarco/orderable-list'

// internal components:
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    EditPaymentMethodDialog,
}                           from '@/components/dialogs/EditPaymentMethodDialog'
import {
    Grip,
}                           from '@/components/Grip'

// models:
import {
    type PaymentMethodDetail,
    
    
    
    isKnownPaymentBrand,
}                           from '@/models'

// utilities:
import {
    getCurrencySign,
}                           from '@/libs/formatters'

// others:
import {
    Country,
}                           from 'country-state-city'



// react components:
export interface PaymentMethodViewProps extends ModelPreviewProps<PaymentMethodDetail> {}
const PaymentMethodView = (props: PaymentMethodViewProps): JSX.Element|null => {
    // styles:
    const styleSheets = usePaymentMethodViewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
    ...restListItemProps} = props;
    const {
        id,
        expiresAt: expiresAtRaw,
        
        currency,
        
        type,
        brand,
        identifier,
        
        billingAddress,
    } = model;
    const expiresAt = (typeof(expiresAtRaw) === 'string') ? new Date(Date.parse(expiresAtRaw)) : expiresAtRaw;
    const {
        country,
        state,
        city,
        zip,
        address,
        
        firstName,
        lastName,
        phone,
    } = billingAddress ?? {};
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEdit = useEvent(() => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
        );
        
        const dialogPromise = showDialog(
            <EditPaymentMethodDialog
                // data:
                model={model} // modify current model
            />
        );
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    const handleOrderStart = (event: OrderableListItemDragStartEvent<HTMLElement>): void => {
        if (!(event.target as HTMLElement)?.classList?.contains?.('grip')) event.response = false;
    };
    
    
    
    // jsx:
    return (
        <OrderableListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheets.main}
            
            
            
            // handlers:
            onOrderStart={handleOrderStart}
        >
            <p className='cardNumber'>
                {(!!brand && isKnownPaymentBrand(brand)) && <img
                    // appearances:
                    alt={brand}
                    src={`/brands/${brand.toLowerCase()}.svg`}
                    // width={42}
                    // height={26}
                    
                    
                    
                    // classes:
                    className='label cardBrand'
                />}
                
                <span className='data'>
                    <span className='cardNumberParts'>
                        <span className='mask'>••••</span>
                        <span className='mask'>••••</span>
                        <span className='mask'>••••</span>
                        <span>{identifier}</span>
                    </span>
                </span>
            </p>
            
            {!!expiresAt && <p className='cardExpiry'>
                <span className='label'>
                    Expiry
                </span>
                <span className='data'>
                    <span>
                        {expiresAt.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span>
                        {expiresAt.getUTCFullYear()}
                    </span>
                </span>
            </p>}
            
            <p className='cardCurrency'>
                <span className='label'>
                    Currency
                </span>
                <span className='data'>
                    <span>
                        {getCurrencySign(currency)}
                    </span>
                    <span>
                        {currency}
                    </span>
                </span>
            </p>
            
            {!!billingAddress && <div className='cardBilling'>
                <span className='label'>
                    Billing
                </span>
                <div className='data'>
                    {(!!firstName && !!lastName && !!phone) && <p>
                        <span className={styleSheets.data}>{[firstName, lastName, phone ? `(${phone})` : ''].filter((item) => !!item).join(' ')}</span>
                    </p>}
                    <p>
                        <span className={styleSheets.data}>
                            {address}, {city}, {state} ({zip}), {Country.getCountryByCode(country ?? '')?.name ?? country}
                        </span>
                    </p>
                </div>
            </div>}
            
            <EditButton title='Edit' className='edit' onClick={handleEdit}>
                Edit
            </EditButton>
            <Grip className='grip' />
        </OrderableListItem>
    );
};
export {
    PaymentMethodView,
    PaymentMethodView as default,
}
