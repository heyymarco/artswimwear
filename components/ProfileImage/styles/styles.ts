// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    states,
    children,
    style,
}                           from '@cssfn/core'                      // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borderRadiuses,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
export const usesProfileImageLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars } = usesBorder();
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display                     : 'grid',
            gridTemplate                : [[
                '"image" 1fr',
                '/',
                '1fr',
            ]],
            
            
            
            // sizes:
            aspectRatio                 : '1 / 1',
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
            
            
            
            // children:
            overflow                    : 'hidden',
            ...children('[role="img"]', {
                // sizes:
                inlineSize              : '100%',
                blockSize               : '100%',
                
                
                
                // backgrounds:
                backgroundRepeat        : 'no-repeat',
                backgroundPosition      : 'center',
                backgroundSize          : 'cover',
                
                
                
                // borders:
                borderStartStartRadius  : `calc(${borderVars.borderStartStartRadius} - ${borderVars.borderWidth} - min(${borderVars.borderWidth}, 0.5px))`,
                borderStartEndRadius    : `calc(${borderVars.borderStartEndRadius  } - ${borderVars.borderWidth} - min(${borderVars.borderWidth}, 0.5px))`,
                borderEndStartRadius    : `calc(${borderVars.borderEndStartRadius  } - ${borderVars.borderWidth} - min(${borderVars.borderWidth}, 0.5px))`,
                borderEndEndRadius      : `calc(${borderVars.borderEndEndRadius    } - ${borderVars.borderWidth} - min(${borderVars.borderWidth}, 0.5px))`,
                
                
                
                // children:
                ...children('::after', {
                    // layouts:
                    display                 : 'grid',
                    justifyContent          : 'center', // center the icon horizontally
                    alignContent            : 'center', // center the icon vertically
                }),
            }),
        }),
    });
};

export const usesProfileImageVariants = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // variants:
        
        /* write specific cardStyle first, so it can be overriden by `.nude`, `.mild`, `.outlined`, etc */
        
        ...usesBasicVariants(),
        
        ...variants([
            rule('.circle', {
                // borders:
                [borderVars.borderStartStartRadius] : borderRadiuses.circle,
                [borderVars.borderStartEndRadius  ] : borderRadiuses.circle,
                [borderVars.borderEndStartRadius  ] : borderRadiuses.circle,
                [borderVars.borderEndEndRadius    ] : borderRadiuses.circle,
            }),
            rule('.cornered', {
                // borders:
                [borderVars.borderStartStartRadius] : '0px',
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : '0px',
                [borderVars.borderEndEndRadius    ] : '0px',
            }),
        ]),
    });
};

export const usesProfileImageStates = () => {
    return style({
        // states:
        ...states([
            rule('.hasImage', {
                // children:
                ...children('[role="img"]', {
                    ...children('::after', {
                        opacity : 0, // hide the person icon
                    }),
                }),
            }),
        ]),
    });
};

export default () => style({
    // layouts:
    ...usesProfileImageLayout(),
    
    // variants:
    ...usesProfileImageVariants(),
    
    // states:
    ...usesProfileImageStates(),
});
