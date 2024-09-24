// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
export default () => [
    scope('collectionTab', {
        // layout:
        display      : 'grid',
        alignContent : 'start',
        gridTemplate : [[
            '"name-label      "', 'auto',
            '"name-editor     "', 'auto',
            '/',
            '1fr'
        ]],
        
        
        
        // spacings:
        gapInline    : spacers.md,
        gapBlock     : spacers.xs,
        
        
        
        // children:
        ...children('.name.label' , { gridArea: 'name-label'  }),
        ...children('.name.editor', { gridArea: 'name-editor' }),
    }),
    scope('deleteTab', {
        // layout:
        display : 'grid',
        
        
        
        // spacings:
        gap : spacers.sm,
    }),
];
