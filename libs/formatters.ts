import {
    COMMERCE_LOCALE,
    COMMERCE_CURRENCY,
    COMMERCE_CURRENCY_FRACTION_MIN,
    COMMERCE_CURRENCY_FRACTION_MAX,
} from '../commerce.config'



const currencyFormatter = new Intl.NumberFormat(COMMERCE_LOCALE, {
    style                 : 'currency',
    currency              : COMMERCE_CURRENCY,
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits : COMMERCE_CURRENCY_FRACTION_MIN, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits : COMMERCE_CURRENCY_FRACTION_MAX, // (causes 2500.99 to be printed as $2,501)
});



export const formatCurrency = (value?: number|null|undefined): string => {
    if ((value === null) || (value === undefined) || isNaN(value)) return '-';
    return currencyFormatter.format(value)
};



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}



export const trimNumber = <TNumber extends number|undefined>(number: TNumber) : TNumber => {
    if (typeof(number) !== 'number') return number;
    
    
    
    return Number.parseFloat(number.toFixed(6)) as TNumber;
}
