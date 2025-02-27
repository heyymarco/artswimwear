// cssfn:
import {
    // writes css in javascript:
    descendants,
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // reusable-ui configs:
    spacers,
    
    
    
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
                '"gallery actions" minmax(25rem, 1fr)',
                '"desc       desc" auto',
                '/',
                // ' 3fr         2fr',
                ' 3fr         minmax(20rem, 2fr)',
            ]],
        }),
        
        
        
        // spacings:
        gapInline : '4rem',
        gapBlock  : '2rem',
        
        
        
        // children:
        ...children('section', {
            // spacings:
            padding: '0px',
            ...children('article', {
                margin: '0px', // kill parent padding
                padding: '0px',
            }, { specificityWeight: 2 }),
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
    
    scope('actions', {
        // positions:
        gridArea : 'actions',
    }),
    scope('label', {
        // spacings:
        marginBlockEnd: '0px',
    }),
    scope('ctrlQty', {
        // sizes:
        inlineSize: '100%',
        ...descendants('input', {
            boxSizing : 'content-box',
            width     : '2em', // fit for number 99
            
            
            
            // typos:
            textAlign : 'center',
        }),
    }),
    scope('variants', {
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap : spacers.sm,
    }),
    scope('paraAction', {
        // layouts:
        display: 'grid',
    }),
    
    scope('desc', {
        // positions:
        gridArea : 'desc',
    }),
];
