// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
}                           from '@reusable-ui/content'                 // a base component

// UIs:
import {
    // react components:
    ContentEditable,
}                           from '@lexical/react/LexicalContentEditable'

// plugins:
import {
    defaultPlugins,
}                           from '../defaultPlugins'



// styles:
const contentEditableStyle : React.CSSProperties = {
    // layouts:
    display : 'contents', // remove layout
};



// react components:
export interface ViewerPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ContentProps<TElement>,
            // children:
            |'children' // not supported
        >
{
}
const ViewerPlugin = <TElement extends Element = HTMLElement>(props: ViewerPluginProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <Content<TElement>
            // other props:
            {...props}
        >
            {...useMemo(() => defaultPlugins({
                contentEditable : <ContentEditable style={contentEditableStyle} />
            }), [])}
        </Content>
    );
};
export {
    ViewerPlugin,
    ViewerPlugin as default,
}
