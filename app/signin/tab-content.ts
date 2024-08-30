'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// next-js:
import {
    usePathname,
}                           from 'next/navigation'

// internal components:
import {
    SigninTabStateProps,
    useSigninTabState,
}                           from '@/components/SignIn'



// react components:
export interface SwitchSignInTabContentProps
    extends
        Required<Pick<SigninTabStateProps,
            // states:
            |'section'
        >>
{
    // conditions:
    ifPathname ?: string
}
export function SwitchSignInTabContent(props: SwitchSignInTabContentProps): JSX.Element|null {
    // props:
    const {
        // states:
        section,
        
        
        
        // conditions:
        ifPathname,
    } = props;
    
    
    
    // states:
    const pathname = usePathname();
    
    
    
    // states:
    const {
        // states:
        setSection,
    } = useSigninTabState();
    
    
    
    // effects:
    const isConditionOk = (
        (ifPathname === undefined)
        ||
        (ifPathname === pathname)
    );
    useIsomorphicLayoutEffect(() => {
        if (!isConditionOk) return;
        setSection(section);
    }, []);
    
    
    
    // jsx:
    return null;
}
