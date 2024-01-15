// heymarco:
import type {
    // types:
    AuthConfigShared,
}                               from '@heymarco/next-auth'



export const authConfigShared : AuthConfigShared = {
    business                 : {
        name                 : process.env.BUSINESS_NAME ?? '',
        url                  : process.env.BUSINESS_URL  ?? '',
    },
    signUp                   : {
        enabled              : true,
    },
    signIn                   : {
        path                 : '/signin',
    },
    reset                    : {
        enabled              : true,
    },
};
