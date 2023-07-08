// react:
import {
    // react:
    default as React,
}                           from 'react'

// UIs:
import
    // react components:
    LexicalErrorBoundary
                            from '@lexical/react/LexicalErrorBoundary'
import {
    // react components:
    ContentEditable,
}                           from '@lexical/react/LexicalContentEditable'

// texts:
// import {
//     // plain text editing, including typing, deletion and copy/pasting.
//     PlainTextPlugin,
// }                           from '@lexical/react/LexicalPlainTextPlugin'
import {
    // rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting.
    RichTextPlugin,
}                           from '@lexical/react/LexicalRichTextPlugin'
import {
    // allows tab indentation in combination with `<RichTextPlugin>`.
    TabIndentationPlugin,
}                           from '@lexical/react/LexicalTabIndentationPlugin'

// resources:
import {
    // adds support for links, including toggleLink command support that toggles link for selected text.
    LinkPlugin,
}                           from '@lexical/react/LexicalLinkPlugin'

// layouts:
import {
    // adds support for lists (ordered and unordered).
    ListPlugin,
}                           from '@lexical/react/LexicalListPlugin'
import {
    // adds support for tables.
    TablePlugin,
}                           from '@lexical/react/LexicalTablePlugin'

// resources:
// import
//     // auto converts link-like-texts to links.
//     AutoLinkPlugin
//                             from './plugins/AutoLinkPlugin'

// codes:
// import
//     CodeHighlightPlugin
//                             from './plugins/CodeHighlightPlugin'



export interface DefaultPluginsOptions {
    placeholder     ?: Parameters<typeof RichTextPlugin>[0]['placeholder']
    contentEditable ?: JSX.Element
}
export const defaultPlugins = ({placeholder, contentEditable}: DefaultPluginsOptions) => React.Children.toArray([
    // texts:
    
    // plain text editing, including typing, deletion and copy/pasting.
    /* <PlainTextPlugin
        // UIs:
        ErrorBoundary   = {LexicalErrorBoundary}
        contentEditable = {<ContentEditable />}
        placeholder     = {
            <Placeholder
                // accessibilities:
                placeholder={placeholder}
                
                
                
                // components:
                placeholderComponent={placeholderComponent}
            />
        }
    /> */
    
    // rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting.
    <RichTextPlugin
        // UIs:
        ErrorBoundary   = {LexicalErrorBoundary}
        contentEditable = {contentEditable ?? <ContentEditable className='editable' />}
        placeholder     = {placeholder ?? null}
    />,
    
    // allows tab indentation in combination with `<RichTextPlugin>`.
    <TabIndentationPlugin />,
    
    
    
    // resources:
    
    // adds support for links, including toggleLink command support that toggles link for selected text.
    <LinkPlugin />,
    
    // auto converts link-like-texts to links.
    /* <AutoLinkPlugin />, */
    
    
    
    // layouts:
    
    // adds support for lists (ordered and unordered).
    <ListPlugin />,
    
    // adds support for tables.
    <TablePlugin />,
    
    
    
    // identifiers:
    
    // codes:
    /* <CodeHighlightPlugin />, */
]);
