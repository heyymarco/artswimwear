// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    scope,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// defaults:
const minImageSize   = 255; // 255px



// styles:
const usesGalleryBodyWrapperLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // craft the <GalleryBody>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : null, // craft the <GalleryBody>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        itemsSelector             : null, // craft the <GalleryBody>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
    });
    const {groupableRule: groupableRuleForBackdrop} = usesGroupable({
        orientationInlineSelector : '&', // always => target the <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : '&', // always => target the <portal><ModalBackdrop><ModalDialog>
        itemsSelector             : '*>[role="dialog"]', // target the <portal><ModalBackdrop><ModalDialog>
    });
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // capabilities:
        ...groupableRule(),  // make a nicely rounded corners
        ...groupableRuleForBackdrop(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display            : 'grid',
            gridAutoFlow       : 'row',
            
            
            
            // spacings:
            // [paddingVars.paddingInline] : '0px', // do NOT remove the padding on the <GalleryBodyWrapper> because the <GalleryBody> is NOT have padding
            // [paddingVars.paddingBlock ] : '0px', // do NOT remove the padding on the <GalleryBodyWrapper> because the <GalleryBody> is NOT have padding
            
            
            
            // children:
            ...children('*>[role="dialog"]', {
                // accessibilities:
                pointerEvents : 'auto', // block the interaction behind the <Backdrop> but still make the <Backdrop> interactive for touch & scrolling
                
                
                
                // spacings:
                [paddingVars.paddingInline] : '0px', // remove the padding to minimize the minInlineSize requirement
                [paddingVars.paddingBlock ] : '0px', // remove the padding to minimize the minBlockSize  requirement
            }),
        }),
    });
};
const usesGalleryBodyLayout = () => { // the <GalleryBody> of model
    // dependencies:
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    // features:
    const {borderVars } = usesBorder();
    
    
    
    return style({
        // layouts:
        display      : 'grid', // use css block grid for layouting, the core of our <PaginationGallery> layout
        alignContent : 'start', // when the item(s) are too few, place the extra spacing at the bottom
        
        
        
        // scrolls:
        overflow     : 'visible', // do not clip <item>'s boxShadow
        
        
        
        // sizes:
        gridArea     : '1 / 1 / -1 / -1', // fill the entire <GalleryBodyWrapper>
        minBlockSize : '13rem', // limits the minimum height to make loading|error popup have enough space
        
        
        
        // borders:
        [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
        [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
        
        [borderVars.borderWidth           ] : '0px', // flush (border-less)
        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
        [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
        [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
        
        
        
        // the aspectRatio is already defined in <WishGroupImage>
        // // children:
        // ...children('*', {
        //     boxSizing   : 'border-box',
        //     aspectRatio : commerces.defaultProductAspectRatio,
        // }),
    });
};
const usesGalleryBodyGridLayout = () => {
    return style({
        // layouts:
        display             : 'grid', // use css block grid for layouting, the core of our <PaginationGallery> layout
        gridTemplateColumns : `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        gridAutoRows        : '1fr',  // make all <GalleryItem>s having consistent height
        
        
        
        // spacings:
        gap: spacers.lg,
    });
};
const usesGalleryBodyItemLayout = () => {
    return style({
        // layouts:
        display: 'grid',
    });
};

const usesCreateModelLayout = () => { // the <GalleryItem> of model add_new
    return style({
        // borders:
        borderStyle: 'dashed',
    });
};
const usesEmptyModelLayout = () => { // the <GalleryItem> of model empty_data
    return style({
        // layout:
        display: 'grid',
        justifyItems : 'center', // center horizontally
        alignItems: 'center',    // center vertically
        
        
        
        // appearances:
        opacity    : 0.5,
        
        
        
        // spacings:
        margin     : 0,
        
        
        
        // typos:
        fontStyle  : 'italic',
        textAlign  : 'center',
    });
};



export default () => [
    scope('main', {
        // layouts:
        display : 'grid',
        gridTemplate: [[
            '"toolbar    " auto',
            '"paginTop   " auto',
            '"bodyWrapper" 1fr',
            '"paginBtm   " auto',
            '/',
            '1fr'
        ]],
        
        
        
        // spacings:
        ...children('*', {
            ...rule(':not(:last-child)', {
                marginBottom : spacers.md,
            }),
        })
    }),
    
    
    
    scope('toolbar', {
        // positions:
        gridArea: 'toolbar',
        
        
        
        // layouts:
        display        : 'none',
        ...rule(':has(>*:not(:empty))', {
            display    : 'flex',
        }),
        flexWrap       : 'wrap',
        flexDirection  : 'row',
        justifyContent : 'space-between',
        alignItems     : 'center',
        
        
        
        // spacings:
        gap : spacers.md,
        
        
        
        // children:
        ...children(['.toolbarBefore', '.toolbarMain', '.toolbarAfter'], {
            display       : 'flex',
            flexWrap      : 'wrap',
            flexDirection : 'row',
            alignItems     : 'center',
            
            
            
            // spacings:
            gap : spacers.md,
        }),
    }),
    
    
    
    scope('paginTop', {
        // positions:
        gridArea: 'paginTop',
        justifySelf: 'center',
    }),
    scope('galleryBodyWrapper', {
        // positions:
        gridArea: 'bodyWrapper',
        
        
        
        // layouts:
        ...usesGalleryBodyWrapperLayout(),
    }, { specificityWeight: 2 }),
    scope('galleryBody', { // the <GalleryBody> of model
        ...usesGalleryBodyLayout(),
    }),
    scope('galleryBodyGrid', { // the <GalleryBody> of model
        ...usesGalleryBodyGridLayout(),
    }),
    scope('galleryBodyItem', {
        // layouts:
        ...usesGalleryBodyItemLayout(),
    }),
    scope('createModel', { // the <GalleryItem> of model add_new
        ...usesCreateModelLayout(),
    }, { specificityWeight: 2 }),
    scope('emptyModel', { // the <GalleryItem> of model empty_data
        ...usesEmptyModelLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        // positions:
        gridArea: 'paginBtm',
        justifySelf: 'center',
    }),
];
