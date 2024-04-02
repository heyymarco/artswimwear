'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
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
export interface CreditCardExpiresEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        MaskedEditorProps<TElement>
{
}
const CreditCardExpiresEditor = <TElement extends Element = HTMLSpanElement>(props: CreditCardExpiresEditorProps<TElement>) => {
    // props:
    const {
        // handlers:
        onChange,
        onKeyDownCapture,
        
        
        
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // refs:
    const valueRef = useRef<string>(restCreditCardNumberInputProps.value ?? '');
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string>>((value) => {
        valueRef.current = value;
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    const handleKeyDownCaptureInternal = useEvent<React.KeyboardEventHandler<TElement>>((event) => {
        // data:
        const {
            shiftKey,
            altKey,
            ctrlKey,
            metaKey,
            
            code = '', // '' => autocomplete event
            key  = '', // '' => autocomplete event
        } = event;
        const inputElm = event.target as (EventTarget & HTMLInputElement);
        
        
        
        // conditions:
        if (shiftKey || altKey || ctrlKey || metaKey) return; // ignore when [shift] [alt] [ctrl] [win] key is pressed
        if (!code || !key)                            return; // ignore autocomplete event
        if (key.length !== 1)                         return; // ignore control keys like [backspace], [delete], [home], [end], etc
        if ((key < '0') || (key > '9')) {
            event.preventDefault();
            return;                                           // prevents non_numeric characters
        } // if
        
        
        
        // text position:
        const {
            value          = '',
            selectionStart = value.length,
            selectionEnd   = value.length,
        } = inputElm;
        const prevValue    = value.slice(0, selectionStart!);
        
        
        
        const number = Number.parseInt(key);
        if (!(
            ((selectionStart === 0) && (number >= 0) && (number <= 1))                                                                           // 1st digit month                  , the current digit must 0-1
            ||
            ((selectionStart === 1) &&
                ((prevValue === '0') && (number >= 1) && (number <= 9))                                                                          // if 1st digit is 0                , the current digit must 1-9, so produces 01-09
                ||
                ((prevValue === '1') && (number >= 0) && (number <= 2))                                                                          // if 1st digit is 1                , the current digit must 0-2, so produces 10-12
            )
            ||
            ((selectionStart === 3) && (number >= 2) && (number <= 9))                                                                           // 1st digit year                   , the current digit must 2-9
            ||
            ((selectionStart === 4) && (number >= 0) && (number <= 9))                                                                           // 2nd digit year                   , the current digit must 0-9, so produces 20-99
            ||
            ((selectionStart === 5) && (prevValue.slice(prevValue.length - 2) === '20') && (number >= 0) && (number <= 9))                       // 3rd digit year, starting with 20 , the current digit must 0-9, so produces 200-209
            ||
            ((selectionStart === 6) && (prevValue.slice(prevValue.length - 3, prevValue.length - 1) === '20') && (number >= 0) && (number <= 9)) // 3rd digit year, starting with 20x, the current digit must 0-9, so produces 20x0-20x9
        )) {
            event.preventDefault(); // prevents prohibited characters
            return;
        } // if
    });
    const handleKeyDownCapture         = useMergeEvents(
        // preserves the original `onKeyDown` from `props`:
        onKeyDownCapture,
        
        
        
        // actions:
        handleKeyDownCaptureInternal,
    );
    
    
    
    // default props:
    const {
        // masks:
        maskPattern = '{{12}}/{{2020}}',
        
        
        
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
            onKeyDownCapture={handleKeyDownCapture}
        />
    );
};
export {
    CreditCardExpiresEditor,            // named export for readibility
    CreditCardExpiresEditor as default, // default export to support React.lazy
};
