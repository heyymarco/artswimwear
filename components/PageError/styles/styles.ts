// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
    mainScope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesPageErrorLayout = () => {
    return style({
        // layouts:
        display         : 'flex',   // use block flexbox, so it takes the entire parent's width
        flexDirection   : 'column', // the flex direction to vert
        justifyContent  : 'center', // center items vertically
        alignItems      : 'center', // center items horizontally
        flexWrap        : 'nowrap', // no wrapping
        
        
        
        // children:
        ...children('section', {
            // sizes:
            flex        : [[1, 1, '100%']], // growable, shrinkable, initial from parent's height
        }),
    });
};
export const usesModalErrorLayout = () => {
    return style({
        // layouts:
        // layouts:
        display         : 'flex',   // use block flexbox, so it takes the entire parent's width
        flexDirection   : 'column', // the flex direction to vert
        justifyContent  : 'center', // center items vertically
        alignItems      : 'center', // center items horizontally
        flexWrap        : 'nowrap', // no wrapping
    });
};

export default () => [
    mainScope({
        // layouts:
        ...usesPageErrorLayout(),
    }, { specificityWeight: 2 }),
    scope('modalError', {
        // layouts:
        ...usesModalErrorLayout(),
    }, { specificityWeight: 2 }),
];
