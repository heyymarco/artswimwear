'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    MaskedEditorProps,
    MaskedEditor,
}                           from '@/components/editors/MaskedEditor'



// utilities:
/*
    ^
    (
        0[1-9]?                     // month     :  01    to  09
        |                           // ------------or-------------
        1[0-2]?                     // month     :  10    to  12
    )?
    (
        [/]                         // separator :  /
        (
            2                       // only support year of 2000+, 1999- is not supported
            (
                (
                    0               // year      :  20
                    [0-9]{0,2}      // year      :  2000  to  2099
                )?
                |                   // ------------or-------------
                [1-9]?              // year      :  21    to  29
            )
        )?
    )?
    $
*/
/*
    trimmed:
    
    ^(0[1-9]?|1[0-2]?)?([/](2((0[0-9]{0,2})?|[1-9]?))?)?$
*/
const regexpPatternPartial = /^(0[1-9]?|1[0-2]?)?([/](2((0[0-9]{0,2})?|[1-9]?))?)?$/;



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
        onKeyDownCapture,
        
        
        
        // other props:
        ...restCreditCardNumberInputProps
    } = props;
    
    
    
    // handlers:
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
        if (
            (
                (key.length !== 1)
                ||
                ((key < '0') || (key > '9'))
            )
            &&
            !['Backspace', 'Delete'].includes(key)
        ) {
            if (key.length === 1) event.preventDefault();     // prevents non_numeric characters except [backspace], [delete]
            return;
        } // if
        
        
        
        // text position:
        const {
            value          = '',
            selectionStart = value.length,
            selectionEnd   = value.length,
        } = inputElm;
        const hasSelection = !!(selectionEnd! - selectionStart!);
        const prevValue    = value.slice(0, selectionStart!);             // the value before selection
     // const selValue     = value.slice(selectionStart!, selectionEnd!); // the selected value
        const nextValue    = value.slice(selectionEnd!);                  // the value after selection
        const willValue    = (                                            // the future value if this event is not prevented
            (key === 'Backspace')
            ? (
                hasSelection
                ? `${prevValue}${nextValue}`
                : `${prevValue.slice(0, -1)}${nextValue}`
            )
            : (
                (key === 'Delete')
                ? (
                    hasSelection
                    ? `${prevValue}${nextValue}`
                    : `${prevValue}${nextValue.slice(1)}`
                )
                : `${prevValue}${key}${nextValue}`
            )
        );
        
        
        
        if (!regexpPatternPartial.test(willValue)) { // the future value is not valid pattern
            // try to recover by removing characters after selection:
            const willValuePartial = (                                            // the future value if this event is not prevented
                (key === 'Backspace')
                ? (
                    hasSelection
                    ? `${prevValue}`
                    : `${prevValue.slice(0, -1)}`
                )
                : (
                    (key === 'Delete')
                    ? (
                        hasSelection
                        ? `${prevValue}`
                        : `${prevValue}`
                    )
                    : `${prevValue}${key}`
                )
            );
            if (regexpPatternPartial.test(willValuePartial)) {
                // success to partially recover => update value & update selection:
                inputElm.value = willValuePartial;
                const newSelection = selectionStart! + ((key.length == 1) ? 1 : 0);
                inputElm.setSelectionRange(newSelection, newSelection);
                
                event.preventDefault();
                return;
            } // if
            
            
            
            // try to recover by preventing the new changes:
            if (regexpPatternPartial.test(value)) {
                event.preventDefault();
                return;
            } // if
            
            
            
            // failed to recover => clear value & update selection:
            inputElm.value = '';
            const newSelection = 0;
            inputElm.setSelectionRange(newSelection, newSelection);
            
            event.preventDefault();
            return;
        } // if
        
        
        
        // passed
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
            onKeyDownCapture={handleKeyDownCapture}
        />
    );
};
export {
    CreditCardExpiresEditor,            // named export for readibility
    CreditCardExpiresEditor as default, // default export to support React.lazy
};
