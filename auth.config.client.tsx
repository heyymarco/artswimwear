// heymarco:
import type {
    // types:
    AuthConfigClient,
}                               from '@heymarco/next-auth'

// internals:
import {
    authConfigShared,
}                               from './auth.config.shared'



export const authConfigClient : AuthConfigClient = authConfigShared;
