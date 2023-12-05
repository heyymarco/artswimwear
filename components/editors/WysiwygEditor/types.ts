// lexical functions:
import type {
    EditorState,
}                           from 'lexical'



export type WysiwygEditorState = Omit<EditorState, ''> // typescript hack to force WysiwygEditorState as not the same as EditorState
