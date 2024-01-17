// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesProfilePageLayout = () => {
    return style({
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            justifyContent : 'center',
            alignContent   : 'center',
        }),
    });
};

export default () => style({
    // layouts:
    ...usesProfilePageLayout(),
});
