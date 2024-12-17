// cssfn:
import {
    // writes css in javascript:
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // reusable-ui configs:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesPayWithSavedCardButtonLayout = () => {
    return style({
        // layouts:
        display      : 'inline-grid',
        gridAutoFlow : 'column',
        
        
        
        // spacings:
        gap          : spacers.sm,
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesPayWithSavedCardButtonLayout(),
    }, { specificityWeight: 2 }),
];
