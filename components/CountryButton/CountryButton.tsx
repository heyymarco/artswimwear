// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
    useMergeClasses,
    
    
    
    // a possibility of UI having an invalid state:
    InvalidableProps,
    useInvalidable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    ButtonIconProps
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components



// styles:
export const useCountryButtonStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: '6n7962s5ec' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names




export interface CountryButtonProps
    extends
        // bases:
        ButtonIconProps,
        
        // states:
        InvalidableProps
{
}
const CountryButton = (props: CountryButtonProps) => {
    // styles:
    const styleSheet = useCountryButtonStyleSheet();
    
    
    
    const invalidableState = useInvalidable<HTMLButtonElement>(props);
    
    
    
    // rest props:
    const {
        // validations:
        enableValidation  : _enableValidation,  // remove
        isValid           : _isValid,           // remove
        inheritValidation : _inheritValidation, // remove
        onValidation      : _onValidation,      // remove
    ...restButtonIconProps} = props;
    
    
    
    // classes:
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        invalidableState.class,
        styleSheet.main, // additional styleSheet
    );
    
    
    
    // handlers:
    const handleAnimationStart = useMergeEvents(
        // preserves the original `onAnimationStart`:
        props.onAnimationStart,
        
        
        
        // states:
        invalidableState.handleAnimationStart,
    );
    const handleAnimationEnd   = useMergeEvents(
        // preserves the original `onAnimationEnd`:
        props.onAnimationEnd,
        
        
        
        // states:
        invalidableState.handleAnimationEnd,
    );
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // rest props:
            {...restButtonIconProps}
            
            
            
            // appearances:
            icon='dropdown'
            iconPosition='end'
            
            
            
            // classes:
            stateClasses={stateClasses}
            
            
            
            // handlers:
            onAnimationStart = {handleAnimationStart}
            onAnimationEnd   = {handleAnimationEnd  }
        />
    );
};
export {
    CountryButton,
    CountryButton as default,
}
