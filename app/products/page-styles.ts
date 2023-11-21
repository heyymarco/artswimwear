// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    scope,
}                           from '@cssfn/core'              // writes css in javascript

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
    scope('list', {
        // layouts:
        display             : 'grid',
        gridTemplateColumns : `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        
        
        
        // scrolls:
        overflow: 'visible', // do not clip <item>'s boxShadow
        
        
        
        // spacings:
        gap: '4rem',
        
        
        
        // children:
        ...children('article', {
            // layouts:
            display       : 'flex',
            flexDirection : 'column',
            
            
            
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
                position : 'absolute',
                inset    : 0,
            }),
            
            
            
            // children:
            ...children('.prodImg', {
                // sizes:
                flex        : [[1, 1, 'auto']], // growable, shrinkable, initial from it's height
                minWidth    : `${minImageSize}px`,
                width       : 'unset',
                minHeight   : `${minImageHeight}px`,
                aspectRatio : commerces.defaultProductAspectRatio,
                
                
                
                // scrolls:
                overflow    : 'hidden',
                
                
                
                // backgrounds:
                background  : 'white',
                
                
                
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
                // layouts:
                display       : 'block',
                
                
                
                // spacings:
                padding : '0.75rem',
                
                
                
                // children:
                ...children(['.name', '.price'], {
                    // scrolls:
                    overflow     : 'hidden',
                    
                    
                    
                    // typos:
                    whiteSpace   : 'nowrap',
                    textOverflow : 'ellipsis',
                }),
                ...children('.price', {
                    // typos:
                    textAlign    : 'end',
                }),
            }),
        }),
    }),
];
