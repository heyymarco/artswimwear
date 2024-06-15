// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'



// react components:
export interface TextEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        EditorProps<TElement, string>
{
}
const TextEditor = <TElement extends Element = HTMLSpanElement>(props: TextEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        onChange,
        onChangeAsText,
        
        
        
        // other props:
        ...restTextEditorProps
    } = props;
    
    
    
    // handlers:
    const handleChangeAsText = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
    );
    
    
    
    // default props:
    const {
        // formats:
        type = 'text',
        
        
        
        // other props:
        ...restEditorProps
    } = restTextEditorProps;
    
    
    
    // jsx:
    return (
        <Editor<TElement, string>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            onChangeAsText={handleChangeAsText}
            
            
            
            // formats:
            type={type}
        />
    );
};
export {
    TextEditor,            // named export for readibility
    TextEditor as default, // default export to support React.lazy
}
