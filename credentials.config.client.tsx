// react:
import {
    // react:
    default as React,
}                               from 'react'

// heymarco:
import type {
    // types:
    CredentialsConfigClient,
}                               from '@heymarco/next-auth'

// internals:
import {
    credentialsConfigShared,
}                               from './credentials.config.shared'



export const credentialsConfigClient : CredentialsConfigClient = {
    name     : credentialsConfigShared.name,
    email    : {
        ...credentialsConfigShared.email,
        
        formatHint     : <>Must be a common email format.</>,
    },
    username : {
        ...credentialsConfigShared.username,
        
        formatHint     : <>Begins with a letter followed by letters, numbers, underscores, or hyphens.</>,
        
        prohibitedHint : <>Must not contain prohibited words.</>,
    },
    password : {
        ...credentialsConfigShared.password,
        
        prohibitedHint : <>Must not using common passwords.</>,
    },
};
