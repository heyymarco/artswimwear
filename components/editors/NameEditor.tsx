// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'



// react components:
export interface NameEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
}
const NameEditor = <TElement extends Element = HTMLSpanElement>(props: NameEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <TextEditor<TElement>
            // other props:
            {...props}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Name'}
            
            
            
            // validations:
            required={props.required ?? true}
            
            
            
            // formats:
            type={props.type ?? 'text'}
            autoCapitalize={props.autoCapitalize ?? 'words'}
        />
    );
};
export {
    NameEditor,
    NameEditor as default,
}
