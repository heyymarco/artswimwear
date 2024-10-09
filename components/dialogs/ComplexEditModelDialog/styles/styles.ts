// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    vars,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript
import {
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    containers,
    lists,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const usesCardBodyLayout  = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display           : 'flex',
            flexDirection     : 'column',
            justifyContent    : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems        : 'stretch',     // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
            flexWrap          : 'nowrap',      // no wrapping
            
            
            
            // sizes:
            // the default <Card>'s body height is resizeable, ensuring footers are aligned to the bottom:
            flex              : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width (for variant `.inline`) or height (for variant `.block`)
            
            boxSizing         : 'border-box',
            minInlineSize     : `calc(100vw - (${containers.paddingInline} * 2))`,
            ...ifScreenWidthAtLeast('md', {
                minInlineSize : `${breakpoints.sm}px`,
            }),
            
            
            
            // scrolls:
            ...rule('.tabs', {
                overflow   : 'hidden', // force <TabBody> to scroll
            }),
            
            
            
            // borders:
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            [borderVars.borderEndStartRadius  ] : '0px',
            [borderVars.borderEndEndRadius    ] : '0px',
            
            
            
            // typos:
            ...rule('.noData', {
                textAlign : 'center',
            }),
            
            
            
            // children:
            ...rule('.noData', {
                ...children('button', {
                    alignSelf: 'center',
                }),
            }),
        }),
    });
};

export const usesTabListLayout   = () => {
    return style({
        // layouts:
        ...style({
            // positions:
            zIndex: 1, // a draggable fix for Chrome
        }),
        
        
        
        // configs:
        ...vars({
            [lists.borderRadius] : '0px',
        }),
    });
};
export const usesTabBodyLayout   = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // borders:
        [borderVars.borderWidth]: '0px',
    });
};
export const usesTabDeleteLayout = () => {
    return style({
        // layout:
        display      : 'grid',
        justifyItems : 'center',  // default center the items horizontally
        alignItems   : 'center',  // default center the items vertically
        
        
        
        // borders:
        borderWidth  : 0,
        borderRadius : 0,
    });
};

export default () => [
    scope('cardBody', {
        ...usesCardBodyLayout(),
    }, { specificityWeight: 3 }),
    
    scope('tabList', {
        ...usesTabListLayout(),
    }, { specificityWeight: 2 }),
    scope('tabBody', {
        ...usesTabBodyLayout(),
    }, { specificityWeight: 2 }),
    scope('tabDelete', {
        ...usesTabDeleteLayout(),
    }, { specificityWeight: 2 }),
];