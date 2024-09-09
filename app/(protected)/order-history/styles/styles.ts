// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export default [
    scope('main', {
        // layouts:
        display      : 'grid',
        
        
        
        // children:
        ...children('section', {
            justifyItems: 'center',
            ...children('article', {
                // sizes:
                maxInlineSize : `${breakpoints.lg}px`,
            }, { specificityWeight: 2 }),
        }),
    }),
];
