'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    // style sheets:
    useWideMainPageStyleSheet,
}                           from './styles/loader'

// heymarco components:
import {
    type MainProps,
    Main,
}                           from '@heymarco/section'



// react components:
export interface WideMainPageProps
    extends
        MainProps
{
}
const WideMainPage = (props: WideMainPageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWideMainPageStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = styleSheet.main,
        
        
        
        // other props:
        ...restMainProps
    } = props;
    
    
    
    // jsx:
    return (
        <Main
            // other props:
            {...restMainProps}
            
            
            
            // classes:
            mainClass={mainClass}
        />
    )
};
export {
    WideMainPage,            // named export for readibility
    WideMainPage as default, // default export to support React.lazy
}