'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// utilities:
import {
    FormatDateTimeOptions,
    formatDateTime,
}                           from '@/libs/formatters'



// react components:
export interface DateTimeDisplayProps extends FormatDateTimeOptions {
    dateTime : Date|null|undefined
}
const DateTimeDisplay = (props: DateTimeDisplayProps): JSX.Element|null => {
    // props:
    const {
        dateTime : dateTimeRaw,
        ...restFormatDateTimeOptions
    } = props;
    const dateTime : Date|null|undefined = (typeof(dateTimeRaw) === 'string') ? new Date(Date.parse(dateTimeRaw)) : dateTimeRaw;
    
    
    
    // jsx:
    return (
        <>
            {formatDateTime(dateTime, restFormatDateTimeOptions)}
        </>
    );
};
export {
    DateTimeDisplay,
    DateTimeDisplay as default,
};
