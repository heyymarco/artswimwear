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
export interface Pay_PalCardFieldWrapperProps
    extends
        Omit<EditableTextControlProps,
            // styles:
            |'style'
        >,
        Pick<PayPalCardFieldsIndividualFieldOptions,
            // styles:
            |'style'
            
            // accessibilities:
            |'placeholder'
        >
{
    // formats:
    type                     : keyof Awaited<PayPalCardFieldsStateObject>['fields']
    
    
    
    // components:
    payPalCardFieldComponent : React.ReactElement<PayPalCardFieldsIndividualFieldOptions>
}
const Pay_PalCardFieldWrapper = (props: Pay_PalCardFieldWrapperProps) => {
    // props:
    const {
        // styles:
        style,
        
        
        
        // accessibilities:
        placeholder,
        
        
        
        // formats:
        type,
        
        
        
        // components:
        payPalCardFieldComponent,
        
        
        
        // other props:
        ...restPay_PalCardFieldWrapperProps
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
        return React.cloneElement<PayPalCardFieldsIndividualFieldOptions>(payPalCardFieldComponent,
            // props:
            {
                // styles:
                style,
                
                
                
                // accessibilities:
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
        // styles:
        style,
        
        
        
        // accessibilities:
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
        'aria-label' : editableAriaLabel = placeholder,
        
        
        
        // states:
        focused      : editableFocused   = isFocused,
        isValid      : editableIsValid   = isValid,
        
        
        // other props:
        ...restEditableTextControlProps
    } = restPay_PalCardFieldWrapperProps;
    
    
    
    // jsx:
    return (
        <EditableTextControl
            // other props:
            {...restEditableTextControlProps}
            
            
            
            // accessibilities:
            tabIndex   = {editableTabIndex}
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
    Pay_PalCardFieldWrapper,
    Pay_PalCardFieldWrapper as default,
};
