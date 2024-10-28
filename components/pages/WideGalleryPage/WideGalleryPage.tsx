'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    // style sheets:
    useWideGalleryPageStyleSheet,
}                           from './styles/loader'

// heymarco components:
import {
    type MainProps,
    Main,
}                           from '@heymarco/section'



// react components:
export interface WideGalleryPageProps
    extends
        MainProps
{
}
const WideGalleryPage = (props: WideGalleryPageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWideGalleryPageStyleSheet();
    
    
    
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
    WideGalleryPage,            // named export for readibility
    WideGalleryPage as default, // default export to support React.lazy
}