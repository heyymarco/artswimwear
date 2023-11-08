// react:
import {
    // react:
    default as React,
}                           from 'react'



export type MaybePromise<T> = T|Promise<T>
export type MaybeFactory<T> = T|(() => MaybePromise<T>)

export interface EmailConfig {
    subject : MaybeFactory<React.ReactNode>
    message : MaybeFactory<React.ReactNode>
}
export interface CheckoutConfig {
    emails : {
        customerOrderConfirmation : MaybeFactory<EmailConfig>
    }
}
