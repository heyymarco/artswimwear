import {
    commerceConfig,
} from '../commerce.config'



export const formatCurrency = (value: number|null|undefined, currency: string = commerceConfig.defaultCurrency): string => {
    if ((value === null) || (value === undefined) || isNaN(value)) return '-';
    
    
    
    const currencyFormatter = new Intl.NumberFormat(commerceConfig.locale, {
        style                 : 'currency',
        currency              : currency,
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits : commerceConfig.currencies[currency].fractionMin, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits : commerceConfig.currencies[currency].fractionMax, // (causes 2500.99 to be printed as $2,501)
    });
    return (
        currencyFormatter.format(value)
        .replace(/^([^\d\s]+)(\s*)/, '$1 ') // add a space after currencySymbol if not already exist
    );
};



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}



export const trimNumber = <TNumber extends number|undefined>(number: TNumber) : TNumber => {
    if (typeof(number) !== 'number') return number;
    
    
    
    return Number.parseFloat(number.toFixed(6)) as TNumber;
}
