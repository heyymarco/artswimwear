// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    
    
    
    // a typography management system:
    headings,
    usesHeadingRule,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export default () => [
    scope('cardHeader', {
        // layouts:
        display        : 'flex',
        flexWrap       : 'wrap',
        justifyContent : 'space-between', // separates between items as far as possible
        alignItems     : 'center',        // center <Control> vertically
        
        
        
        // spacings:
        gapInline      : spacers.lg,
        gapBlock       : spacers.md,
        
        
        
        // children:
        ...children('h1', {
            ...usesHeadingRule(headings, '&', '&', [6]),
            ...rule(':nth-child(n)', {
                margin : '0px',
            }),
        }),
    }, { specificityWeight: 3 }),
    scope('cardBody', {
        // layouts:
        display : 'grid',
        
        
        
        // sizes:
        boxSizing         : 'border-box',
        minInlineSize     : `calc(100vw - (${containers.paddingInline} * 2))`,
        ...ifScreenWidthAtLeast('md', {
            minInlineSize : `${breakpoints.sm}px`,
        }),
    }, { specificityWeight: 3 }),
];