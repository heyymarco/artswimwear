export const PAYPAL_CURRENCY                     = 'USD'
export const PAYPAL_CURRENCY_FRACTION_UNIT       = 0.01
export const PAYPAL_CURRENCY_FRACTION_ROUNDING   = 'FLOOR'

export type CurrencyCode = string & {}
export interface CurrencyConfig {
    sign             : string,
    fractionMin      : number,
    fractionMax      : number,
    fractionUnit     : number,
    fractionRounding : 'ROUND'|'FLOOR'|'CEIL',
}
export interface CurrenciesConfig {
    [currencyCode: CurrencyCode]: CurrencyConfig
}
export interface CommerceConfig {
    locale          : string,
    currencies      : CurrenciesConfig
    defaultCurrency : CurrencyCode
}
export const commerceConfig : CommerceConfig = {
    locale                   : 'id-ID',
    currencies               : {
        IDR: {
            sign             : 'Rp',
            fractionMin      : 2,
            fractionMax      : 2,
            fractionUnit     : 100,
            fractionRounding : 'ROUND',
        },
        USD: {
            sign             : '$',
            fractionMin      : 2,
            fractionMax      : 2,
            fractionUnit     : 0.01,
            fractionRounding : 'ROUND',
        },
    },
    defaultCurrency          : 'IDR',
};
