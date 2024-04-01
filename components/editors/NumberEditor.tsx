// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'



// react components:
export interface NumberEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        Omit<EditorProps<TElement, number|null>,
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            |'min'|'max'|'step'      // only supports numeric value
            
            // formats:
            |'type'                  // only supports number
            |'autoCapitalize'        // nothing to capitalize of number
            |'inputMode'             // always 'numeric'
        >
{
    // validations:
    min  ?: number
    max  ?: number
    step ?: number
}
const NumberEditor = <TElement extends Element = HTMLSpanElement>(props: NumberEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        onChange,
    ...restEditorProps} = props;
    
    
    
    // handlers:
    const handleChangeAsText = useEvent<EditorChangeEventHandler<string>>((value) => {
        onChange?.(value ? Number.parseFloat(value) : null);
    });
    
    
    
    // jsx:
    return (
        <Editor<TElement, number|null>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            onChangeAsText={handleChangeAsText}
            
            
            
            // formats:
            type='number'
        />
    );
};
export {
    NumberEditor,
    NumberEditor as default,
}
