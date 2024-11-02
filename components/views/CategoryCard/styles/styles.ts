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
const minImageHeight = 50; // 50px
const usesCategoryCardLayout = () => { // the <ListItem> of category list
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
        paddingInline : spacers.sm,
        paddingBlock  : spacers.sm,
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
                '"preview ... name arrow"', 'auto',
                '/',
                `calc(((${minImageHeight}px + (2 * ${paddingVars.paddingBlock})) * ${commerces.defaultProductAspectRatio}) - ${paddingVars.paddingInline}) ${paddingVars.paddingInline} 1fr min-content`,
            ]],
            alignItems: 'center',
            
            
            
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
            ...descendants(['.name', 'p'], {
                margin: 0,
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
                /*
                    :is(.flat, .joined) >   *  > .wh287.wh287 > .preview
                        <ul>     <li>   &&&&&&&&&&&&&&&&&&&&&&&
                */
                ...rule([':is(.flat, .joined)>:is(li, [role="listitem"])>&', ':is(.flat, .joined)>[role="presentation"]>:is(li, [role="listitem"])>&'], {
                    borderInlineEndWidth: '0px',
                }),
                
                
                
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
            ...children('.name', {
                // positions:
                gridArea: 'name',
                
                
                
                // layout:
                display: 'grid',
                justifyItems: 'start',
                alignItems: 'center',
                
                
                
                // typos:
                fontSize: typos.fontSizeLg,
            }),
            ...children('.arrow', {
                // positions:
                gridArea: 'arrow',
                
                
                
                // spacings:
                marginInlineStart : spacers.md,
            }),
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};
const usesVoidCategoryCardLayout = () => {
    return style({
        // appearances:
        visibility: 'hidden',
    });
};
const usesEmptyCategoryCardLayout = () => {
    return style({
        // children:
        ...children('.preview', {
            // appearances:
            visibility: 'hidden',
        }),
        ...children('.emptyMessage', {
            // positions:
            gridArea: '1 / 1 / -1 / -1',
            
            
            
            // spacings:
            margin: 0,
            
            
            
            // typos:
            textAlign: 'center',
        }),
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesCategoryCardLayout(),
    }, { specificityWeight: 2 }),
    scope('void', {
        // layouts:
        ...usesVoidCategoryCardLayout(),
    }),
    scope('empty', {
        // layouts:
        ...usesEmptyCategoryCardLayout(),
    }),
];
