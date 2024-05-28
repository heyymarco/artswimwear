// react:
import {
    // react:
    default as React,
}                           from 'react'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



export const formatCurrency = (value: number|null|undefined, currency: string = checkoutConfigShared.intl.defaultCurrency): JSX.Element|null => {
    if ((value === null) || (value === undefined) || isNaN(value)) return <>-</>;
    
    
    
    const currencySign = getCurrencySign(currency);
    const currencyFormatter = new Intl.NumberFormat(checkoutConfigShared.intl.currencies[currency]?.locale ?? checkoutConfigShared.intl.locale, {
        style                 : 'currency',
        currency              : currency,
        currencyDisplay       : 'narrowSymbol',
        
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits : checkoutConfigShared.intl.currencies[currency].fractionMin, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits : checkoutConfigShared.intl.currencies[currency].fractionMax, // (causes 2500.99 to be printed as $2,501)
    });
    return (<>
        {
            currencyFormatter.formatToParts(value)
            .flatMap((part, index, parts) => {
                if (part.type === 'currency') part.value = currencySign;
                if ((part.type === 'currency') && (parts[index + 1]?.type !== 'literal')) return [part, { type: 'literal', value: ' ' }];
                if ((part.type === 'literal') && (parts[index - 1]?.type === 'currency') && (part.value !== ' ')) return [{ type: 'literal', value: ' ' }];
                return [part];
            })
            .map(({type, value}, index) =>
                (type === 'currency')
                ? <span key={index} className='currencySign'>{value}</span>
                : <React.Fragment key={index}>{value}</React.Fragment>
            )
        }
    </>);
};
export const getCurrencySign = (currency: string = checkoutConfigShared.intl.defaultCurrency): string => {
    const currencySignFromConfig = checkoutConfigShared.intl.currencies[currency]?.sign;
    if (!!currencySignFromConfig) return currencySignFromConfig;
    
    
    
    const currencyFormatter = new Intl.NumberFormat(checkoutConfigShared.intl.currencies[currency]?.locale ?? checkoutConfigShared.intl.locale, {
        style                 : 'currency',
        currency              : currency,
        currencyDisplay       : 'narrowSymbol',
        
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits : checkoutConfigShared.intl.currencies[currency].fractionMin, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits : checkoutConfigShared.intl.currencies[currency].fractionMax, // (causes 2500.99 to be printed as $2,501)
    });
    return currencyFormatter.formatToParts(/* test value to render: */1).find(({type}) => (type === 'currency'))?.value ?? '';
}



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}



export const trimNumber = <TNumber extends number|undefined>(number: TNumber) : TNumber => {
    if (typeof(number) !== 'number') return number;
    
    
    
    return Number.parseFloat(number.toFixed(6)) as TNumber;
}
