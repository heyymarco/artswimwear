// cssfn:
import {
    // writes css in javascript:
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export default () => [
    scope('cardBody', {
        // layouts:
        display : 'grid',
        
        
        
        // sizes:
        boxSizing         : 'border-box',
        minInlineSize     : `calc(100vw - (${containers.paddingInline} * 2))`,
        ...ifScreenWidthAtLeast('md', {
            minInlineSize : `${breakpoints.sm}px`,
        }),
    }, { specificityWeight: 3 }),
];