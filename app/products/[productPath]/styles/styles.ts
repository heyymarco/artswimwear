// cssfn:
import {
    // writes css in javascript:
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
    scope('main', {
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"  nav  " auto',
            '"gallery" 25rem',
            '"actions" auto',
            '"  desc " auto',
            '/',
            '   1fr',
        ]],
        ...ifScreenWidthAtLeast('lg', {
            gridTemplate: [[
                '"nav         nav" auto',
                '"gallery actions" 25rem',
                '"desc       desc" auto',
                '/',
                ' 3fr         2fr',
            ]],
        }),
        
        
        
        // spacings:
        gapInline : '4rem',
        gapBlock  : '2rem',
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    }),
    
    scope('nav', {
        // positions:
        gridArea : 'nav',
    }),
    
    scope('gallery', {
        // positions:
        gridArea : 'gallery',
        
        
        
        // layouts:
        display : 'grid',
        
        
        
        // children:
        ...children('article', {
            display : 'contents',
            
            
            
            // children:
            ...children('.slides', {
            }),
        }),
    }),
    scope('slides', {
        // children:
        ...children('ul>li>figure', {
            // layouts:
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center',
            
            
            
            // sizes:
            width          : '100%',
            height         : '100%',
            
            
            
            // backgrounds:
            background     : 'white',
            
            
            
            // children:
            ...children(['&', 'img'], {
                // appearances:
                objectFit : 'contain',
            }),
        }),
    }),
    
    scope('actions', {
        // positions:
        gridArea : 'actions',
    }),
    scope('paraQty', {
        // spacings:
        marginBlockEnd: '0px',
    }),
    scope('ctrlQty', {
        // sizes:
        ...descendants('input', {
            boxSizing : 'content-box',
            width     : '2em', // fit for number 99
            
            
            
            // typos:
            textAlign : 'center',
        }),
    }),
    scope('ctrlAction', {
        // sizes:
        boxSizing : 'border-box',
        width     : '100%',
    }),
    
    scope('desc', {
        // positions:
        gridArea : 'desc',
    }),
];
