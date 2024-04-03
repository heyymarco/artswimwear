'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    MaskedEditorProps,
    MaskedEditor,
}                           from '@/components/editors/MaskedEditor'



// react components:
export interface CreditCardCvvEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        MaskedEditorProps<TElement>
{
}
const CreditCardCvvEditor = <TElement extends Element = HTMLSpanElement>(props: CreditCardCvvEditorProps<TElement>) => {
    // props:
    const {
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // default props:
    const {
        // accessibilities:
        placeholder    = '123',
        
        
        
        // validations:
        required       = true,
        pattern        = '[0-9]{3,4}',
        maskPattern    = '{{1234}}',
        
        
        
        // formats:
        inputMode      = 'numeric',
        autoComplete   = 'cc-csc',
        
        
        
        // other props:
        ...restMaskedEditorProps
    } = restCreditCardNumberInputProps;
    
    
    
    // jsx:
    return (
        <MaskedEditor<TElement>
            // other props:
            {...restMaskedEditorProps}
            
            
            
            // accessibilities:
            placeholder  = {placeholder}
            
            
            
            // validations:
            required     = {required}
            pattern      = {pattern}
            maskPattern  = {maskPattern}
            
            
            
            // formats:
            inputMode    = {inputMode}
            autoComplete = {autoComplete}
        />
    );
};
export {
    CreditCardCvvEditor,            // named export for readibility
    CreditCardCvvEditor as default, // default export to support React.lazy
};
