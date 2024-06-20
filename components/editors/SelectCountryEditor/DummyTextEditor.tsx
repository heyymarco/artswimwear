// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // react components:
    type EditorProps,
}                           from '@/components/editors/Editor'

// privates:
import {
    type DummyInputProps,
    DummyInput,
}                           from './DummyInput'



// react components:
export interface DummyTextEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        EditorProps<TElement, string>,
        
        // values:
        Pick<DummyInputProps,
            // values:
            |'valueToUi'
        >
{
}
const DummyTextEditor = <TElement extends Element = HTMLSpanElement>(props: DummyTextEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,         // take  , to be normalized: null => empty string, TValue => toString
        value,                // take  , to be normalized: null => empty string, TValue => toString
        onChange,             // take  , will be handled by `handleValueChange`
        onChangeAsText,       // take  , will be handled by `handleValueChange`
        
        
        
        // other props:
        ...restDummyTextEditorProps
    } = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        onChange?.(value);
        onChangeAsText?.(value);
    });
    
    
    
    // default props:
    const {
        // formats:
        type = 'text',
        
        
        
        // other props:
        ...restDummyInputProps
    } = restDummyTextEditorProps;
    
    
    
    // jsx:
    return (
        <DummyInput<TElement>
            // other props:
            {...restDummyInputProps}
            
            
            
            // values:
            defaultValue = {(defaultValue !== undefined) ? ((defaultValue !== null) ? `${defaultValue}` /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            value        = {(value        !== undefined) ? ((value        !== null) ? `${value}`        /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            onChange     = {handleValueChange}
        />
    );
};
export {
    DummyTextEditor,            // named export for readibility
    DummyTextEditor as default, // default export to support React.lazy
}
