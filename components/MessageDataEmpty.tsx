// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export const MessageDataEmpty = (): JSX.Element|null => {
    // jsx:
    return (
        <>
            <Icon icon='search' theme='primary' />
            <p>
                The data is empty.
            </p>
        </>
    );
}