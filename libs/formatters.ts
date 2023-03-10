const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});



export const formatCurrency = (value?: number|null|undefined): string => {
    if ((value === null) || (value === undefined) || isNaN(value)) return '-';
    return currencyFormatter.format(value)
};



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}
