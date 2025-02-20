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
    
    
    
    // a border (stroke) management system:
    borderRadiuses,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    globalStacks,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// configs:
import {
    commerces,
}                           from '@/config'



// styles:
const usesWishGroupImageLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    const {borderRule, borderVars} = usesBorder({
        borderRadius : borderRadiuses.md,
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display       : 'grid',
            gridTemplate  : [[
                '"images" 1fr',
                '"header " max-content',
                '/',
                '1fr',
            ]],
            
            
            
            // sizes:
            contain       : 'inline-size', // prevents the <Gallery> having scrollbar when the <ProductCard> having overflowed children
            
            
            
            // spacings:
            padding: 0,
            
            
            
            // animations:
            ...rule(':not(.add)', {
                transition : [
                    ['box-shadow', '300ms'],
                ],
                boxShadow  : '0px 0px 1rem rgba(0, 0, 0, 0.1)',
                ...rule(':hover', {
                    boxShadow : '0px 0px 1rem rgba(0, 0, 0, 0.7)',
                }),
            }),
            
            ...children('.images', {
                ...rule('.noImage', {
                    ...children('*', {
                        transition : [
                            ['scale', '300ms'],
                        ],
                    }),
                }),
                ...rule(':not(.noImage)', {
                    ...children('*', {
                        ...children(['img', '.status'], {
                            transition : [
                                ['scale', '300ms'],
                            ],
                        }),
                    }),
                }),
            }),
            ...rule(':hover', {
                ...children('.images', {
                    ...rule('.noImage', {
                        ...children('*', {
                            // WARNING: causes weird scrolling in Chrome:
                            scale: '105%',
                        }),
                    }),
                    ...rule(':not(.noImage)', {
                        ...children('*', {
                            ...children(['img', '.status'], {
                                // WARNING: causes weird scrolling in Chrome:
                                scale: '105%',
                            }),
                        }),
                    }),
                }),
                ...children('header', {
                    ...children('.name', { // handles long text
                        ...children('.longText', {
                            // scrolls:
                            // WARNING: causes weird scrolling in Chrome:
                            overflow: 'visible',
                            
                            
                            
                            // backgrounds:
                            background: backgroundVars.backg,
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
            ...children(['.images', '.header'], {
                // accessibilities:
                pointerEvents : 'none', // makes the <a> behind this element clickable
            }),
            ...children('.images', {
                // positions:
                gridArea  : 'images',
                
                
                
                // sizes:
                boxSizing   : 'content-box',
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
                ...rule('.noImage', {
                    // layouts:
                    display      : 'grid',
                    justifyItems : 'center',
                    alignItems   : 'center',
                }),
                ...rule(':not(.noImage)', {
                    // layouts:
                    display             : 'grid',
                    gridAutoRows        : '1fr',
                    gridTemplateColumns : '1fr 1fr',
                    ...rule(':has(>:nth-child(3)):not(:has(>:nth-child(4)))', { // only having 3 images (not having 4rd image)
                        ...children(':nth-child(3)', {
                            translate : '50% 0',
                        }),
                    }),
                    ...rule(':has(>:nth-child(2)):not(:has(>:nth-child(3)))', { // only having 2 images (not having 3rd image)
                        ...children(':nth-child(1)', {
                            translate : '0 25%',
                        }),
                        ...children(':nth-child(2)', {
                            translate : '0 75%',
                        }),
                        ...children(':nth-child(n)', {
                            // prevent the height taking 100% of parent height:
                            boxSizing   : 'border-box',
                            aspectRatio : commerces.defaultProductAspectRatio, // it's ok to be slightly inaccurate: the aspectRatio is slightly different than the `.images` due to `gap`
                        }),
                    }),
                    ...rule(':has(>:nth-child(1)):not(:has(>:nth-child(2)))', { // only having 1 image  (not having 2nd image)
                        gridTemplateColumns : '1fr',
                    }),
                    
                    
                    
                    // borders:
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    overflow               : 'hidden',
                    
                    
                    
                    // spacings:
                    gap : spacers.xs,
                    
                    
                    
                    // children:
                    ...children('*', {
                        // sizes:
                        // minInlineSize  : `${minImageSize}px`,
                        // minBlockSize   : `${minImageHeight}px`,
                        // boxSizing   : 'border-box',
                        // aspectRatio : commerces.defaultProductAspectRatio, // the aspectRatio is slightly different than the `.images` due to `gap`
                        
                        
                        
                        // scrolls:
                        overflow    : 'hidden',
                        
                        
                        
                        // backgrounds:
                        background  : 'white',
                        
                        
                        
                        // children:
                        ...children('img', {
                            // sizes:
                            width  : '100% !important',
                            height : '100% !important',
                        }),
                    }),
                }),
            }),
            ...children('.header', {
                // positions:
                gridArea: 'header',
                
                
                
                // layouts:
                display       : 'grid',
                gridTemplate : [[
                    '"name  name" auto',
                    '"more count" auto',
                    '/',
                    'min-content 1fr',
                ]],
                alignItems: 'center', // center vertically
                
                
                
                // sizes:
                contain: 'inline-size', // prevents the <WishGroupImage> to resize when the <header> having overflowed children
                
                
                
                // spacings:
                padding : '0.75rem',
                gapBlock  : spacers.sm,
                
                
                
                // children:
                ...children(['.name', '.count'], {
                    // sizes:
                    minBlockSize: '1.03lh',
                }),
                ...children('.name', { // handles long text
                    // layouts:
                    display: 'grid',
                    
                    
                    
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
                ...children('.count', {
                    // positions:
                    gridArea    : 'count',
                    justifySelf : 'end',
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
const usesAddWishGroupImageLayout = () => {
    return style({
        // borders:
        borderStyle: 'dashed',
        
        
        
        // children:
        ...children('.addMessage', {
            // positions:
            gridArea: '1 / 1 / -1 / -1',
            
            
            
            // layouts:
            display: 'grid',
            justifyItems : 'center',
            
            
            
            // spacings:
            gap : spacers.sm,
        }),
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesWishGroupImageLayout(),
    }, { specificityWeight: 2 }),
    scope('add', {
        // layouts:
        ...usesAddWishGroupImageLayout(),
    }, { specificityWeight: 2 }),
];
