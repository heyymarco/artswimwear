// cssfn:
import {
    // writes css in javascript:
    fallback,
    descendants,
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    ifScreenWidthAtLeast,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export default () => [
    scope('hero', {
        // children:
        ...children('article', {
            // layouts:
            display        : 'grid',
            justifyContent : 'stretch',
            alignItems     : 'center',
            
            
            
            // sizes:
            boxSizing  : 'border-box',
            // height  : `calc(100svh - var(--site-header))`, // too small when the browser's navigation is hidden
            ...fallback({
                height : `calc(100dvh - var(--site-header))`,
            }),
            ...fallback({
                height : `calc(100vh  - var(--site-header))`,
            }),
            
            
            
            // children:
            ...children('.slides', {
                // sizes:
                boxSizing  : 'border-box',
                // height  : `calc(100svh  - var(--site-header) - var(--site-footer))`,
                ...fallback({
                    height : `calc(100dvh  - var(--site-header) - var(--site-footer))`,
                }),
                ...fallback({
                    height : `calc(100vh  - var(--site-header) - var(--site-footer))`,
                }),
                
                
                
                // children:
                ...children('ul>li>[role="img"]', {
                    // positions:
                    position      : 'relative', // Supports for <img>'s `position: absolute`
                    
                    
                    
                    // sizes:
                    inlineSize    : '100%',
                    blockSize     : '100%',
                    
                    
                    
                    // backgrounds:
                    background    : 'white',
                    
                    
                    
                    // children:
                    ...children('img', {
                        // positions:
                        position  : ['absolute', '!important'], // Disable for taking space, so Chrome won't confuse with width & height, always follows the <container>'s width & height.
                        
                        
                        
                        // appearances:
                        objectFit : 'contain',
                        
                        
                        
                        // sizes:
                        width  : ['100%', '!important'], // Fills the entire <container>
                        height : ['100%', '!important'], // Fills the entire <container>
                    }),
                }),
            }),
            ...children('footer', {
                // positions:
                alignSelf    : 'end',
                
                
                
                // layouts:
                display      : 'grid',
                gridTemplate : [[
                    '"left center right" auto',
                    '/',
                    '1fr auto 1fr'
                ]],
                justifyItems : 'center',
                alignItems   : 'center',
                
                
                
                // sizes:
                blockSize: `var(--site-footer)`,
                
                
                
                // spacings:
                padding : 0,
                gap     : '1rem',
                
                
                
                // children:
                ...children('.scroller', {
                    // positions:
                    gridArea    : 'center',
                }),
                ...children('.hint', {
                    // positions:
                    gridArea    : 'right',
                    justifySelf : 'start',
                }),
            }),
        }),
    }),
    
    scope('story', {
        // children:
        ...children('article', {
            ...children(['h1', 'h2'], {
                // typos:
                fontSize: '3rem',
            }),
        }),
    }),
    
    scope('fabrics', {
        // children:
        ...children('article', {
            ...children(['h1', 'h2'], {
                // typos:
                fontSize: '3rem',
            }),
        }),
    }),
    scope('howWorks', {
        // children:
        ...children('article', {
            // children:
            ...descendants('.how-work-item', {
                // layouts:
                display           : 'flex',
                flexDirection     : 'column',
                ...ifScreenWidthAtLeast('md', {
                    flexDirection : 'row',
                }),
                alignItems        : 'center',
                
                
                
                // spacings:
                gap : '2rem',
                
                
                
                // children:
                ...children('.illus', {
                    // sizes:
                    flex  : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's height
                    width : 'min(200px, 100%)',
                    
                    
                    
                    // children:
                    ...children('img', {
                        // appearances:
                        objectFit : 'cover',
                    }),
                }),
            }),
        }),
    }),
    
    scope('regeneration', {
        // children:
        ...children('article', {
            // children:
            ...children(['h1', 'h2'], {
                // typos:
                fontSize: '2rem',
            }),
            ...descendants('.illus.fill-self', {
                // backgrounds:
                background: 'transparent',
                
                
                
                // spacings:
                marginBlockEnd: '3rem',
                
                
                
                // children:
                ...children('img', {
                    // appearances:
                    objectFit : 'contain',
                    
                    
                    
                    // sizes:
                    width     : ['min(350px, 100%)', '!important'],
                }),
            }),
        }),
    }),
    
    scope('ethic', {
        // children:
        ...children('article', {
            // layouts:
            display       : 'flex',
            flexDirection : 'column',
            
            
            
            // children:
            ...children(['h1', 'h2'], {
                // typos:
                fontSize: '2.5rem',
            }),
            ...children('.paragraphs', {
                // layouts:
                columns: 1,
                ...ifScreenWidthAtLeast('md', {
                    columns: 2,
                }),
                
                
                
                // spacings:
                marginBlockEnd: '3rem',
            }),
            ...descendants('.illus.fill', {
                // children:
                ...children('img', {
                    // appearances:
                    objectFit: 'cover',
                }),
            }),
        }),
    }),
    
    scope('community', {
        // children:
        ...children('article', {
            // layouts:
            display       : 'flex',
            flexDirection : 'column',
            
            
            
            // children:
            ...children(['h1', 'h2'], {
                // typos:
                fontSize: '3rem',
            }),
            ...descendants('.illus.fill', {
                // children:
                ...children('img', {
                    // appearances:
                    objectFit: 'cover',
                }),
            }),
        }),
    }),
];
