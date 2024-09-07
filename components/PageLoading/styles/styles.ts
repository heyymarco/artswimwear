// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export const usesPageLoadingLayout = () => {
    return style({
        // layouts:
        display         : 'flex',    // use block flexbox, so it takes the entire parent's width
        flexDirection   : 'column',  // the flex direction to vert
        justifyContent  : 'center',  // center items vertically
        alignItems      : 'stretch', // stretch items horizontally
        flexWrap        : 'nowrap',  // no wrapping
        
        
        
        // children:
        ...children('section', {
            // layouts:
            display         : 'flex',   // use block flexbox, so it takes the entire parent's width
            flexDirection   : 'column', // the flex direction to vert
            justifyContent  : 'center', // center items vertically
            alignItems      : 'center', // center items horizontally
            flexWrap        : 'nowrap', // no wrapping
            
            
            
            // sizes:
            flex        : [[1, 1, '100%']], // growable, shrinkable, initial from parent's height
            
            
            
            // children:
            ...children('[role="status"]', {
                fontSize: '4rem',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesPageLoadingLayout(),
});
