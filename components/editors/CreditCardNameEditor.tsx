'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    InputProps,
    TextInput,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
export interface CreditCardNameEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        InputProps<TElement>
{
}
const CreditCardNameEditor = <TElement extends Element = HTMLSpanElement>(props: CreditCardNameEditorProps<TElement>) => {
    // props:
    const {
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Cardholder Name',
        placeholder              = 'John Doe',
        
        
        
        // validations:
        required                 = true,
        
        
        
        // formats:
        inputMode                = 'text',
        autoComplete             = 'cc-name',
        autoCapitalize           = 'words',
        
        
        
        // other props:
        ...restInputProps
    } = restCreditCardNumberInputProps;
    
    
    
    // jsx:
    return (
        <TextInput<TElement>
            // other props:
            {...restInputProps}
            
            
            
            // accessibilities:
            aria-label     = {ariaLabel}
            placeholder    = {placeholder}
            
            
            
            // validations:
            required       = {required}
            
            
            
            // formats:
            inputMode      = {inputMode}
            autoComplete   = {autoComplete}
            autoCapitalize = {autoCapitalize}
        />
    );
};
export {
    CreditCardNameEditor,            // named export for readibility
    CreditCardNameEditor as default, // default export to support React.lazy
};
