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
        // validations:
        maskPattern = '{{1234}}',
        
        
        
        // other props:
        ...restMaskedEditorProps
    } = restCreditCardNumberInputProps;
    
    
    
    // jsx:
    return (
        <MaskedEditor<TElement>
            // other props:
            {...restMaskedEditorProps}
            
            
            
            // validations:
            maskPattern={maskPattern}
        />
    );
};
export {
    CreditCardCvvEditor,            // named export for readibility
    CreditCardCvvEditor as default, // default export to support React.lazy
};
