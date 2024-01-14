// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



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
            justifyContent : 'stretch',
            alignContent   : 'center',
            
            
            
            // children:
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
