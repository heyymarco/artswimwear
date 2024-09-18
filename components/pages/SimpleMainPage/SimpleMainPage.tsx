'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    // style sheets:
    useSimpleMainPageStyleSheet,
}                           from './styles/loader'

// heymarco components:
import {
    type MainProps,
    Main,
}                           from '@heymarco/section'



// react components:
export interface SimpleMainPageProps
    extends
        MainProps
{
}
const SimpleMainPage = (props: SimpleMainPageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useSimpleMainPageStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        className = '',
        
        
        
        // other props:
        ...restMainProps
    } = props;
    
    
    
    // jsx:
    return (
        <Main
            // other props:
            {...restMainProps}
            
            
            
            // classes:
            className={`${className} ${styleSheet.main}`}
        />
    )
};
export {
    SimpleMainPage,            // named export for readibility
    SimpleMainPage as default, // default export to support React.lazy
}
