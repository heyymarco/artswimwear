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
            // positions:
            alignSelf : 'start',
            
            
            
            // layouts:
            display            : 'grid',
            gridAutoFlow       : 'row',
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px', // we REMOVED the padding on the <GalleryBodyWrapper> because the <GalleryBody> is ALREADY has padding on the <ListItem>
            [paddingVars.paddingBlock ] : '0px', // we REMOVED the padding on the <GalleryBodyWrapper> because the <GalleryBody> is ALREADY has padding on the <ListItem>
            
            
            
            // children:
            ...children('*>[role="dialog"]', {
                pointerEvents : 'auto', // block the interaction behind the <Backdrop> but still make the <Backdrop> interactive for touch & scrolling
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
        // sizes:
        gridArea     : '1 / 1 / -1 / -1', // fill the entire <GalleryBodyWrapper>
        minBlockSize : '13rem', // limits the minimum height to make loading|error popup have enough space
        
        
        
        // borders:
        [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
        [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
        
        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
        [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
        [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
        
        
        
        // children:
        ...children('li:not(:is(.solid, .fluid))', { // defaults to .solid
            flex : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
        }),
    });
};

const usesCreateModelLayout = () => { // the <GalleryItem> of model add_new
    return style({
        // layouts:
        display: 'grid',
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
const usesSeparatorHackLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        
        
        
        // sizes:
        boxSizing    : 'border-box',
        minBlockSize : 0,
        
        
        
        // spacings:
        padding      : 0,
    });
};



export default () => [
    scope('main', {
        // layouts:
        display : 'grid',
        
        
        
        // spacings:
        gap : spacers.md,
    }),
    
    
    
    scope('toolbar', {
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
        justifySelf: 'center',
    }),
    scope('galleryBodyWrapper', {
        ...usesGalleryBodyWrapperLayout(),
    }, { specificityWeight: 2 }),
    scope('galleryBody', { // the <GalleryBody> of model
        ...usesGalleryBodyLayout(),
    }, { specificityWeight: 2 }),
    scope('createModel', { // the <GalleryItem> of model add_new
        ...usesCreateModelLayout(),
    }, { specificityWeight: 2 }),
    scope('emptyModel', { // the <GalleryItem> of model empty_data
        ...usesEmptyModelLayout(),
    }, { specificityWeight: 2 }),
    scope('separatorHack', {
        ...usesSeparatorHackLayout(),
    }),
    scope('paginBtm', {
        justifySelf: 'center',
    }),
];
