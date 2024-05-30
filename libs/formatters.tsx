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
    
    
    
    const currencySign        = getCurrencySign(currency);
    const currencyFormatter   = new Intl.NumberFormat(checkoutConfigShared.intl.currencies[currency]?.locale ?? checkoutConfigShared.intl.locale, {
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
                // replace system currencySign with custom currencySign:
                if  (part.type === 'currency') part.value = currencySign;
                
                // after currencySign, insert a space_literal (if not already there):
                if ((part.type === 'currency')                         && !((parts[index + 1]?.type === 'literal' ) || (parts[index + 1]?.value === ' '))) return [part, { type: 'literal', value: ' ' }];
                
                // after currencySign, replace foreign_literal (if any) with space_literal:
                if ((part.type === 'literal' ) && (part.value !== ' ') &&   (parts[index - 1]?.type === 'currency')) return [{ type: 'literal', value: ' ' }];
                
                // leave the rest parts unchanged:
                return [part];
            })
            .map(({type, value}, index) =>
                (type === 'currency')
                ? <span key={index} className='currencySign'>{value}</span>
                : <React.Fragment key={index}>{value}</React.Fragment>
            )
        }
    </>);
}
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



export const convertTimezoneToReadableClock = (timezone: number): string => {
    const timezoneAbs       = Math.abs(timezone);
    const timezoneHours     = Math.floor(timezoneAbs);
    const timezoneMinutes   = Math.round((timezoneAbs - timezoneHours) * 60);
    return `${(timezone >= 0) ? '+' : '-'}${(timezoneHours < 10) ? '0' : ''}${timezoneHours}:${(timezoneMinutes < 10) ? '0' : ''}${timezoneMinutes}`;
}

export interface FormatDateTimeOptions {
    timezone     ?: number
    showTimezone ?: boolean
}
export const formatDateTime = (value: Date|null|undefined, options?: FormatDateTimeOptions): JSX.Element|null => {
    if ((value === null) || (value === undefined)) return <>-</>;
    
    
    
    // options:
    const {
        timezone     = checkoutConfigShared.intl.defaultTimezone,
        showTimezone = true,
    } = options ?? {};
    
    
    
    const readableTimezone  = convertTimezoneToReadableClock(timezone);
    const dateTimeFormatter = new Intl.DateTimeFormat(checkoutConfigShared.intl.locale, {
        dateStyle           : 'full',  // shows day of week + day of month + month + year
        timeStyle           : 'short', // shows hours and minutes, hides timezone
        timeZone            : readableTimezone,
    });
    const timezoneParts     = new Intl.DateTimeFormat(checkoutConfigShared.intl.locale, {
        timeZone            : readableTimezone,
        timeZoneName        : 'longGeneric',
    }).formatToParts(value);
    const timezoneIndex     = timezoneParts.findIndex(({type}) => (type === 'timeZoneName'));
    const timezonePart      = (timezoneIndex <= -1) ? undefined : timezoneParts[timezoneIndex];
    const timezoneSeparator = (timezoneIndex <=  0) ? undefined : (timezoneParts[timezoneIndex - 1].type !== 'literal') ? undefined : timezoneParts[timezoneIndex - 1];
    return (<>
        {
            [
                ...dateTimeFormatter.formatToParts(value),
                ...[
                    timezoneSeparator,
                    timezonePart,
                ].filter((part): part is Exclude<typeof part, undefined> => (part !== undefined)),
            ]
            .map(({type, value}, index) =>
                (type === 'timeZoneName')
                ? (showTimezone && <span key={index} className='timeZone'>{value}</span>)
                : <React.Fragment key={index}>{value}</React.Fragment>
            )
        }
    </>);
}



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}



export const trimNumber = <TNumber extends number|undefined>(number: TNumber) : TNumber => {
    if (typeof(number) !== 'number') return number;
    
    
    
    return Number.parseFloat(number.toFixed(6)) as TNumber;
}
