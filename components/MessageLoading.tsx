// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'



// react components:
export const MessageLoading = (): JSX.Element|null => {
    // jsx:
    return (
        <>
            <p>
                Retrieving data from the server. Please wait...
            </p>
            <LoadingBar className='loadingBar' />
        </>
    );
}