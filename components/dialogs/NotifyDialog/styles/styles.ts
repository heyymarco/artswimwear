// cssfn:
import {
    scope,
    children,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export default () => [
    scope('card', {
        // sizes:
        maxInlineSize : 'fit-content', // the <Card>'s width is only as wide as the content needed
        
        
        
        // children:
        ...children('.body', {
            overflow: 'hidden', // prevents an ugly scrollbar shown when collapsing
        }),
    }, { specificityWeight: 2 }),
];
