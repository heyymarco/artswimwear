// cssfn:
import {
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
];
