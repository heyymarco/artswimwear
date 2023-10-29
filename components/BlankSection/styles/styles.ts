// cssfn:
import {
    // writes css in javascript:
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
