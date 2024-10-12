// cssfn:
import {
    children,
    descendants,
    rule,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
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
const minImageHeight = 170; // 170px
const usesOrderHistoryPreviewLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,      // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,      // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.images', // select the <Carousel>
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
                '"images ... createdAt "', 'auto',
                '"images ... .........."', spacers.xs,
                '"images ... orderId   "', 'auto',
                '"images ... .........."', spacers.md,
                '"images ... payment   "', 'auto',
                '"images ... .........."', spacers.md, // the minimum space between payment and fullEditor
                '"images ... .........."', '1fr',      // the extra rest space (if any) between payment and fullEditor
                '"images ... fullEditor"', 'auto',
                '/',
                `calc((${minImageHeight}px + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) ${spacers.md} 1fr`,
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
                        
                        ...children('.paymentProvider', {
                            // sizes:
                            width           : 'auto',
                            height          : '16px',
                            
                            
                            
                            // backgrounds:
                            backgroundColor : 'white',
                            
                            
                            
                            // borders:
                            border          : borderVars.border,
                            borderWidth     : borders.defaultWidth,
                            borderRadius    : borderRadiuses.sm,
                            
                            
                            
                            // spacings:
                            padding         : spacers.xs,
                        }),
                        ...children('.paymentIdentifier', {
                            // typos:
                            fontSize       : typos.fontSizeSm,
                            fontWeight     : typos.fontWeightNormal,
                        }),
                    }),
                }),
            }),
            ...children('.images', {
                // layouts:
                gridArea    : 'images',
                
                
                
                // sizes:
                alignSelf   : 'stretch',
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                [borderVars.borderEndEndRadius    ] : '0px',
                [borderVars.borderWidth           ] : '0px', // only setup borderRadius, no borderStroke
                borderInlineEndWidth : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
                
                
                
                // children:
                ...children('ul>li>.prodImg', {
                    inlineSize : '100%',
                    blockSize  : '100%',
                }),
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
