// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export default () => [
    scope('nav', {
        // spacings:
        paddingBlockEnd: '0px',
        ...children('article', {
            marginBlockEnd: '0px', // kill parent padding
            paddingBlockEnd: '0px',
        }),
    }, { specificityWeight: 2 }),
    
    scope('gallery', {
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        paddingBlockStart : '2rem',
        ...children('article', {
            // layouts:
            display: 'grid',
            
            
            
            // spacings:
            marginBlockStart: '-2rem', // kill parent padding
            paddingBlockStart : '1rem',
        }),
    }, { specificityWeight: 2 }),
];
