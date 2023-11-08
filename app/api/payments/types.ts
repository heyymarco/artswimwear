// react:
import {
    // react:
    default as React,
}                           from 'react'



export type MaybePromise<T> = T|Promise<T>
export type MaybeFactory<T> = T|(() => MaybePromise<T>)

export interface BusinessConfig {
    name     : MaybeFactory<string>
    url      : MaybeFactory<string>
}
export interface EmailConfig {
    host     : MaybeFactory<string>
    port     : MaybeFactory<number>
    secure   : MaybeFactory<boolean>
    username : MaybeFactory<string>
    password : MaybeFactory<string>
    
    from     : MaybeFactory<string>
    subject  : MaybeFactory<React.ReactNode>
    message  : MaybeFactory<React.ReactNode>
}
export interface CheckoutConfig {
    business : MaybeFactory<BusinessConfig>
    emails : {
        customerOrderConfirmation : MaybeFactory<EmailConfig>
    }
}
