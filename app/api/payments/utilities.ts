// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    MaybeFactory,
    EmailConfig,
}                           from './types'



export interface ResolvedEmailConfig {
    subject : React.ReactNode
    message : React.ReactNode
}
export const resolveEmailConfig = async (emailConfig: MaybeFactory<EmailConfig>): Promise<ResolvedEmailConfig> => {
    const {subject, message} = (typeof(emailConfig) === 'function') ? await emailConfig() : emailConfig;
    const subjectValue = (typeof(subject) === 'function') ? subject() : subject;
    const messageValue = (typeof(message) === 'function') ? message() : message;
    return {
        subject : (subjectValue instanceof Promise) ? await subjectValue : subjectValue,
        message : (messageValue instanceof Promise) ? await messageValue : messageValue,
    };
}