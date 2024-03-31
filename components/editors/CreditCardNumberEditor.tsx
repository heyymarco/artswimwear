'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// internal components:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    MaskedEditorProps,
    MaskedEditor,
}                           from '@/components/editors/MaskedEditor'



// react components:
export interface CreditCardNumberEditorProps
    extends
        MaskedEditorProps
{
}
const CreditCardNumberEditor = (props: CreditCardNumberEditorProps) => {
    // props:
    const {
        // handlers:
        onChange,
        
        
        
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // states:
    const [defaultMaskPattern, setDefaultMaskPattern] = useState<string>('{{9999}} {{9999}} {{9999}} {{9999}}');
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string>>((cardNumber) => {
        // conditions:
        if (restCreditCardNumberInputProps.maskPattern !== undefined) return;
        
        
        
        // actions:
        if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) {
            // American Express:
            setDefaultMaskPattern('{{9999}} {{999999}} {{99999}}'); // (4-6-5)
            return;
        } // if
        
        
        
        if (cardNumber.startsWith('50')) {
            // Maestro:
            setDefaultMaskPattern('{{9999}} {{9999}} {{99999}}'); // (4-4-5)
            return;
        } // if
        
        
        
        if (cardNumber.startsWith('56') || cardNumber.startsWith('57') || cardNumber.startsWith('58')) {
            // Maestro:
            setDefaultMaskPattern('{{9999}} {{999999}} {{99999}}'); // (4-6-5)
            return;
        } // if
        
        
        
        if (cardNumber.startsWith('6')) {
            // Maestro:
            setDefaultMaskPattern('{{9999}} {{9999}} {{9999}} {{9999}} {{999}}'); // (4-4-4-4-3)
            return;
        } // if
        
        
        
        if ([300, 301, 302, 303, 304, 305].some((num) => cardNumber.startsWith(`${num}`))) {
            // Diners Club Carte Blanche:
            setDefaultMaskPattern('{{9999}} {{999999}} {{9999}}'); // (4-6-4)
            return;
        } // if
        
        
        
        if ([309, 36, 38, 39].some((num) => cardNumber.startsWith(`${num}`))) {
            // Diners Club International:
            setDefaultMaskPattern('{{9999}} {{999999}} {{9999}}'); // (4-6-4)
            return;
        } // if
        
        
        
        if (cardNumber.startsWith('1')) {
            // Maestro:
            setDefaultMaskPattern('{{9999}} {{99999}} {{999999}}'); // (4-5-6)
            return;
        } // if
        
        
        
        // default:
        setDefaultMaskPattern('{{9999}} {{9999}} {{9999}} {{9999}}'); // (4-4-4-4)
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // default props:
    const {
        // masks:
        maskPattern = defaultMaskPattern,
        
        
        
        // other props:
        ...restMaskedEditorProps
    } = restCreditCardNumberInputProps;
    
    
    
    // jsx:
    return (
        <MaskedEditor
            // other props:
            {...restMaskedEditorProps}
            
            
            
            // masks:
            maskPattern={maskPattern}
            
            
            
            // handlers:
            onChange={handleChange}
        />
    );
};
export {
    CreditCardNumberEditor,            // named export for readibility
    CreditCardNumberEditor as default, // default export to support React.lazy
};
