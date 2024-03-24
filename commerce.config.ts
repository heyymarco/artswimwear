export type CurrencyCode = string & {}
export interface CurrencyConfig {
    locale           : string,
    sign             : string,
    fractionMin      : number,
    fractionMax      : number,
    fractionUnit     : number,
}
export interface CurrenciesConfig {
    [currencyCode: CurrencyCode]: CurrencyConfig
}
export type CurrencyConversionRounding = 'ROUND'|'FLOOR'|'CEIL'
export interface CommerceConfig {
    locale                     : string,
    currencies                 : CurrenciesConfig
    defaultCurrency            : CurrencyCode
    currencyConversionRounding : CurrencyConversionRounding
}
export const commerceConfig : CommerceConfig = {
    locale                     : 'id-ID',
    currencies                 : {
        IDR: {
            locale             : 'id-ID',
            sign               : 'Rp',
            fractionMin        : 2,
            fractionMax        : 2,
            fractionUnit       : 100,
        },
        USD: {
            locale             : 'en-US',
            sign               : '$',
            fractionMin        : 2,
            fractionMax        : 2,
            fractionUnit       : 0.01,
        },
    },
    defaultCurrency            : 'IDR',
    currencyConversionRounding : 'ROUND',
};
