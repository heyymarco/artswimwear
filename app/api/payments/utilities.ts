// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    MaybeFactory,
    BusinessConfig,
    EmailConfig,
}                           from './types'



export interface ResolvedBusinessConfig {
}
export const resolveBusinessConfig = async (businessConfig: MaybeFactory<BusinessConfig>): Promise<ResolvedBusinessConfig> => {
    const {
        name,
        url,
    } = (typeof(businessConfig) === 'function') ? await businessConfig() : businessConfig;
    
    return {
        name : (typeof(name) === 'function') ? await name() : name,
        url  : (typeof(url)  === 'function') ? await url()  : url,
    };
}



export interface ResolvedEmailConfig {
    host     : string
    port     : number
    secure   : boolean
    username : string
    password : string
    
    from     : string
    subject  : React.ReactNode
    message  : React.ReactNode
}
export const resolveEmailConfig = async (emailConfig: MaybeFactory<EmailConfig>): Promise<ResolvedEmailConfig> => {
    const {
        host,
        port,
        secure,
        username,
        password,
        
        from,
        subject,
        message,
    } = (typeof(emailConfig) === 'function') ? await emailConfig() : emailConfig;
    
    
    
    const subjectValue  = (typeof(subject)  === 'function') ? subject()  : subject;
    const messageValue  = (typeof(message)  === 'function') ? message()  : message;
    
    
    
    return {
        host     : (typeof(host)     === 'function') ? await host()       : host,
        port     : (typeof(port)     === 'function') ? await port()       : port,
        secure   : (typeof(secure)   === 'function') ? await secure()     : secure,
        username : (typeof(username) === 'function') ? await username()   : username,
        password : (typeof(password) === 'function') ? await password()   : password,
        
        from     : (typeof(from)     === 'function') ? await from()       : from,
        subject  : (subjectValue instanceof Promise) ? await subjectValue : subjectValue,
        message  : (messageValue instanceof Promise) ? await messageValue : messageValue,
    };
}