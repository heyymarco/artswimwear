// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"image  ...." 1fr',
            '"image  name" auto',
            '"image email" auto',
            '"image  ...." 1fr',
            '/',
            '60px 1fr',
        ]],
        alignItems: 'center', // center items vertically
        
        
        
        // spacings:
        gapInline : spacers.default,
        gapBlock  : 0,
        
        
        
        // children:
        ...children('.image', {
            // positions:
            gridArea    : 'image',
        }),
        ...children(['.name', '.email'], {
            overflow     : 'hidden',
            textWrap     : 'nowrap',
            textOverflow : 'ellipsis',
        }),
        ...children('.name', {
            // positions:
            gridArea    : 'name',
            
            
            
            // typos:
            fontSize    : typos.fontSizeMd,
            fontWeight  : typos.fontWeightSemibold,
        }),
        ...children('.email', {
            // positions:
            gridArea    : 'email',
            
            
            
            // typos:
            fontSize    : `calc((${typos.fontSizeSm} + ${typos.fontSizeMd}) / 2)`,
        }),
    });
};

export default () => style({
    // layouts:
    ...usesLayout(),
});
