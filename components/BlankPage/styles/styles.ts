// cssfn:
import {
    // writes css in javascript:
    fallback,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export default () => [
    scope('main', {
        // layouts:
        display : 'grid',
        
        
        
        // sizes:
        boxSizing: 'border-box',
        // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
        ...fallback({
            minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
        }),
        ...fallback({
            minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
        }),
    }),
];
