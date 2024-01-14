// heymarco:
import type {
    // types:
    CredentialsConfigShared,
}                               from '@heymarco/next-auth'



export const credentialsConfigShared : CredentialsConfigShared = {
    name     : {
        minLength      : 2,
        maxLength      : 30,
    },
    email    : {
        minLength      : 5,
        maxLength      : 50,
        
        format         : /^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    },
    username : {
        minLength      : 3,
        maxLength      : 20,
        
        format         : /^[a-z][a-z0-9-_]*$/i,
    },
    password : {
        minLength      : 5,
        maxLength      : 30,
        
        hasUppercase   : true,
        hasLowercase   : false,
    },
};
