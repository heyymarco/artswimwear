// cssfn:
import {
    // writes css in javascript:
    rule,
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
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesHiddenableLayout  = () => {
    return style({
        // appearances:
        ...rule('.hidden', {
            opacity    : 0,
        }),
        
        
        
        // accessibilities:
        ...rule('.hidden', {
            pointerEvents : 'none', // prevents user interaction
        }),
        
        
        
        // animations:
        transition : [
            // appearances:
            ['opacity' , basics.defaultAnimationDuration, 'ease-out'],
        ],
    });
};



export const usesMainLayout  = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule} = usesGroupable();
    
    // features:
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : spacers.default,
        paddingBlock  : spacers.default,
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display      : 'grid',
            justifyItems : 'center',
            alignItems   : 'center',
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...children('*', {
                gridArea: '1 / 1 / -1 / -1',
            }),
        }),
        
        
        
        // features:
        ...paddingRule(), // must be placed at the last
    });
};

export const usesExpressCheckoutLayout = () => {
    return style({
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            
            
            
            // sizes:
            justifySelf  : 'stretch',
            alignSelf    : 'stretch',
        }),
        
        
        
        // states:
        ...usesHiddenableLayout(),
    });
};

export const usesLoadingLayout   = () => {
    return style({
        // positions:
        zIndex   : 99,
        
        
        
        // typos:
        fontSize : '2rem',
    });
};
export const usesErrorLayout     = () => {
    // dependencies:
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    // features:
    const {borderVars} = usesBorder();
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        ...style({
            // positions:
            zIndex       : 99,
            
            
            
            // sizes:
            justifySelf  : 'stretch',
            alignSelf    : 'stretch',
            
            
            
            // borders:
            
            // kill borders surrounding List:
            [borderVars.borderWidth           ] : '0px',
            
            // remove rounded corners on top:
            [borderVars.borderStartStartRadius] : '0px',
            [borderVars.borderStartEndRadius  ] : '0px',
            // remove rounded corners on bottom:
            [borderVars.borderEndStartRadius  ] : '0px',
            [borderVars.borderEndEndRadius    ] : '0px',
            
            
            
            // spacings:
            [groupableVars.paddingInline]: 'inherit !important',
            [groupableVars.paddingBlock ]: 'inherit !important',
            marginInline : `calc(0px - ${groupableVars.paddingInline})`,
            marginBlock  : `calc(0px - ${groupableVars.paddingBlock })`,
            
            [paddingVars.paddingInline] : groupableVars.paddingInline,
            [paddingVars.paddingBlock ] : groupableVars.paddingBlock,
            ...children('article', {
                [paddingVars.paddingInline] : groupableVars.paddingInline,
                [paddingVars.paddingBlock ] : groupableVars.paddingBlock,
            }),
            
            
            
            // typos:
            textAlign : 'center',
        }),
        
        
        
        // states:
        ...usesHiddenableLayout(),
    });
};
export const usesNotAvailableLayout = () => {
    return style({
        // layouts:
        ...style({
            // positions:
            zIndex : 99,
            
            
            
            // spacings:
            margin : 0,
        }),
        
        
        
        // states:
        ...usesHiddenableLayout(),
    });
}

export default () => [
    scope('main', {
        ...usesMainLayout(),
    }, { specificityWeight: 3 }),
    
    scope('expressCheckout', {
        ...usesExpressCheckoutLayout(),
    }),
    
    scope('loading', {
        ...usesLoadingLayout(),
    }),
    scope('error', {
        ...usesErrorLayout(),
    }, { specificityWeight: 2 }),
    scope('notAvailable', {
        ...usesNotAvailableLayout(),
    }),
];