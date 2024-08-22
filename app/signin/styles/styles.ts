// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesSignInPageLayout = () => {
    return style({
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            gridTemplate   : [[
                '"... ..... ..." auto',
                '"... login ..." max-content',
                '"... ..... ..." auto',
                '/',
                `1fr minmax(max-content, ${breakpoints.md}px) 1fr`
            ]],
            
            
            
            // children:
            ...children('*', {
                gridArea: 'login',
            }),
            ...children('*>*', {
                // positions:
                /* begin: a trick for centering `<SignIn> > <TabBody>` which is implemented `container-type: inline-size` */
                position         : 'relative',
                insetInlineStart : '50%',
                translate        : '-50%',
                transition       : 'none',
                /* end  : a trick for centering `<SignIn> > <TabBody>` which is implemented `container-type: inline-size` */
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesSignInPageLayout(),
});
