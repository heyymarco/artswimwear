// cssfn:
import {
    // writes css in javascript:
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export default () => [
    scope('dialog', {
        boxSizing     : 'border-box',
        maxInlineSize : `${breakpoints.sm}px`,
        maxBlockSize  : `${breakpoints.sm}px`,
    }, {specificityWeight: 4}),
    scope('layout', {
        // layouts:
        display: 'grid',
    }, {specificityWeight: 2}),
];
