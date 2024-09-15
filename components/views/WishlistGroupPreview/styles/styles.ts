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
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"name      "', 'auto',
                '".........."', spacers.md, // the minimum space between name and fullEditor
                '".........."', '1fr',      // the extra rest space (if any) between name and fullEditor
                '"fullEditor"', 'auto',
                '/',
                `${spacers.md} 1fr`,
            ]],
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...children('.name', {
                // positions:
                gridArea   : 'name',
                
                
                
                // layouts:
                display    : 'flex',
                flexWrap   : 'wrap',
                alignItems : 'center',
                
                
                
                // spacings:
                gap        : '0.25em',
                
                
                
                // typos:
                fontSize: typos.fontSizeXl,
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
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
