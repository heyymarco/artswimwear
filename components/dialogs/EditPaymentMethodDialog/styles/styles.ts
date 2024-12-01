// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export default () => [
    scope('dialog', {
        boxSizing     : 'border-box',
        maxInlineSize : `${breakpoints.md}px`,
        // maxBlockSize  : `${breakpoints.sm}px`, // unlimited for max height
    }, {specificityWeight: 4}),
    scope('creditCardTab', {
        // layout:
        display      : 'grid',
    }),
    scope('creditCardForm', {
        // layout:
        display      : 'grid',
    }),
    scope('creditCardLayout', {
        // layout:
        display      : 'grid',
        alignContent : 'start',
        
        
        
        // spacings:
        gap: spacers.md,
    }),
];
