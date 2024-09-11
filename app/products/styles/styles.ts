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
    borders,
    borderRadiuses,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// configs:
import {
    commerces,
}                           from '@/config'



// defaults:
const minImageSize   = 255; // 255px
const minImageHeight = 255; // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);



// styles:
const usesMainLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        
        
        
        // scrolls:
        overflow: 'hidden', // workaround for overflowing popup
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    });
};
const usesListLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule, borderVars} = usesBorder({
        borderRadius : borderRadiuses.md,
    });
    
    
    
    return style({
        // layouts:
        ...style({
            // layouts:
            display             : 'grid',
            gridTemplateColumns : `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
            
            
            
            // scrolls:
            overflow: 'visible', // do not clip <item>'s boxShadow
            
            
            
            // spacings:
            gap: spacers.lg,
            
            
            
            // children:
            ...children('article', {
                // layouts:
                display       : 'grid',
                gridTemplate  : [[
                    '"prodImg" 1fr',
                    '"header " max-content',
                    '/',
                    '100%',
                ]],
                
                
                
                // animations:
                transition : [
                    ['box-shadow', '300ms'],
                ],
                boxShadow  : '0px 0px 1rem rgba(0, 0, 0, 0.1)',
                ...rule(':hover', {
                    boxShadow : '0px 0px 1rem rgba(0, 0, 0, 0.7)',
                    ...children('.prodImg', {
                        ...children(['img', '.status'], {
                            scale: '105%',
                        }),
                    }),
                    ...children('header', {
                        ...children(['.name', '.price'], {
                            overflow: 'visible',
                        }),
                    }),
                }),
                
                position : 'relative',
                ...children('a', {
                    // positions:
                    gridArea: '1 / 1 / -1 / -1', // fill the entire <article>
                    // zIndex   : -1,
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
                    aspectRatio : commerces.defaultProductAspectRatio,
                    
                    
                    
                    // scrolls:
                    overflow    : 'hidden',
                    
                    
                    
                    // backgrounds:
                    background  : 'white',
                    
                    
                    
                    // borders:
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    
                    
                    
                    // children:
                    ...children(['img', '.status'], {
                        // animations:
                        transition : [
                            ['scale', '300ms'],
                        ],
                    }),
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
                        '"name      name" auto',
                        '"wishlist price" auto',
                        '/',
                        'min-content 1fr',
                    ]],
                    alignItems: 'center', // center vertically
                    
                    
                    
                    // spacings:
                    padding : '0.75rem',
                    gapInline : spacers.sm,
                    gapBlock  : spacers.xs,
                    
                    
                    
                    // children:
                    ...children(['.name', '.price'], {
                        // scrolls:
                        overflow     : 'hidden',
                        
                        
                        
                        // spacings:
                        margin: 0,
                        
                        
                        
                        // typos:
                        whiteSpace   : 'nowrap',
                        textOverflow : 'ellipsis',
                    }),
                    ...children('.name', {
                        // positions:
                        gridArea: 'name',
                    }),
                    ...children('.price', {
                        // positions:
                        gridArea: 'price',
                        
                        
                        
                        // typos:
                        textAlign    : 'end',
                    }),
                    ...children('.wishlist', {
                        // positions:
                        gridArea: 'wishlist',
                        
                        
                        
                        // accessibilities:
                        pointerEvents: 'initial', // makes the wishlist clickable above the <a>
                    }),
                }),
            }),
        }),
        
        
        
        // features:
        ...borderRule(), // must be placed at the last
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
    scope('list', {
        // layouts:
        ...usesListLayout(),
    }),
];
