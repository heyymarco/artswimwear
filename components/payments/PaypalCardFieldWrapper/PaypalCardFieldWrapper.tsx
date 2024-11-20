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

// payment components:
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
        EditableTextControlProps,
        Pick<PayPalCardFieldsIndividualFieldOptions,
            // formats:
            |'placeholder'
        >
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
    const handleFocus    = useEvent((data: PayPalCardFieldsStateObject): void => {
        // actions:
        setIsFocused(true);
    });
    const handleBlur    = useEvent((data: PayPalCardFieldsStateObject): void => {
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
        // accessibilities:
        tabIndex     : editableTabIndex  = -1,
        
        
        
        // formats:
        'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // states:
        focused      : editableFocused   = isFocused,
        isValid      : editableIsValid   = isValid,
        
        
        // other props:
        ...restEditableTextControlProps
    } = restPaypalCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
            
            
            
            // formats:
            aria-label = {editableAriaLabel}
            
            
            
            // states:
            focused    = {editableFocused}
            isValid    = {editableIsValid}
        >
            {cachedCardField}
        </EditableTextControl>
    );
};
export {
    PaypalCardFieldWrapper,
    PaypalCardFieldWrapper as default,
};
