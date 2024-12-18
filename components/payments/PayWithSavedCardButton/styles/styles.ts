// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
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
        containerType  : 'inline-size',
        display        : 'inline-grid',
        gridTemplate   : [[
            '"content" 1fr',
            '/',
            '1fr',
        ]],
    });
};
const usesResponsiveLayout = () => {
    return style({
        // positions:
        gridArea       : 'content',
        
        
        
        // layouts:
        display        : 'grid',
        gridTemplate   : [[
            '"labelGroup" auto',
            '"cardGroup " auto',
            '/',
            'auto',
        ]],
        ...rule('@container (min-width: 16rem)', {
            gridTemplate   : [[
                '"labelGroup cardGroup" auto',
                '/',
                'max-content auto',
            ]],
        }),
        justifyContent : 'center', // center the whole contents horizontally
        alignItems     : 'center',
        
        
        
        // spacings:
        gap            : spacers.sm,
        
        
        
        // children:
        ...children(['.labelGroup', '.cardGroup'], {
            // layouts:
            display      : 'grid',
            gridAutoFlow : 'column',
            justifyContent : 'center', // center the whole contents horizontally
            alignItems   : 'center',
            
            
            
            // spacings:
            gap          : spacers.sm,
        }),
        ...children('.labelGroup', {
            gridArea     : 'labelGroup',
        }),
        ...children('.cardGroup', {
            gridArea     : 'cardGroup',
        }),
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesPayWithSavedCardButtonLayout(),
    }, { specificityWeight: 2 }),
    scope('responsive', {
        // layouts:
        ...usesResponsiveLayout(),
    }),
];
