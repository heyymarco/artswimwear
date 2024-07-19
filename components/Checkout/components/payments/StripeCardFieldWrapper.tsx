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

// reusable-ui components:
import {
    // base-components:
    EditableTextControlProps,
    EditableTextControl,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// stripe:
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
        // identifiers:
        id,
        
        
        
        // components:
        cardElementComponent,
    ...restEditableTextControlProps} = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean|undefined>(false);
    const [isValid  , setIsValid  ] = useState<boolean|undefined>(true);
    
    
    
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
    const cachedHostedElement = useMemo(() => {
        // default props:
        const {
            // identifiers:
            id : hostedElementId = id,
        } = cardElementComponent.props;
        
        
        
        // jsx:
        return React.cloneElement<CardBaseElementProps>(cardElementComponent,
            // props:
            {
                // identifiers:
                id       : hostedElementId,
                
                
                
                // hanlders:
                onFocus  : handleFocus,
                onBlur   : handleBlur,
                onChange : handleChange,
            },
        );
    }, [
        // identifiers:
        id,
    ]);
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {-1}
            // aria-label = {placeholder}
            
            
            
            // states:
            focused    = {isFocused ?? false}
            isValid    = {isValid   ?? null }
        >
            {cachedHostedElement}
        </EditableTextControl>
    );
};
export {
    StripeCardFieldWrapper,
    StripeCardFieldWrapper as default,
};
