// cssfn:
import {
    children,
    descendants,
    rule,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

import {
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    commerces,
}                           from '@/config'



// styles:
const minImageHeight = 200; // 200px
const usesOrderHistoryPreviewLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,       // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,       // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.preview', // select the <Carousel>
    });
    
    // features:
    const {borderRule , borderVars } = usesBorder({ borderWidth: '0px' });
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"preview ... createdAt "', 'auto',
                '"preview ... .........."', spacers.xs,
                '"preview ... orderId   "', 'auto',
                '"preview ... .........."', spacers.md,
                '"preview ... payment   "', 'auto',
                '"preview ... .........."', spacers.md, // the minimum space between payment and fullEditor
                '"preview ... .........."', 'auto',     // the extra rest space (if any) between payment and fullEditor
                '"preview ... fullEditor"', 'auto',
                '/',
                `calc(((${minImageHeight}px + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) - ${paddingVars.paddingInline}) ${spacers.md} 1fr`,
            ]],
            
            
            
            // borders:
            // follows <parent>'s borderRadius
            border                   : borderVars.border,
         // borderRadius             : borderVars.borderRadius,
            borderStartStartRadius   : borderVars.borderStartStartRadius,
            borderStartEndRadius     : borderVars.borderStartEndRadius,
            borderEndStartRadius     : borderVars.borderEndStartRadius,
            borderEndEndRadius       : borderVars.borderEndEndRadius,
            [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...descendants(['.orderId', 'p'], {
                margin: 0,
            }),
            ...descendants('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontSize   : basics.fontSizeSm,
                fontStyle  : 'italic',
            }),
            ...children('.orderId', {
                // positions:
                gridArea   : 'orderId',
                
                
                
                // layouts:
                display    : 'flex',
                flexWrap   : 'wrap',
                alignItems : 'center',
                
                
                
                // spacings:
                gap        : '0.25em',
                
                
                
                // typos:
                fontSize: typos.fontSizeXl,
                
                
                
                // children:
                ...children('.orderStatus', {
                    // typos:
                    fontSize: typos.fontSizeSm,
                }),
            }),
            ...children('.createdAt', {
                gridArea: 'createdAt',
                
                
                
                // typos:
                fontSize: typos.fontSizeSm,
            }),
            ...children('.payment', {
                gridArea: 'payment',
                
                display        : 'flex',
                flexWrap       : 'wrap',
                justifyContent : 'start',
                alignItems     : 'center',
                
                gap : spacers.sm,
                
                ...children('.paymentValue', {
                    display        : 'flex',
                    flexWrap       : 'wrap',
                    justifyContent : 'start',
                    alignItems     : 'center',
                    
                    gap : spacers.sm,
                    
                    ...children('.paymentMethod', {
                        display    : 'flex',
                        flexWrap   : 'wrap',
                        alignItems : 'center',
                        
                        gap : spacers.sm,
                        
                        ...children('.paymentIdentifier', {
                            // typos:
                            fontSize       : typos.fontSizeSm,
                            fontWeight     : typos.fontWeightNormal,
                        }),
                    }),
                }),
            }),
            ...children('.preview', {
                // positions:
                gridArea    : 'preview',
                
                justifySelf : 'stretch', // stretch the self horizontally
                alignSelf   : 'stretch', // stretch the self vertically
                
                
                
                // layouts:
                display: 'grid',
                alignItems: 'start',
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                [borderVars.borderEndEndRadius    ] : '0px',
                
                [borderVars.borderWidth           ] : '0px', // only setup borderRadius, no borderStroke
                borderInlineEndWidth                : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
                
                
                
                // children:
                ...children('.image', {
                    // layouts:
                    ...rule('.noImage', {
                        // layouts:
                        display: 'grid',
                        
                        
                        
                        // spacings:
                        [paddingVars.paddingInline] : '0px',
                        [paddingVars.paddingBlock ] : '0px',
                        
                        
                        
                        // children:
                        ...children('*', {
                            opacity: 0.4,
                            
                            justifySelf : 'center', // center the <Icon>
                            alignSelf   : 'center', // center the <Icon>
                        }),
                    }),
                    
                    
                    
                    // spacings:
                    [paddingVars.paddingInline] : '0px',
                    [paddingVars.paddingBlock ] : '0px',
                    
                    
                    
                    // sizes:
                    boxSizing   : 'border-box',
                    aspectRatio : commerces.defaultProductAspectRatio,
                    
                    
                    
                    // borders:
                    // follows the <ListItem>'s borderRadius, otherwise keeps the 4 edges has borderRadius(es)
                    [borderVars.borderWidth           ] : '0px',
                    
                    [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                    [borderVars.borderStartEndRadius  ] : '0px',
                    [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                    [borderVars.borderEndEndRadius    ] : '0px',
                    
                    
                    
                    // children:
                    // a tweak for marco's <Image>:
                    ...children(['ul>li>.prodImg', '.prodImg'], {
                        inlineSize : '100%', // fills the entire <Carousel> area
                        blockSize  : '100%', // fills the entire <Carousel> area
                    }, { performGrouping: false }), // cannot grouping of different depth `:is(ul>li>.prodImg', .prodImg)`
                    
                    // a tweak for quantity <Badge>:
                    ...children('ul>li', {
                        ...children('.floatingQuantity', {
                            translate: [[
                                `calc(-100% - ${spacers.sm})`,
                                spacers.sm,
                            ]],
                        }),
                    }),
                }),
            }),
            ...children('.floatingSumQuantity', {
                translate: [[
                    `calc(100% + ${spacers.sm})`,
                    spacers.sm,
                ]],
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
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesOrderHistoryPreviewLayout(),
    }, { specificityWeight: 2 }),
];
