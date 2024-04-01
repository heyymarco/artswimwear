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
        defaultValue,
        value,
        onChange,
        onChangeAsText,
    ...restInputProps} = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        onChangeAsText?.(value);
    });
    
    
    
    // jsx:
    return (
        <Input<TElement>
            // other props:
            {...restInputProps}
            
            
            
            // values:
            defaultValue = {(defaultValue !== undefined) ? ((defaultValue !== null) ? `${defaultValue}` : '') : undefined}
            value        = {(value        !== undefined) ? ((value        !== null) ? `${value}`        : '') : undefined}
            onChange     = {handleValueChange}
        />
    );
};
export {
    Editor,
    Editor as default,
}
