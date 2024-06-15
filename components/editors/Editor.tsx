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

// reusable-ui components:
import {
    // react components:
    InputProps,
    Input,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// types:
export type EditorChangeEventHandler<TValue> = (value: TValue) => void



// react components:
export interface EditorProps<TElement extends Element = HTMLSpanElement, TValue extends any = string>
    extends
        // bases:
        Omit<InputProps<TElement>,
            // values:
            |'defaultValue'|'value'|'onChange' // converted to TValue
        >
{
    // values:
    defaultValue   ?: TValue
    value          ?: TValue
    onChange       ?: EditorChangeEventHandler<TValue>
    onChangeAsText ?: EditorChangeEventHandler<string>
}
const Editor = <TElement extends Element = HTMLSpanElement, TValue extends any = string>(props: EditorProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,         // take  , to be normalized: null => empty string, TValue => toString
        value,                // take  , to be normalized: null => empty string, TValue => toString
        onChange : _onChange, // remove, will be defined by SpecificEditor::onChange(TSpecific)
        onChangeAsText,       // take  , will be handled by `handleValueChange`
        
        
        
        // other props:
        ...restEditorProps
    } = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        onChangeAsText?.(value);
    });
    
    
    
    // jsx:
    return (
        <Input<TElement>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            defaultValue = {(defaultValue !== undefined) ? ((defaultValue !== null) ? `${defaultValue}` /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            value        = {(value        !== undefined) ? ((value        !== null) ? `${value}`        /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            onChange     = {handleValueChange}
        />
    );
};
export {
    Editor,            // named export for readibility
    Editor as default, // default export to support React.lazy
}
