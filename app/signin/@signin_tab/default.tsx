// private components:
import {
    SwitchSignInTabContent,
}                           from '../tab-content'



// react components:
export default function SignInIntercep(): JSX.Element|null {
    // jsx:
    return (
        <>
            {/* SOFT NAVIGATION of `/signin` => switch the login tab to 'signIn': */}
            <SwitchSignInTabContent ifPathname='/signin' section='signIn' />
            
            {/* otherwise HARD NAVIGATION of `/signin/any_path` => do not switch the login tab, rely on `<SignInPageContent defaultSection='foo'>` */}
        </>
    );
}
