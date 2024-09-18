// cssfn:
import {
    // writes css in javascript:
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
const usesListLayout = () => {
    return style({
        // layouts:
        display             : 'grid', // use css block grid for layouting, the core of our <PaginationGallery> layout
        gridTemplateColumns : `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        gridAutoRows        : '1fr',  // make all <GalleryItem>s having consistent height
        
        
        
        // scrolls:
        overflow: 'visible', // do not clip <item>'s boxShadow
        
        
        
        // spacings:
        gap: spacers.lg,
        
        
        
        // the aspectRatio is already defined in <ProductCard>
        // // children:
        // ...children('*', {
        //     boxSizing   : 'border-box',
        //     aspectRatio : commerces.defaultProductAspectRatio,
        // }),
    });
};



export default () => [
    scope('list', {
        // layouts:
        ...usesListLayout(),
    }),
];
