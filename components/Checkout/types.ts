// react:
import {
    // react:
    default as React,
}                           from 'react'



export interface BusinessConfig {
    name                        : string
    url                         : string
}
export type CurrencyCode = string & {}
export interface CurrencyConfig {
    locale                      : string,
    sign                        : string,
    fractionMin                 : number,
    fractionMax                 : number,
    fractionUnit                : number,
}
export interface CurrenciesConfig {
    [currency: CurrencyCode]    : CurrencyConfig
}
export type CurrencyConversionRounding = 'ROUND'|'FLOOR'|'CEIL'
export interface IntlConfig {
    locale                      : string
    defaultTimeZone             : number
    
    currencies                  : CurrenciesConfig
    defaultCurrency             : CurrencyCode
    currencyConversionRounding  : CurrencyConversionRounding
}
export interface PaymentConfig {
    bank                       ?: React.ReactNode
    confirmationUrl             : string
    expires : {
        manual                  : number /* days */
        cstore                  : number /* days */
    },
}
export interface ShippingConfig {
    trackingUrl                 : string
}
export interface EmailConfig {
    host                        : string
    port                        : number
    secure                      : boolean
    username                    : string
    password                    : string
    
    from                        : string
    subject                     : React.ReactNode
    message                     : React.ReactNode
}
export interface CheckoutConfigServer extends CheckoutConfigShared {
    payment                     : PaymentConfig
    shipping                    : ShippingConfig
    emails                      : {
        checkout                : EmailConfig
        shipping                : EmailConfig
        completed               : EmailConfig
        rejected                : EmailConfig
        canceled                : EmailConfig
        expired                 : EmailConfig
    }
}
export interface CheckoutConfigClient extends CheckoutConfigShared {
}
export interface CheckoutConfigShared {
    business                    : BusinessConfig
    intl                        : IntlConfig
}
