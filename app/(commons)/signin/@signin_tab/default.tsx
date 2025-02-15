'use client' // everything should be QUICKLY done in client, NOTHING to DO nor RENDER on server

// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'



// react components:
export default function DefaultTabIntercept(): JSX.Element|null {
    /*
        handles:
        * HARD|SOFT navigation of `/signin`          => SWITCH  to 'signIn' tab.
        * HARD      navigation of `/signin/any_path` => NOTHING to do, just preventing a 404 error from happening.
    */
    
    
    
    // jsx:
    return (
        <SignInSwitch ifPathname='/signin' section='signIn' />
    );
}
