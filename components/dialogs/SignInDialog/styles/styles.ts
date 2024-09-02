// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesCardBodyLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    
    
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // children:
        ...children('*', { // <Tab>
            // borders:
            [groupableVars.borderStartStartRadius] : '0px',
            [groupableVars.borderStartEndRadius  ] : '0px',
            [groupableVars.borderEndStartRadius  ] : '0px',
            [groupableVars.borderEndEndRadius    ] : '0px',
        }),
    });
};
const usesSignInUiLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars } = usesBorder();
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // borders:
        [borderVars.borderWidth] : '0px',
        
        
        
        // spacings:
        // cancel-out parent's padding with negative margin:
        marginInline   : `calc(0px - ${paddingVars.paddingInline})`,
        marginBlock    : `calc(0px - ${paddingVars.paddingBlock })`,
    });
};

export default () => [
    scope('dialog', {
        boxSizing     : 'border-box',
        maxInlineSize : `${breakpoints.sm}px`,
        maxBlockSize  : `${breakpoints.sm}px`,
    }, {specificityWeight: 4}),
    scope('cardBody', {
        // layouts:
        ...usesCardBodyLayout(),
    }, {specificityWeight: 2}),
    scope('signInUi', {
        // layouts:
        ...usesSignInUiLayout(),
    }, {specificityWeight: 3}),
];
