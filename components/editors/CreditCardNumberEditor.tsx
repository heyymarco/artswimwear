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
export interface CreditCardNumberEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        MaskedEditorProps<TElement>
{
}
const CreditCardNumberEditor = <TElement extends Element = HTMLSpanElement>(props: CreditCardNumberEditorProps<TElement>) => {
    // props:
    const {
        // handlers:
        onChange,
        
        
        
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // states:
    const [defaultMaskPattern, setDefaultMaskPattern] = useState<string>('{{4444}} {{4444}} {{4444}} {{4444}} {{000}}'); // (4-4-4-4_3)
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string>>((cardNumber) => {
        // conditions:
        if (restCreditCardNumberInputProps.maskPattern !== undefined) return;
        
        
        
        const cardNumberLength = cardNumber.length;
        
        
        
        // actions:
        if (((cardNumberLength >= 13) && (cardNumberLength <= 19)) && cardNumber.startsWith('4')) {
            // Visa (incl. VPay):
            setDefaultMaskPattern('{{4444}} {{4444}} {{4444}} {{4444}} {{333}}'); // (4-4-4-4) || (4-4-4-4-3) // Pattern not known for 13-15 and 17-19 digit cards.
            return;
        } // if
        
        
        
        if ((cardNumberLength === 15) && [34, 37].some((num) => cardNumber.startsWith(`${num}`))) {
            // American Express:
            setDefaultMaskPattern('{{4444}} {{666666}} {{55555}} {{0000}}'); // (4-6-5_4)
            return;
        } // if
        
        
        
        if ((cardNumberLength === 13) && cardNumber.startsWith('50')) {
            // Maestro:
            setDefaultMaskPattern('{{4444}} {{4444}} {{55555}} {{000000}}'); // (4-4-5_6) // Pattern not known for 12, 14, 17, and 18 digit cards.
            return;
        } // if
        
        
        
        if ((cardNumberLength === 15) && [56, 57, 58].some((num) => cardNumber.startsWith(`${num}`))) {
            // Maestro:
            setDefaultMaskPattern('{{4444}} {{666666}} {{55555}} {{0000}}'); // (4-6-5_4) // Pattern not known for 12, 14, 17, and 18 digit cards.
            return;
        } // if
        
        
        
        if (((cardNumberLength >= 16) && (cardNumberLength <= 19)) && cardNumber.startsWith('6')) {
            // Maestro:
            setDefaultMaskPattern('{{4444}} {{4444}} {{4444}} {{4444}} {{333}}'); // (4-4-4-4) || (4-4-4-4-3) // Pattern not known for 12, 14, 17, and 18 digit cards.
            return;
        } // if
        
        
        
        if ((cardNumberLength === 14) && [300, 301, 302, 303, 304, 305].some((num) => cardNumber.startsWith(`${num}`))) {
            // Diners Club Carte Blanche:
            setDefaultMaskPattern('{{4444}} {{666666}} {{4444}} {{00000}}'); // (4-6-4_5)
            return;
        } // if
        
        
        
        if ((cardNumberLength === 14) && [309, 36, 38, 39].some((num) => cardNumber.startsWith(`${num}`))) {
            // Diners Club International:
            setDefaultMaskPattern('{{4444}} {{666666}} {{4444}} {{00000}}'); // (4-6-4_5)
            return;
        } // if
        
        
        
        if ((cardNumberLength === 15) && cardNumber.startsWith('1')) {
            // UATP:
            setDefaultMaskPattern('{{4444}} {{55555}} {{666666}} {{0000}}'); // (4-5-6_4)
            return;
        } // if
        
        
        
        // default:
        setDefaultMaskPattern('{{4444}} {{4444}} {{4444}} {{4444}} {{000}}'); // (4-4-4-4_3)
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
        <MaskedEditor<TElement>
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
