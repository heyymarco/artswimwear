'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'



// react components:
export default function SignUpIntercept(): JSX.Element|null {
    /*
        handles:
        * SOFT navigation of `/signin/signup` => SWITCH to 'signUp' tab.
    */
    
    
    
    // jsx:
    return (
        <SignInSwitch section='signUp' showDialog={true} />
    );
}
