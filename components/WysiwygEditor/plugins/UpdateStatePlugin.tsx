// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// lexical functions:
import {
    // hooks:
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'
import {
    // calls onChange whenever Lexical state is updated.
    OnChangePlugin,
}                           from '@lexical/react/LexicalOnChangePlugin'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/Editor'
import type {
    // types:
    WysiwygEditorState,
}                           from '../types'



// react components:
export interface UpdateStatePluginProps {
    value        ?: WysiwygEditorState|null
    defaultValue ?: WysiwygEditorState|null
    onChange     ?: EditorChangeEventHandler<WysiwygEditorState|null>
}
const UpdateStatePlugin = ({value, defaultValue, onChange}: UpdateStatePluginProps): JSX.Element|null => {
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    const newValue  = ((value !== undefined) ? value : defaultValue) ?? null;
    const prevValue = useRef<WysiwygEditorState|null>(newValue);
    useEffect(() => {
        // conditions:
        if (prevValue.current === newValue) return; // no diff => ignore
        const editorState = (
            !newValue
            ? null
            : ('root' in newValue)
                ? editor.parseEditorState(newValue as any)
                : newValue
        );
        prevValue.current = editorState; // sync
        
        
        
        // actions:
        editor.update(() => {
            editor.setEditorState(editorState ?? ({} as any));
        });
    }, [newValue]); // (re)run the setups on every time the `newValue` changes
    
    
    
    // handlers:
    const handleValueChange = useEvent<Parameters<typeof OnChangePlugin>[0]['onChange']>((editorState, editor) => {
        // conditions:
        if (!onChange) return; // onChange handler is not set => ignore
        
        
        
        editorState.read(() => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            if (prevValue.current === editorState) return; // no diff => ignore
            prevValue.current = editorState;
            
            
            
            // actions:
            onChange(editorState);
        });
    });
    
    
    
    // jsx:
    return (
        /* calls onChange whenever Lexical state is updated. */
        <OnChangePlugin
            // behaviors:
            ignoreHistoryMergeTagChange={true}
            ignoreSelectionChange={true}
            
            
            
            // handlers:
            onChange={handleValueChange}
        />
    );
};
export {
    UpdateStatePlugin,
    UpdateStatePlugin as default,
}
