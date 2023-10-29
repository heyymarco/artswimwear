// cssfn:
import {
    // writes css in javascript:
    fallback,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesBlankPageLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // sizes:
        boxSizing: 'border-box',
        // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
        ...fallback({
            minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
        }),
        ...fallback({
            minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
        }),
    });
};

export default () => style({
    // layouts:
    ...usesBlankPageLayout(),
});
