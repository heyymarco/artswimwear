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
    PAGE_RECOVER_TITLE,
    PAGE_RECOVER_DESCRIPTION,
}                           from '@/website.config'



export const metadata: Metadata = {
    title       : PAGE_RECOVER_TITLE,
    description : PAGE_RECOVER_DESCRIPTION,
}



// react components:
export default function RecoverIntercep(): JSX.Element|null {
    // jsx:
    return (
        <SignInSwitch section='recover' />
    );
}
