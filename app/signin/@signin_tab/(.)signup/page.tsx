// next-js:
import {
    type Metadata,
}                           from 'next'

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'

// configs:
import {
    PAGE_SIGNUP_TITLE,
    PAGE_SIGNUP_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_SIGNUP_TITLE,
    description : PAGE_SIGNUP_DESCRIPTION,
}



// react components:
export default function RecoverIntercep(): JSX.Element|null {
    // jsx:
    return (
        <SignInSwitch section='signUp' />
    );
}
