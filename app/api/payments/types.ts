// react:
import {
    // react:
    default as React,
}                           from 'react'



export interface BusinessConfig {
    name     : string
    url      : string
}
export interface EmailConfig {
    host     : string
    port     : number
    secure   : boolean
    username : string
    password : string
    
    from     : string
    subject  : React.ReactNode
    message  : React.ReactNode
}
export interface CheckoutConfig {
    business : BusinessConfig
    emails : {
        checkout : EmailConfig
    }
}
