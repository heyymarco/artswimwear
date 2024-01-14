// themes:
import './theme.basics.config' // sync client-side-themes

// react:
import {
    // react:
    default as React,
}                               from 'react'

// reusable-ui core:
import {
    // a border (stroke) management system:
    borderRadiusValues,
    
    
    
    // a spacer (gap) management system
    spacerValues,
}                               from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// auth-js:
import GoogleProvider           from '@auth/core/providers/google'
import FacebookProvider         from '@auth/core/providers/facebook'
import InstagramProvider        from '@auth/core/providers/instagram'
import TwitterProvider          from '@auth/core/providers/twitter'

// heymarco:
import type {
    // types:
    AuthConfigServer,
}                               from '@heymarco/next-auth'
import {
    styles,
    
    Business,
    User,
    EmailConfirmation,
    PasswordReset,
}                               from '@heymarco/next-auth/templates'

// internals:
import {
    authConfigShared,
}                               from './auth.config.shared'



export const authConfigServer : AuthConfigServer = {
    business                 : authConfigShared.business,
    signUp                   : authConfigShared.signUp,
    signIn                   : {
        requireVerifiedEmail : true,
        failureMaxAttempts   : 5    /* times */,
        failureLockDuration  : 0.25 /* hours */,
        path                 : '/signin',
    },
    reset                    : {
        ...authConfigShared.reset,
        
        throttle             : 0.08 /* hours */,
        maxAge               : 24   /* hours */,
    },
    session                  : {
        maxAge               : 24   /* hours */,
        updateAge            : 6    /* hours */,
    },
    
    
    
    oAuthProviders           : [
        GoogleProvider({
            clientId         : process.env.GOOGLE_ID        ?? '',
            clientSecret     : process.env.GOOGLE_SECRET    ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        FacebookProvider({
            clientId         : process.env.FACEBOOK_ID      ?? '',
            clientSecret     : process.env.FACEBOOK_SECRET  ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        InstagramProvider({
            clientId         : process.env.INSTAGRAM_ID     ?? '',
            clientSecret     : process.env.INSTAGRAM_SECRET ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        TwitterProvider({
            clientId         : process.env.TWITTER_ID       ?? '',
            clientSecret     : process.env.TWITTER_SECRET   ?? '',
            // @ts-ignore
            version          : '2.0',
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    
    
    
    emails                   : {
        signUp               : {
            host             : process.env.EMAIL_SIGNUP_HOST     ?? '',
            port             : Number.parseInt(process.env.EMAIL_SIGNUP_PORT ?? '465'),
            secure           : (process.env.EMAIL_SIGNUP_SECURE === 'true'),
            username         : process.env.EMAIL_SIGNUP_USERNAME ?? '',
            password         : process.env.EMAIL_SIGNUP_PASSWORD ?? '',
            
            from             : process.env.EMAIL_SIGNUP_FROM ?? '',
            subject          : <>
                Your Account Registration at <Business.Name />
            </>,
            message          : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Your Account Is Almost Ready!
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <User.Name />,
                    </p>
                    
                    <p style={styles.paragraph}>
                        You&apos;ve successfully signed up for an account at <Business.Name />.
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        Your account has been created but <strong>not yet activated</strong>.
                        <br />
                        Please follow the activation instruction below.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Account Activation Instruction
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        In order to sign in to our website,
                        you need to confirm your email address by clicking on the link below:
                        <br />
                        <EmailConfirmation.Link />
                    </p>
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Not You?
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        If you did not signed up on our website then please ignore this email.
                    </p>
                </section>
            </article>,
        },
        reset                : {
            host             : process.env.EMAIL_RESET_HOST     ?? '',
            port             : Number.parseInt(process.env.EMAIL_RESET_PORT ?? '465'),
            secure           : (process.env.EMAIL_RESET_SECURE === 'true'),
            username         : process.env.EMAIL_RESET_USERNAME ?? '',
            password         : process.env.EMAIL_RESET_PASSWORD ?? '',
            
            from             : process.env.EMAIL_RESET_FROM ?? '',
            subject          : <>
                Password Reset Request at <Business.Name />
            </>,
            message          : <article style={styles.article}>
                <div style={styles.sectionDummy}></div>
                
                <section
                    // styles:
                    style={{
                        // layouts:
                        ...styles.sectionBase,
                        
                        
                        
                        // backgrounds & foregrounds:
                        ...styles.theme('primary'),
                        
                        
                        
                        // borders:
                        border       : styles.borderStroke('primary'),
                        borderRadius : `${borderRadiusValues.xxl}`,
                        
                        
                        
                        // spacings:
                        margin       : `${spacerValues.md}`,
                        padding      : `calc(${spacerValues.md} * 1.5)`,
                    }}
                >
                    <h1 style={styles.heading1}>
                        Forgot Your Password?
                    </h1>
                    
                    <p style={styles.paragraph}>
                        Dear <User.Name />,
                    </p>
                    
                    <p style={styles.paragraphLast}>
                        We received a request to <strong>reset your password</strong> at <Business.Name />.
                        <br />
                        Please follow the password reset instruction below.
                    </p>
                </section>
                
                <section style={styles.section}>
                    <h2 style={styles.heading2}>
                        Password Reset Instruction
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        To reset your password, click on the link below:
                        <br />
                        <PasswordReset.Link />
                    </p>
                </section>
                
                <section style={styles.sectionLast}>
                    <h2 style={styles.heading2}>
                        Not You?
                    </h2>
                    
                    <p style={styles.paragraphLast}>
                        If you did not make this request then please ignore this email.
                    </p>
                </section>
            </article>,
        },
    },
};
