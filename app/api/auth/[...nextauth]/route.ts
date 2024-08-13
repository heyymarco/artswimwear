// heymarco components:
import {
    createAuthRouteHandler,
    PrismaAdapterWithCredentials,
}                           from '@heymarco/next-auth/server'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// configs:
import {
    authConfigServer,
}                           from '@/auth.config.server'
import {
    credentialsConfigServer,
}                           from '@/credentials.config.server'



const authRouteHandler = createAuthRouteHandler({
    adapter                           : PrismaAdapterWithCredentials(prisma, {
        user                          : 'customer',
        role                          : null,
        account                       : 'customerAccount',
        session                       : 'customerSession',
        credentials                   : 'customerCredentials',
        passwordResetToken            : 'customerPasswordResetToken',
        emailConfirmationToken        : 'customerEmailConfirmationToken',
        
        userRefRole                   : null,
        accountRefUser                : 'parentId',
        sessionRefUser                : 'parentId',
        credentialsRefUser            : 'parentId',
        passwordResetTokenRefUser     : 'parentId',
        emailConfirmationTokenRefUser : 'parentId',
    }),
    authConfigServer           : authConfigServer,
    credentialsConfigServer    : credentialsConfigServer,
});
const authOptions = authRouteHandler.authOptions;
export {
    authRouteHandler as GET,
    authRouteHandler as POST,
    authRouteHandler as PATCH,
    authRouteHandler as PUT,
    authOptions,
};
