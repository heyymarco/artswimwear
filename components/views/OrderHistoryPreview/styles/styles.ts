// cssfn:
import {
    children,
    descendants,
    rule,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript
import { basics } from '@reusable-ui/components';
import { typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';
import { commerces } from '@/config';



// styles:
const imageSize = 128;  // 128px
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
                '"images orderId   "', 'auto',
                '/',
                `calc(${imageSize}px - ${paddingVars.paddingInline}) 1fr`,
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
            
            gapInline     : '1rem',
            gapBlock      : '0.5rem',
            
            
            
            // children:
            ...descendants(['.orderId', 'p'], {
                margin: 0,
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
