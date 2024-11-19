'use client'

// styles:
import {
    useStripeCardFieldStyleSheet,
}                           from './styles/loader'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    EditableTextControlProps,
    EditableTextControl,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    type StripeCardNumberElementChangeEvent,
    type StripeCardExpiryElementChangeEvent,
    type StripeCardCvcElementChangeEvent,
}                           from '@stripe/stripe-js'
import {
    type CardNumberElementProps,
    type CardExpiryElementProps,
    type CardCvcElementProps,
}                           from '@stripe/react-stripe-js'

// internals:
import {
    stripeCardFieldsStyle,
}                           from './styles'



// react components:
export type CardBaseElementProps =
    |CardNumberElementProps
    |CardExpiryElementProps
    |CardCvcElementProps
export interface StripeCardFieldWrapperProps
    extends
        EditableTextControlProps
{
    // components:
    cardElementComponent : React.ReactElement<CardBaseElementProps>
}
const StripeCardFieldWrapper = (props: StripeCardFieldWrapperProps) => {
    // rest props:
    const {
        // components:
        cardElementComponent,
    ...restStripeCardFieldWrapperProps} = props;
    
    
    
    // styles:
    const styleSheet = useStripeCardFieldStyleSheet();
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(false);
    
    
    
    // handlers:
    const handleFocus = useEvent(() => {
        setIsFocused(true);
    });
    const handleBlur  = useEvent(() => {
        setIsFocused(false);
    });
    const handleChange = useEvent((event: StripeCardNumberElementChangeEvent|StripeCardExpiryElementChangeEvent|StripeCardCvcElementChangeEvent) => {
        setIsValid(!event.error);
    });
    
    
    
    // caches:
    const cachedCardField = useMemo(() => {
        // jsx:
        return React.cloneElement<CardBaseElementProps>(cardElementComponent,
            // props:
            {
                // options:
                options : {
                    style : stripeCardFieldsStyle,
                },
                
                
                
                // classes:
                className : styleSheet.main,
                
                
                
                // hanlders:
                onFocus   : handleFocus,
                onBlur    : handleBlur,
                onChange  : handleChange,
            },
        );
    }, []);
    
    
    
    // default props:
    const {
        // accessibilities:
        tabIndex     : editableTabIndex  = -1,
        // 'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // states:
        focused      : editableFocused   = isFocused ?? false,
        isValid      : editableIsValid   = isValid   ?? null,
        
        
        ...restEditableTextControlProps
    } = restStripeCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
            // aria-label = {editableAriaLabel}
            
            
            
            // states:
            focused    = {editableFocused}
            isValid    = {editableIsValid}
        >
            {cachedCardField}
        </EditableTextControl>
    );
};
export {
    StripeCardFieldWrapper,
    StripeCardFieldWrapper as default,
};
