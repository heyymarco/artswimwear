// cssfn:
import {
    children,
    descendants,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesWishlistGroupPreviewLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // features:
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : spacers.sm,
        paddingBlock  : spacers.sm,
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"radio name edit"', '1fr',
                '/',
                'min-content 1fr min-content',
            ]],
            
            
            
            // spacings:
            gap           : spacers.sm,
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...children('.radio', {
                // positions:
                gridArea   : 'radio',
            }),
            ...children('.name', {
                // positions:
                gridArea   : 'name',
            }),
            ...children('.edit', {
                gridArea: 'edit',
            }),
            ...descendants('[role="dialog"]', {
                // remove the padding of <Dialog>'s backdrop:
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        
        
        
        // features:
        ...paddingRule(), // must be placed at the last
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesWishlistGroupPreviewLayout(),
    }, { specificityWeight: 2 }),
];
