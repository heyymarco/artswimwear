// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'

// others:
import {
    default as MaskedInput,
}                           from 'credit-card-input-mask'



// react components:
export interface MaskPasteEvent {
    unformattedValue : string
    maskedInput      : MaskedInput
}
export interface MaskedEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
    // masks:
    maskPattern ?: string
}
const MaskedEditor = <TElement extends Element = HTMLElement>(props: MaskedEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // masks:
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
    
    // setup `MaskedInput`:
    const maskedInputRef = useRef<MaskedInput|null>(null);
    useEffect(() => {
        // conditions:
        if (maskedInputRef.current) return; // already applied => ignore
        const inputElm = inputRefInternal.current;
        if (!inputElm) return; // the <Input> is not loaded => ignore
        
        
        
        // setups:
        maskedInputRef.current = new MaskedInput({
            element : inputElm,
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
        const handleChange = () => {
            // conditions:
            const maskedInput = maskedInputRef.current;
            if (!maskedInput) return;
            const onChange = onChangeRef.current;
            if (!onChange) return;
            
            
            
            // actions:
            const value = maskedInput.getUnformattedValue();
            if (prevValueRef.current === value) return;
            prevValueRef.current = value;
            onChange(value);
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
