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
    dateTime : Date
}
const DateTimeDisplay = (props: DateTimeDisplayProps): JSX.Element|null => {
    // props:
    const {
        dateTime,
        ...restFormatDateTimeOptions
    } = props;
    
    
    
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
