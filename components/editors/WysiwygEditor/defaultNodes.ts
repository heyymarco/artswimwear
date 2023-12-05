// texts:
import {
    ParagraphNode,
}                           from 'lexical'
import {
    HeadingNode,
    QuoteNode,
}                           from '@lexical/rich-text'

// resources:
import {
    LinkNode,
    AutoLinkNode,
}                           from '@lexical/link'

// layouts:
import {
    ListNode,
    ListItemNode,
}                           from '@lexical/list'
import {
    TableNode,
    TableRowNode,
    TableCellNode,
}                           from '@lexical/table'

// codes:
import {
    CodeNode,
    CodeHighlightNode,
}                           from '@lexical/code'



export const defaultNodes = () => [
    // texts:
    ParagraphNode,
    HeadingNode,
    QuoteNode,
    
    
    
    // resources:
    LinkNode,
    AutoLinkNode,
    // ImageNode,
    
    // layouts:
    ListNode,
    ListItemNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    
    
    
    // identifiers:
    // HashTagNode,
    
    
    
    // codes:
    CodeNode,
    CodeHighlightNode,
];
