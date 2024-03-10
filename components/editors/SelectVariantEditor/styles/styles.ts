// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // reusable-ui configs:
    spacers,
}                           from '@reusable-ui/core'        // a set of reusable-ui packages which are responsible for building any component



// styles:
export default () => [
    scope('item', {
        // layout:
        display : 'grid',
        gridTemplate : [[
            '"indicator name"  auto',
            '/',
            'auto 1fr',
        ]],
        
        
        
        // spacings:
        gap : spacers.sm,
        
        
        
        // children:
        ...children('p', {
            // spacings:
            margin: 0,
        }),
        ...children('.indicator', {
            gridArea : 'indicator',
        }),
        ...children('.name', {
            gridArea : 'name',
        }),
    }),
];
