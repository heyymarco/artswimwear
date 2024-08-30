// internal components:
import {
    SignInSwitch,
}                           from '@/components/SignIn'



// react components:
export default function SignInIntercep(): JSX.Element|null {
    // jsx:
    return (
        <>
            {/* SOFT NAVIGATION of `/signin` => switch the login tab to 'signIn': */}
            <SignInSwitch ifPathname='/signin' section='signIn' />
            
            {/* otherwise HARD NAVIGATION of `/signin/any_path` => do not switch the login tab, rely on `<SignInPageContent defaultSection='foo'>` */}
        </>
    );
}
