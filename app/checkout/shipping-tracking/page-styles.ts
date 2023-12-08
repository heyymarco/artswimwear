// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    ifScreenWidthBetween,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
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
    
    
    
    // base-content-components:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesTitleColor = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    
    
    
    return style({
        // layouts:
        ...style({
            // accessibilities:
            ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                // backgrounds:
                backg     : backgroundVars.altBackgColor,
                
                
                
                // foregrounds:
                foreg     : foregroundVars.altForeg,
            }),
            
            
            
            // foregrounds:
            foreg     : backgroundVars.altBackgColor,
        }),
        
        
        
        // features:
        ...backgroundRule(), // must be placed at the last
        ...foregroundRule(), // must be placed at the last
    });
};
const usesTitleLayout = () => {
    return style({
        // appearances:
        ...usesTitleColor(),
        
        
        
        // spacings:
        // margin    : '0px', // kill <h1> auto margin
        
        
        
        // typos:
        textAlign : 'center',
    });
};

const usesShippingTrackingLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    const {foregroundVars} = usesForeground();
    const {borderVars    } = usesBorder();
    
    
    
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // spacings:
        gap     : spacers.default,
        
        
        
        // children:
        ...children('.title', {
            // layouts:
            ...usesTitleLayout(),
        }),
        ...children('table', {
            // positions:
            justifySelf    : 'center',
            
            
            
            // layouts:
            borderCollapse : 'separate',
            borderSpacing  : 0,
            tableLayout    : 'auto',
            
            
            
            // sizes:
            // width          : '100%', // block like layout
            
            
            
            // children:
            ...children(['thead', 'tbody'], {
                // border strokes & radiuses:
                ...children('tr', {
                    ...children(['th', 'td'], {
                        ...rule(':first-child', {
                            borderInlineStart              : borderVars.border,
                            borderInlineStartWidth         : borders.defaultWidth,
                        }),
                        ...rule(':last-child', {
                            borderInlineEnd                : borderVars.border,
                            borderInlineEndWidth           : borders.defaultWidth,
                        }),
                    }),
                }),
                ...rule(':first-child', {
                    ...children('tr', {
                        ...rule(':first-child', {
                            ...children(['th', 'td'], {
                                borderBlockStart           : borderVars.border,
                                borderBlockStartWidth      : borders.defaultWidth,
                                
                                
                                
                                ...rule(':first-child', {
                                    borderStartStartRadius : borderRadiuses.default,
                                }),
                                ...rule(':last-child', {
                                    borderStartEndRadius   : borderRadiuses.default,
                                }),
                            }),
                        }),
                    }),
                }),
                ...rule(':last-child', {
                    ...children('tr', {
                        ...rule(':last-child', {
                            ...children(['th', 'td'], {
                                borderBlockEnd             : borderVars.border,
                                borderBlockEndWidth        : borders.defaultWidth,
                                
                                
                                
                                ...rule(':first-child', {
                                    borderEndStartRadius   : borderRadiuses.default,
                                }),
                                ...rule(':last-child', {
                                    borderEndEndRadius     : borderRadiuses.default,
                                }),
                            }),
                        }),
                    }),
                }),
                
                
                
                // border separators:
                ...children('tr', { // border as separator between row(s)
                    ...rule(':not(:last-child)', {
                        ...children(['th', 'td'], {
                            borderBlockEnd      : borderVars.border,
                            borderBlockEndWidth : borders.defaultWidth,
                        }),
                    }),
                }),
                ...rule(':not(:last-child)', { // border as separator between thead|tbody
                    ...children('tr', {
                        ...rule(':last-child', {
                            ...children(['th', 'td'], {
                                borderBlockEnd      : borderVars.border,
                                borderBlockEndWidth : borders.defaultWidth,
                            }),
                        }),
                    }),
                }),
                
                
                
                // children:
                ...children('tr', {
                    // children:
                    ...children(['th', 'td'], { // spacing for all cells
                        // spacings:
                        padding        : '0.75rem',
                    }),
                    ...children('th', { // default title formatting
                        // typos:
                        fontWeight     : typos.fontWeightSemibold,
                        textAlign      : 'center', // center the title horizontally
                    }),
                    ...children('td', { // default data formatting
                        // typos:
                        wordBreak      : 'break-word',
                        overflowWrap   : 'anywhere', // break long text like email
                    }),
                }),
            }),
            ...children('thead', {
                ...children('tr', {
                    ...children('th', { // special theme color for header's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.backgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.foreg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.altBackgColor,
                        
                        
                        
                        // foregrounds:
                        color     : foregroundVars.altForeg,
                    }),
                }),
            }),
            ...children('tbody', {
                // conditional border strokes & radiuses:
                ...ifScreenWidthSmallerThan('sm', {
                    ...children('tr', {
                        ...children(['th', 'td'], {
                            borderInline      : borderVars.border,
                            borderInlineWidth : borders.defaultWidth,
                        }),
                    }),
                    ...rule(':first-child', {
                        ...children('tr', {
                            ...rule(':first-child', {
                                ...children(['th', 'td'], {
                                    ...rule(':not(:first-child)', {
                                        borderBlockStartWidth  : 0, // kill the separator
                                        
                                        borderStartStartRadius : 0,
                                        borderStartEndRadius   : 0,
                                    }),
                                    ...rule(':first-child', {
                                        borderStartStartRadius : borderRadiuses.default,
                                        borderStartEndRadius   : borderRadiuses.default,
                                    }),
                                }),
                            }),
                        }),
                    }),
                    ...rule(':last-child', {
                        ...children('tr', {
                            ...rule(':last-child', {
                                ...children(['th', 'td'], {
                                    ...rule(':not(:last-child)', {
                                        borderEndStartRadius   : 0,
                                        borderEndEndRadius     : 0,
                                    }),
                                    ...rule(':last-child', {
                                        borderEndStartRadius   : borderRadiuses.default,
                                        borderEndEndRadius     : borderRadiuses.default,
                                    }),
                                }),
                            }),
                        }),
                    }),
                }),
                
                
                
                // conditional border separators:
                ...ifScreenWidthSmallerThan('sm', {
                    ...children('tr', {
                        ...rule(':nth-child(n)', { // increase specificity
                            ...children(['th', 'td'], {
                                ...rule(':not(:last-child)', {
                                    borderBlockEnd : 0,
                                }),
                            }),
                        }),
                    }),
                }),
                
                
                
                // children:
                ...children('tr', {
                    // layouts:
                    // the table cells is set to 'grid'|'block', causing the table structure broken,
                    // to fix this we set the table row to flex:
                    display               : 'flex',
                    
                    flexDirection         : 'column',
                    justifyContent        : 'start',   // top_most the items vertically
                    alignItems            : 'stretch', // stretch  the items horizontally
                    ...ifScreenWidthAtLeast('sm', {
                        flexDirection     : 'row',
                        // justifyContent : 'start',   // top_most the items horizontally
                        // alignItems     : 'stretch', // stretch  the items vertically
                    }),
                    
                    flexWrap              : 'nowrap',  // no wrapping
                    
                    
                    
                    // children:
                    ...children(['th', 'td'], { // special theme color for body's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.altBackgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.altForeg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.backgColor,
                        
                        
                        
                        // foregrounds:
                        color     : foregroundVars.foreg,
                    }),
                    ...children('th', { // special title formatting
                        // layouts:
                        display            : 'grid',
                        
                        justifyContent     : 'center',  // center     the items horizontally
                        ...ifScreenWidthAtLeast('sm', {
                            justifyContent : 'end',     // right_most the items horizontally
                        }),
                        
                        alignContent       : 'center',  // center     the items vertically
                        
                        
                        
                        // sizes:
                        ...ifScreenWidthAtLeast('sm', {
                            // fixed size accross table(s), simulating subgrid:
                            boxSizing      : 'content-box',
                            inlineSize     : '13em', // a fixed size by try n error
                            flex           : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
                        }),
                    }),
                    ...children('td', { // special data formatting
                        // sizes:
                        
                        // fill the remaining width for data cells:
                        ...rule(':nth-child(2)', {
                            flex       : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width
                        }),
                        
                        // fixed width of Edit cells:
                        ...rule(':nth-child(3)', {
                            flex       : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
                        }),
                        
                        
                        
                        // special layouts:
                        ...rule(':nth-child(2)', {
                            textAlign : 'center',
                            ...ifScreenWidthAtLeast('sm', {
                                textAlign : 'start',
                            }),
                        }),
                        ...rule(':nth-child(3)', { // Edit cells:
                            // layouts:
                            display        : 'grid',
                            justifyContent : 'center', // center the items vertically
                        }),
                        ...rule(['.customerAccount', '.shippingMethod', '.paymentMethod'], {
                            // layouts:
                            display            : 'grid',
                            
                            justifyContent     : 'center', // center    the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'start',  // left_most the items horizontally
                            }),
                            
                            alignItems         : 'center', // center    the each item vertically
                            justifyItems       : 'center', // center    the each item horizontally
                            
                            gridAutoFlow       : 'row',
                            ...ifScreenWidthAtLeast('sm', {
                                gridAutoFlow   : 'column',
                            }),
                            
                            
                            
                            // spacings:
                            gap                : spacers.sm,
                            
                            
                            
                            // children:
                            ...children('.paymentProvider', {
                                // sizes:
                                width          : '42px',
                                height         : 'auto',
                                
                                
                                
                                // borders:
                                border         : borderVars.border,
                                borderWidth    : borders.defaultWidth,
                                borderRadius   : borderRadiuses.sm,
                            }),
                            ...children(['.customerName', '.shippingEstimate', '.paymentIdentifier'], {
                                // typos:
                                fontSize       : typos.fontSizeSm,
                                fontWeight     : typos.fontWeightNormal,
                            }),
                        }),
                    }),
                }),
            }),
        }),
    });
};



export default () => [
    scope('main', {
        // layouts:
        display      : 'grid',
        
        
        
        // scrolls:
        overflow: 'hidden', // workaround for overflowing popup
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    }),
    scope('shippingTracking', {
        ...usesShippingTrackingLayout(),
    }),
];
