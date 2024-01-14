// heymarco:
import type {
    // types:
    CredentialsConfigServer,
}                               from '@heymarco/next-auth'

// internals:
import {
    credentialsConfigShared,
}                               from './credentials.config.shared'



export const credentialsConfigServer : CredentialsConfigServer = {
    name     : credentialsConfigShared.name,
    email    : credentialsConfigShared.email,
    username : {
        ...credentialsConfigShared.username,
        
        prohibited     : [
            /admin/i,
            /marketing/i,
            /billing/i,
            /sales/i,
            /payment/i,
            /account/i,
            /business/i,
            /contact/i,
            /invite/i,
            /mail/i,
            'bot',
            'bots',
            'info',
            'information',
            'log',
            'login',
            'www',
            'root',
        ],
    },
    password : {
        ...credentialsConfigShared.password,
        
        prohibited     : [
            'qweasd',
            'qweasdzxc',
            '123',
            '1234',
            '12345',
            'aaa',
        ]
    },
};
