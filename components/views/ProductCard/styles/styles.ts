// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'              // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // a border (stroke) management system:
    borderRadiuses,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// configs:
import {
    commerces,
}                           from '@/config'



// defaults:
const usesProductCardLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule, borderVars} = usesBorder({
        borderRadius : borderRadiuses.md,
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display       : 'grid',
            gridTemplate  : [[
                '"prodImg" 1fr',
                '"header " max-content',
                '/',
                '1fr',
            ]],
            
            
            
            // sizes:
            contain: 'layout', // prevents the <Gallery> having scrollbar when the <ProductCard> having overflowed children
            
            
            
            // spacings:
            padding: 0,
            
            
            
            // animations:
            transition : [
                ['box-shadow', '300ms'],
            ],
            boxShadow  : '0px 0px 1rem rgba(0, 0, 0, 0.1)',
            ...rule(':hover:not(.empty)', {
                boxShadow : '0px 0px 1rem rgba(0, 0, 0, 0.7)',
            }),
            
            ...children('.prodImg', {
                ...children(['img', '.status'], {
                    transition : [
                        ['scale', '300ms'],
                    ],
                }),
            }),
            ...rule(':hover:not(.empty)', {
                ...children('.prodImg', {
                    ...children(['img', '.status'], {
                        // WARNING: causes weird scrolling in Chrome:
                        scale: '105%',
                    }),
                }),
                ...children('header', {
                    ...children(['.name', '.price'], { // handles long text
                        ...children('.longText', {
                            // scrolls:
                            // WARNING: causes weird scrolling in Chrome:
                            overflow: 'visible',
                            
                            
                            
                            // backgrounds:
                            background: typos.backg,
                        }),
                    }),
                }),
                
                
                
                // WARNING: causes weird scrolling in Chrome:
                zIndex: globalStacks.tooltip, // handles long text to be top_most when hovered
            }),
            
            position : 'relative',
            ...children('a', {
                // positions:
                gridArea: '1 / 1 / -1 / -1', // fill the entire <article>
            }),
            
            
            
            // borders:
            border                 : borderVars.border,
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            
            
            
            // children:
            ...children(['.prodImg', '.header'], {
                // accessibilities:
                pointerEvents : 'none', // makes the <a> behind this element clickable
            }),
            ...children('.prodImg', {
                // positions:
                gridArea: 'prodImg',
                
                
                
                // sizes:
                // minInlineSize  : `${minImageSize}px`,
                // minBlockSize   : `${minImageHeight}px`,
                boxSizing   : 'content-box',
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
                // scrolls:
                overflow    : 'hidden',
                
                
                
                // backgrounds:
                background  : 'white',
                
                
                
                // borders:
                [borderVars.borderStartStartRadius] : ['inherit', '!important'],
                [borderVars.borderStartEndRadius  ] : ['inherit', '!important'],
                
                
                
                // children:
                ...children('img', {
                    // sizes:
                    width  : '100% !important',
                    height : '100% !important',
                }),
            }),
            ...children('.header', {
                // positions:
                gridArea: 'header',
                
                
                
                // layouts:
                display       : 'grid',
                gridTemplate : [[
                    '"name name  name" auto',
                    '"more wish price" auto',
                    '/',
                    'min-content min-content 1fr',
                ]],
                alignItems: 'center', // center vertically
                
                
                
                // sizes:
                contain: 'inline-size', // prevents the <ProductCard> to resize when the <header> having overflowed children
                
                
                
                // spacings:
                padding : '0.75rem',
                gapBlock  : spacers.sm,
                
                
                
                // children:
                ...children(['.name', '.price'], { // handles long text
                    // layouts:
                    display: 'grid',
                    
                    
                    
                    // sizes:
                    minBlockSize: '1.03lh',
                    
                    
                    
                    // spacings:
                    margin: 0,
                    
                    
                    
                    // children:
                    ...children('.longText', {
                        // scrolls:
                        overflow     : 'hidden',
                        
                        
                        
                        // sizes:
                        blockSize : '1.03lh', // a fix for Chrome's unintended cropped text
                        
                        
                        
                        // animations:
                        transition : [
                            ['background', '300ms'],
                        ],
                        
                        
                        
                        // typos:
                        whiteSpace   : 'nowrap',
                        textOverflow : 'ellipsis',
                    }),
                }),
                ...children('.name', {
                    // positions:
                    gridArea    : 'name',
                    justifySelf : 'start',
                }),
                ...children('.price', {
                    // positions:
                    gridArea    : 'price',
                    justifySelf : 'end',
                }),
                ...children('.wish', {
                    // positions:
                    gridArea: 'wish',
                    
                    
                    
                    // accessibilities:
                    pointerEvents: 'auto', // makes the wish clickable above the <a>
                }),
                ...children('.more', {
                    // positions:
                    gridArea: 'more',
                    
                    
                    
                    // accessibilities:
                    pointerEvents: 'auto', // makes the wish clickable above the <a>
                    
                    
                    
                    // spacings:
                    marginInlineEnd : spacers.sm,
                }),
            }),
        }),
        
        
        
        // features:
        ...borderRule(), // must be placed at the last
    });
};
const usesEmptyProductCardLayout = () => {
    return style({
        // borders:
        border: 'none',
        
        
        
        // children:
        ...children('.prodImg', {
            // appearances:
            visibility: 'hidden',
        }),
        ...children('.emptyMessage', {
            // positions:
            gridArea: '1 / 1 / -1 / -1',
            
            
            
            // layouts:
            display: 'grid',
            justifyContent: 'center',
            alignContent: 'center',
            
            
            
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
        ...usesProductCardLayout(),
    }, { specificityWeight: 2 }),
    scope('empty', {
        // layouts:
        ...usesEmptyProductCardLayout(),
    }, { specificityWeight: 2 }),
];
