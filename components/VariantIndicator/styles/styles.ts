// cssfn:
import {
    // writes css in javascript:
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesVariantIndicatorLayout = () => {
    return style({
        // layouts:
        display       : 'inline-block',
        
        
        
        // sizes:
        maxInlineSize : '10ch',
        
        
        
        // scrolls:
        overflow      : 'hidden',
        
        
        
        // spacings:
        padding       : spacers.xs,
        
        
        
        // typos:
        lineHeight    : 1,
        whiteSpace    : 'nowrap',
        overflowWrap  : 'normal',
        textOverflow  : 'ellipsis',
    });
};

export default () => style({
    // layouts:
    ...usesVariantIndicatorLayout(),
});
