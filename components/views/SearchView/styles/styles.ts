// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesMainLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap : spacers.md,
        
        
        
        // children:
        ...children('form', {
            display: 'grid',
        }),
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
];
