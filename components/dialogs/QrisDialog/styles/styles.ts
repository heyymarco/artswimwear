// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const usesCardBodyLayout  = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display           : 'grid',
            justifyItems      : 'center',
            alignItems        : 'center',
            
            
            
            // sizes:
            boxSizing         : 'border-box',
            inlineSize        : `calc(100svw - (${containers.paddingInline} * 2))`,
            ...ifScreenWidthAtLeast('md', {
                inlineSize    : `calc(${breakpoints.sm}px / 2)`,
            }),
            aspectRatio       : 1,
            // blockSize         : `calc(100svh - (${containers.paddingBlock} * 2))`,
            // ...ifScreenWidthAtLeast('md', {
            //     blockSize     : `calc(${breakpoints.sm}px / 2)`,
            // }),
            // blockSize         : `calc(${breakpoints.sm}px / 2)`,
            overflow          : 'visible', // important to force remove scrollbar
            
            
            
            // backgrounds:
            backgroundColor   : '#ffffff',
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
            
            
            
            // children:
            ...children('*', {
                gridArea: '1 / 1 / -1 / -1',
            }),
        }),
    });
};

export const usesLoadingLayout   = () => {
    return style({
        // positions:
        gridArea: '1 / 1 / -1 / -1',
        
        
        
        // typos:
        fontSize: '3rem',
    });
};
export const usesErrorLayout     = () => {
    // dependencies:
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    
    
    return style({
        // positions:
        gridArea: '1 / 1 / -1 / -1',
        
        
        
        // sizes:
        justifySelf  : 'stretch',
        alignSelf    : 'stretch',
        
        
        
        // spacings:
        [groupableVars.paddingInline]: 'inherit !important',
        [groupableVars.paddingBlock ]: 'inherit !important',
        marginInline : `calc(0px - ${groupableVars.paddingInline})`,
        marginBlock  : `calc(0px - ${groupableVars.paddingBlock })`,
    });
};
export const usesCountDownLayout = () => {
    return style({
        gridArea: '-2 / 1 / -2 / -1',
        marginBlockStart: spacers.sm,
        lineHeight: 1,
    });
}
export const usesQrisLayout   = () => {
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // sizes:
        justifySelf  : 'stretch',
        alignSelf    : 'stretch',
    });
};

export default () => [
    scope('cardBody', {
        ...usesCardBodyLayout(),
    }, { specificityWeight: 3 }),
    
    scope('loading', {
        ...usesLoadingLayout(),
    }),
    scope('error', {
        ...usesErrorLayout(),
    }, {specificityWeight: 2}),
    scope('countDown', {
        ...usesCountDownLayout(),
    }, {specificityWeight: 4}),
    scope('qris', {
        ...usesQrisLayout(),
    }),
];