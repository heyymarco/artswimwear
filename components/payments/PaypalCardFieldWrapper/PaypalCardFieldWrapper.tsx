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
    type PayPalCardFieldsStateObject,
}                           from '@paypal/paypal-js'
import {
    type PayPalCardFieldsIndividualFieldOptions,
}                           from '@paypal/react-paypal-js'



// react components:
export interface PaypalCardFieldWrapperProps
    extends
        // bases:
        BaseCardFieldWrapperProps
{
    // formats:
    type                     : keyof Awaited<PayPalCardFieldsStateObject>['fields']
    
    
    
    // components:
    paypalCardFieldComponent : React.ReactElement<PayPalCardFieldsIndividualFieldOptions>
}
const PaypalCardFieldWrapper = (props: PaypalCardFieldWrapperProps) => {
    // props:
    const {
        // formats:
        placeholder,
        
        
        
        // formats:
        type,
        
        
        
        // components:
        paypalCardFieldComponent,
        
        
        
        // other props:
        ...restPaypalCardFieldWrapperProps
    } = props;
    
    
    
    // states:
    const [isFocused, setIsFocused] = useState<boolean>(false); // the fields are intitially untouched, so initially blur
    const [isValid  , setIsValid  ] = useState<boolean>(false); // the fields are initially blank (but required), so initially invalid
    
    
    
    // handlers:
    const handleFocus        = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsFocused(true);
    });
    const handleBlur         = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsFocused(false);
    });
    const handleValidInvalid = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsValid(data.fields[type].isValid && !data.fields[type].isEmpty);
    });
    
    
    
    // caches:
    const cachedCardField = useMemo(() => {
        // jsx:
        return React.cloneElement<PayPalCardFieldsIndividualFieldOptions>(paypalCardFieldComponent,
            // props:
            {
                // formats:
                placeholder,
                
                
                
                // handlers:
                inputEvents : {
                    onFocus              : handleFocus,
                    onBlur               : handleBlur,
                    onChange             : handleValidInvalid,
                    onInputSubmitRequest : handleValidInvalid,
                },
            },
        );
    }, [
        // formats:
        placeholder,
        
        
        
        // handlers:
        // handleFocus,        // stable ref
        // handleBlur,         // stable ref
        // handleValidInvalid, // stable ref
    ]);
    
    
    
    // default props:
    const {
        // states:
        focused      : editableFocused   = isFocused,
        isValid      : editableIsValid   = isValid,
        
        
        
        // other props:
        ...restBaseCardFieldWrapperProps
    } = restPaypalCardFieldWrapperProps;
    
    
    
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
    PaypalCardFieldWrapper,
    PaypalCardFieldWrapper as default,
};
