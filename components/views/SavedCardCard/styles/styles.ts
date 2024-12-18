// cssfn:
import {
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesSavedCardCardLayout = () => {
    return style({
        // layouts:
        display              : 'grid',
        gridAutoFlow         : 'column',
        alignItems           : 'center',
        
        
        
        // spacings:
        gap                  : spacers.md,
        
        
        
        // children:
        ...children('.cardGroup', {
            // layouts:
            display          : 'grid',
            gridAutoFlow     : 'row',
            justifyItems     : 'center',
            alignItems       : 'inherit',
            ...rule('@media (min-width: 22rem)', {
                gridAutoFlow : 'column',
            }),
            
            
            
            // spacings:
            gap              : 'inherit',
        })
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesSavedCardCardLayout(),
    }, { specificityWeight: 2 }),
];
