// cssfn:
import {
    // writes css in javascript:
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesLoadingMessageLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        gridAutoFlow : 'column',
        justifyItems: 'center',
        
        
        
        // spacings:
        gap: spacers.sm,
    });
};

export default [
    scope('loadingMessage', {
        // layouts:
        ...usesLoadingMessageLayout(),
    }),
];
