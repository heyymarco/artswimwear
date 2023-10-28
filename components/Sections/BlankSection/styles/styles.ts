// cssfn:
import {
    // writes css in javascript:
    fallback,
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesBlankSectionLayout = () => {
    return style({
        // layouts:
        display        : 'grid',
        justifyContent : 'stretch', // stretch items horizontally
        alignContent   : 'stretch', // stretch items vertically
        
        
        
        // sizes:
        boxSizing: 'border-box',
        // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
        ...fallback({
            minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
        }),
        ...fallback({
            minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
        }),
        
        
        
        // children:
        ...children('article', {
            // layouts:
            display        : 'grid',
            justifyContent : 'center', // center items horizontally
            alignContent   : 'center', // center items vertically
            
            
            
            // children:
            ...children('.loadingIndicator', {
                fontSize  : '4rem',
            }),
            ...children('.statusMessage', {
                // typos:
                textAlign : 'center',
            })
        }),
    });
};

export default () => style({
    // layouts:
    ...usesBlankSectionLayout(),
});
