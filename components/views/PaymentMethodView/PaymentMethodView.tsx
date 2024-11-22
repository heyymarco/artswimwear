'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    usePaymentMethodViewStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'

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
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={styleSheets.main}
        >
            <p className='cardNumber'>
                <span className='cardNumberParts'>
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <span>{identifier}</span>
                </span>
                
                {(!!brand && isKnownPaymentBrand(brand)) && <img
                    // appearances:
                    alt={brand}
                    src={`/brands/${brand.toLowerCase()}.svg`}
                    // width={42}
                    // height={26}
                    
                    
                    
                    // classes:
                    className='cardBrand'
                />}
            </p>
            
            {!!expiresAt && <p className='cardExpires'>
                <span>
                    {expiresAt.getUTCMonth()}
                </span>
                <span>
                    {expiresAt.getUTCFullYear()}
                </span>
            </p>}
            
            <p className='cardCurrency'>
                <span>
                    {currency}
                </span>
                <span>
                    {getCurrencySign(currency)}
                </span>
            </p>
            
            <div className='cardBilling'>
                <p>
                    <span className={styleSheets.data}>{firstName} {lastName} ({phone})</span>
                </p>
                <p>
                    <span className={styleSheets.data}>
                        {address}, {city}, {state} ({zip}), {Country.getCountryByCode(country ?? '')?.name ?? country}
                    </span>
                </p>
            </div>
        </ListItem>
    );
};
export {
    PaymentMethodView,
    PaymentMethodView as default,
}
