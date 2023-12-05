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
}                           from '@/components/editors/Editor'
import type {
    // types:
    WysiwygEditorState,
}                           from '../types'



// utilities:
export const normalizeWysiwygEditorState = (value: WysiwygEditorState|null): WysiwygEditorState|null => {
    // detect for empty value:
    if (value) {
        if ('root' in value) { // value as plain JSON
            const firstChild = (value.root as any)?.children?.[0];
            if (!firstChild || ((firstChild?.type === 'paragraph') && !firstChild?.children?.length)) {
                // empty paragraph => empty content => null:
                return null;
            } // if
        }
        else { // value as EditorState
            const nodeMap = value?._nodeMap;
            const root = nodeMap?.get('root');
            if (!root) {
                // no root => empty content => null:
                return null;
            }
            else {
                const firstKey = root?.__first;
                if (!firstKey) {
                    // no child => empty content => null:
                    return null;
                }
                else {
                    const firstChild = nodeMap?.get(firstKey);
                    if (!firstChild || ((firstChild?.__type === 'paragraph') && !firstChild?.__first)) {
                        // empty paragraph => empty content => null:
                        return null;
                    } // if
                } // if
            } // if
        } // if
    } // if
    
    
    
    return value;
};



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
    
    const newValue  = normalizeWysiwygEditorState(((value !== undefined) ? value : defaultValue) ?? null);
    const prevValue = useRef<WysiwygEditorState|null>(newValue);
    useEffect(() => {
        // conditions:
        if (prevValue.current === newValue) return; // no diff => ignore
        const editorState = (
            !newValue
            ? editor.parseEditorState({root: {
                children  : [
                    // an empty paragraph hack to clear the content:
                    {
                        children  : [],
                        direction : null,
                        format    : '',
                        indent    : 0,
                        type      : 'paragraph',
                        version   : 1,
                    },
                ],
                direction : null,
                format    : '',
                indent    : 0,
                type      : 'root',
                version   : 1,
            }} as any)
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
            
            
            
            // detect for empty newValue:
            const newValue = normalizeWysiwygEditorState(editorState);
            
            
            
            if (prevValue.current === newValue) return; // no diff => ignore
            prevValue.current = newValue;
            
            
            
            // actions:
            onChange(newValue);
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
