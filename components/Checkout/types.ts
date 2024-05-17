// react:
import {
    // react:
    default as React,
}                           from 'react'



export interface BusinessConfig {
    name                 : string
    url                  : string
}
export interface PaymentConfig {
    bank                ?: React.ReactNode
    confirmationUrl      : string
}
export interface ShippingConfig {
    trackingUrl          : string
}
export interface EmailConfig {
    host                 : string
    port                 : number
    secure               : boolean
    username             : string
    password             : string
    
    from                 : string
    subject              : React.ReactNode
    message              : React.ReactNode
}
export interface CheckoutConfigServer extends CheckoutConfigShared {
    payment              : PaymentConfig
    shipping             : ShippingConfig
    emails               : {
        checkout         : EmailConfig
        shipping         : EmailConfig
        completed        : EmailConfig
        rejected         : EmailConfig
        canceled         : EmailConfig
        expired          : EmailConfig
    }
}
export interface CheckoutConfigClient extends CheckoutConfigShared {
}
export interface CheckoutConfigShared {
    business             : BusinessConfig
}
