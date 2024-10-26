// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export default [
    scope('main', {
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            gridTemplate   : [[
                '"... ....... ..." auto',
                '"... content ..." max-content',
                '"... ....... ..." auto',
                '/',
                `1fr minmax(max-content, ${breakpoints.sm}px) 1fr`
            ]],
        }),
    }),
    scope('content', {
        // positions:
        gridArea: 'content',
        
        
        
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap : spacers.xl,
    }),
    
    
    
    scope('signInUserInfo', {
        // positions:
        justifySelf: 'center',
        
        
        
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap: spacers.sm,
    }),
    scope('signInUserInfoText', {
        // typos:
        textAlign: 'center',
    }),
    scope('switchUserInfoText', {
        // typos:
        textAlign: 'center',
    }),
    
    
    
    scope('signInUiGroup', {
        // layouts:
        display: 'grid',
        
        
        
        // spacings:
        gap: spacers.sm,
        
        
        
        // typos:
        textAlign: 'center',
    }),
];
