// react:
import {
    // react:
    default as React,
}                           from 'react'

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
        
        
        
        // other props:
        ...restTextEditorProps
    } = props;
    
    
    
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
            onChangeAsText={onChange}
            
            
            
            // formats:
            type={type}
        />
    );
};
export {
    TextEditor,            // named export for readibility
    TextEditor as default, // default export to support React.lazy
}
