'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
const SignInCustomerAccount = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // jsx:
    return (
        <>
            <p className={styleSheet.signInText}>
                <span>
                    Already have an account?
                </span>
                <ButtonIcon
                    // appearances:
                    icon='login'
                >
                    <Link href='/signin'>
                        Sign In
                    </Link>
                </ButtonIcon>
            </p>
            <p className={styleSheet.signUpText}>
                Don&apos;t have an account?
                <ButtonIcon
                    // appearances:
                    icon='account_box'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    buttonStyle='link'
                    size='sm'
                >
                    Sign Up
                </ButtonIcon>
            </p>
        </>
    );
};
export {
    SignInCustomerAccount,
    SignInCustomerAccount as default,
};
