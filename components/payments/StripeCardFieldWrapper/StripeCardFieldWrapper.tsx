'use client'

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

// payment components:
import {
    type BaseCardFieldWrapperProps,
    BaseCardFieldWrapper,
}                           from '@/components/payments/BaseCardFieldWrapper'
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
    stripeCardFieldStyle,
}                           from './styles'



// react components:
export type CardBaseElementProps =
    |CardNumberElementProps
    |CardExpiryElementProps
    |CardCvcElementProps
export interface StripeCardFieldWrapperProps
    extends
        // bases:
        BaseCardFieldWrapperProps
{
    // components:
    stripeCardElementComponent : React.ReactElement<CardBaseElementProps>
}
const StripeCardFieldWrapper = (props: StripeCardFieldWrapperProps) => {
    // rest props:
    const {
        // formats:
        placeholder,
        
        
        
        // components:
        stripeCardElementComponent,
        
        
        
        // other props:
        ...restStripeCardFieldWrapperProps
    } = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean>(false); // the fields are intitially untouched, so initially blur
    const [isValid  , setIsValid  ] = useState<boolean>(false); // the fields are initially blank (but required), so initially invalid
    
    
    
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
        return React.cloneElement<CardBaseElementProps>(stripeCardElementComponent,
            // props:
            {
                // options:
                options : {
                    ...stripeCardElementComponent.props.options,
                    style : stripeCardFieldStyle,
                    placeholder,
                },
                
                
                
                // hanlders:
                onFocus   : handleFocus,
                onBlur    : handleBlur,
                onChange  : handleChange,
            },
        );
    }, [
        // formats:
        placeholder,
        
        
        
        // handlers:
        // handleFocus,  // stable ref
        // handleBlur,   // stable ref
        // handleChange, // stable ref
    ]);
    
    
    
    // default props:
    const {
        // states:
        focused      : editableFocused   = isFocused,
        isValid      : editableIsValid   = isValid,
        
        
        
        // other props:
        ...restBaseCardFieldWrapperProps
    } = restStripeCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <BaseCardFieldWrapper
            // other props:
            {...restBaseCardFieldWrapperProps}
            
            
            
            // formats:
            placeholder = {placeholder}
            
            
            
            // states:
            focused     = {editableFocused}
            isValid     = {editableIsValid}
        >
            {cachedCardField}
        </BaseCardFieldWrapper>
    );
};
export {
    StripeCardFieldWrapper,
    StripeCardFieldWrapper as default,
};
