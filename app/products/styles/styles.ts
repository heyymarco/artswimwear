// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'              // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// defaults:
const minImageSize   = 255; // 255px
// const minImageHeight = 255; // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);



// styles:
const usesMainLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        
        
        
        // scrolls:
        overflow: 'hidden', // workaround for overflowing popup
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    });
};
const usesListLayout = () => {
    return style({
        // layouts:
        display             : 'grid',
        gridTemplateColumns : `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        
        
        
        // scrolls:
        overflow: 'visible', // do not clip <item>'s boxShadow
        
        
        
        // spacings:
        gap: spacers.lg,
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
    scope('list', {
        // layouts:
        ...usesListLayout(),
    }),
];