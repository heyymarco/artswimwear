// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export default [
    scope('main', {
        // layouts:
        display      : 'grid',
        
        
        
        // scrolls:
        overflow: 'hidden', // workaround for overflowing popup
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    }),
];
