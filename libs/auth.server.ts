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
    adapter                                  : PrismaAdapterWithCredentials(prisma, {
        modelUser                            : 'customer',
        modelRole                            : null,
        modelAccount                         : 'customerAccount',
        modelSession                         : 'customerSession',
        modelCredentials                     : 'customerCredentials',
        modelPasswordResetToken              : 'customerPasswordResetToken',
        modelEmailConfirmationToken          : 'customerEmailConfirmationToken',
        
        modelUserRefRoleId                   : null,
        modelAccountRefUserId                : 'parentId',
        modelSessionRefUserId                : 'parentId',
        modelCredentialsRefUserId            : 'parentId',
        modelPasswordResetTokenRefUserId     : 'parentId',
        modelEmailConfirmationTokenRefUserId : 'parentId',
    }),
    authConfigServer           : authConfigServer,
    credentialsConfigServer    : credentialsConfigServer,
});
const authOptions = authRouteHandler.authOptions;
export {
    authRouteHandler,
    authOptions,
};
