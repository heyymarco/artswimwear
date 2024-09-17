// cssfn:
import {
    rule,
    children,
    scope,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
export default () => [
    scope('card', {
        // positions:
        justifySelf   : 'center',
        
        
        
        // sizes:
        maxInlineSize : 'max-content',
    }, { specificityWeight: 2 }),
    scope('cardBody', {
        // layouts:
        ...children('.action', {
            float: 'inline-end',
        }),
        ...children('p', {
            ...rule(':nth-child(2)', {
                marginBlockStart: 0,
            }),
        }),
    }, { specificityWeight: 2 }),
];
