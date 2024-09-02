// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco core:
import {
    createSyntheticUIEvent,
}                           from '@heymarco/events'

// heymarco components:
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@heymarco/text-editor'

// others:
import {
    default as MaskedInput,
}                           from 'credit-card-input-mask'



// utilities:
const reactHackTriggerOnChangeEventMark = Symbol();



// react components:
export interface MaskPasteEvent {
    unformattedValue : string
    maskedInput      : MaskedInput
}
export interface MaskedEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
    // validations:
    maskPattern ?: string
}
const MaskedEditor = <TElement extends Element = HTMLSpanElement>(props: MaskedEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // validations:
        maskPattern = '',
        
        
        
        // handlers:
        onChange,
        
        
        
        // other props:
        ...restMaskedEditorProps
    } = props;
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedElmRef     = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        // refs:
        inputRefInternal,
    );
    
    
    
    // effects:
    
    // proxied `onInput` event listeners:
    const proxiedOnInputEventListeners = useMemo<Set<((this: HTMLInputElement, ev: HTMLElementEventMap['input']) => any)>>(() => new Set<((this: HTMLInputElement, ev: HTMLElementEventMap['input']) => any)>(), []);
    useEffect(() => {
        // conditions:
        const inputElm = inputRefInternal.current;
        if (!inputElm) return; // the <Input> is not loaded => ignore
        
        
        
        // handlers:
        const handleInput = (event: HTMLElementEventMap['input']): void => {
            if (reactHackTriggerOnChangeEventMark in event) {
                return; // intercepted and not forwarded to `MaskedInput` to avoid ugly side effect
            } // if
            
            
            
            for (const proxiedOnInputEventListener of proxiedOnInputEventListeners) {
                proxiedOnInputEventListener.call(inputElm, event);
            } // for
        };
        
        
        
        // setups:
        inputElm.addEventListener('input', handleInput);
        
        
        
        // cleanups:
        return () => {
            inputElm.removeEventListener('input', handleInput);
        };
    }, []);
    
    // setup `MaskedInput`:
    const maskedInputRef = useRef<MaskedInput|null>(null);
    useEffect(() => {
        // conditions:
        if (maskedInputRef.current) return; // already applied => ignore
        const inputElm = inputRefInternal.current;
        if (!inputElm) return; // the <Input> is not loaded => ignore
        
        
        
        // handlers:
        const handleAutoFormat = (newValue: string): void => {
            // conditions:
            if (inputElm.value === newValue) return;
            
            
            
            // react *hack*: trigger `onChange` event:
            const oldValue = inputElm.value;                     // react *hack* get_prev_value *before* modifying
            inputElm.value = newValue;                           // react *hack* set_value *before* firing `input` event
            (inputElm as any)._valueTracker?.setValue(oldValue); // react *hack* in order to React *see* the changes when `input` event fired
            
            
            
            // fire `input` native event to trigger `onChange` synthetic event:
            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: false, composed: true, data: newValue, dataTransfer: null, inputType: 'insertReplacementText', isComposing: false, view: null, detail: 0 });
            // @ts-ignore
            inputEvent[reactHackTriggerOnChangeEventMark] = true;
            inputElm.dispatchEvent(inputEvent);
        };
        
        
        
        // setups:
        const proxyInputElm = {
            addEventListener    : <K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void => {
                if (type === 'input') {
                    proxiedOnInputEventListeners.add(listener as ((this: HTMLInputElement, ev: HTMLElementEventMap['input']) => any));
                    return;
                } // if
                
                
                
                inputElm.addEventListener(type, listener, options);
            },
            removeEventListener : <K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void => {
                if (type === 'input') {
                    proxiedOnInputEventListeners.delete(listener as ((this: HTMLInputElement, ev: HTMLElementEventMap['input']) => any));
                    return;
                } // if
                
                
                
                inputElm.removeEventListener(type, listener, options);
            },
            dispatchEvent       : (event: Event) => inputElm.dispatchEvent(event),
        }
        Object.defineProperty(proxyInputElm, 'value', {
            get() {
                return inputElm.value;
            },
            set(newValue) {
                handleAutoFormat(newValue);
            },
        })
        maskedInputRef.current = new MaskedInput({
            element : proxyInputElm as any,
            pattern : maskPattern,
        });
    }, []);
    
    // update `MaskedInput`'s maskPattern:
    useEffect(() => {
        // conditions:
        const maskedInput = maskedInputRef.current;
        if (!maskedInput) return;
        
        
        
        // actions:
        maskedInput.setPattern(maskPattern);
    }, [maskPattern]);
    
    // the `MaskedInput` breaks the React' `onChange` event, so we trigger it manually:
    const onChangeRef = useRef<typeof onChange>(onChange);
    onChangeRef.current = onChange;
    const prevValueRef = useRef<string>('');
    useEffect(() => {
        // conditions:
        const inputElm = inputRefInternal.current;
        if (!inputElm) return; // the <Input> is not loaded => ignore
        
        
        
        // handlers:
        const handleChange = (event: Event) => {
            // conditions:
            const maskedInput = maskedInputRef.current;
            if (!maskedInput) return;
            const onChange = onChangeRef.current;
            if (!onChange) return;
            
            
            
            // actions:
            const value = maskedInput.getUnformattedValue();
            if (prevValueRef.current === value) return;
            prevValueRef.current = value;
            
            // TODO: validate synthetic MouseEvent:
            const changeEvent : React.ChangeEvent<HTMLInputElement> = {
                ...createSyntheticUIEvent<HTMLInputElement, UIEvent>({
                    nativeEvent   : event as UIEvent,
                    currentTarget : inputRefInternal.current ?? undefined,
                }),
                target : event.target as HTMLInputElement,
            };
            
            onChange(value, changeEvent);
        };
        
        
        
        // setups:
        prevValueRef.current = ((): string => {
            // conditions:
            const maskedInput = maskedInputRef.current;
            if (!maskedInput) return '';
            
            
            
            // actions:
            return maskedInput.getUnformattedValue();
        })();
        inputElm.addEventListener('input', handleChange);
        
        
        
        // cleanups:
        return () => {
            inputElm.removeEventListener('input', handleChange);
        };
    }, [])
    
    
    
    // default props:
    const {
        // other props:
        ...restTextEditorProps
    } = restMaskedEditorProps;
    
    
    
    // jsx:
    return (
        <TextEditor<TElement>
            // other props:
            {...restTextEditorProps}
            
            
            
            // refs:
            elmRef={mergedElmRef}
        />
    );
};
export {
    MaskedEditor,            // named export for readibility
    MaskedEditor as default, // default export to support React.lazy
};
