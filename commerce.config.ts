export const PAYPAL_CURRENCY                     = 'USD'
export const PAYPAL_CURRENCY_FRACTION_UNIT       = 0.01
export const PAYPAL_CURRENCY_FRACTION_ROUNDING   = 'FLOOR'

export type CurrencyCode = string & {}
export interface CurrencyConfig {
    sign             : string,
    fractionMin      : number,
    fractionMax      : number,
    fractionUnit     : number,
}
export interface CurrenciesConfig {
    [currencyCode: CurrencyCode]: CurrencyConfig
}
export interface CommerceConfig {
    locale                     : string,
    currencies                 : CurrenciesConfig
    defaultCurrency            : CurrencyCode
    currencyConversionRounding : 'ROUND'|'FLOOR'|'CEIL'
}
export const commerceConfig : CommerceConfig = {
    locale                     : 'id-ID',
    currencies                 : {
        IDR: {
            sign               : 'Rp',
            fractionMin        : 2,
            fractionMax        : 2,
            fractionUnit       : 100,
        },
        USD: {
            sign               : '$',
            fractionMin        : 2,
            fractionMax        : 2,
            fractionUnit       : 0.01,
        },
    },
    defaultCurrency            : 'IDR',
    currencyConversionRounding : 'ROUND',
};
