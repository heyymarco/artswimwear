// cssfn:
import {
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // reusable-ui configs:
    spacers,
}                           from '@reusable-ui/core'        // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesPublicOrderStatusBadgeLayout = () => { // the <ListItem> of order list
    return style({
        // layouts:
        display      : 'grid',
        gridAutoFlow : 'column',
        alignItems   : 'center',
        
        
        
        // spacings:
        gap : spacers.xs,
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesPublicOrderStatusBadgeLayout(),
    }, { specificityWeight: 2 }),
];
