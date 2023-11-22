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
export interface TextEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        EditorProps<TElement, string>
{
}
const TextEditor = <TElement extends Element = HTMLElement>(props: TextEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        onChange,
    ...restEditorProps} = props;
    
    
    
    // jsx:
    return (
        <Editor<TElement, string>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            onChangeAsText={onChange}
            
            
            
            // formats:
            type={props.type ?? 'text'}
        />
    );
};
export {
    TextEditor,
    TextEditor as default,
}
