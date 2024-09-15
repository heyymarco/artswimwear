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
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI
    usesGroupable,
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesListModelLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
    });
    const {groupableRule: groupableRuleForBackdrop} = usesGroupable({
        orientationInlineSelector : '&', // always => target the <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : '&', // always => target the <portal><ModalBackdrop><ModalDialog>
        itemsSelector             : '*>[role="dialog"]',
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
            
            
            
            // sizes:
            ...rule('.empty', {
                blockSize : '100%',   // if model is empty => fill the entire available page height
                overflow  : 'hidden', // a fix for <Backdrop>'s borderRadius // TODO: fix reusable-ui's <ModalBackdrop>
            }),
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesModelListInnerLayout = () => { // the <List> of model
    // dependencies:
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    // features:
    const {borderVars } = usesBorder();
    
    
    
    return style({
        // sizes:
        minBlockSize : '9rem', // limits the minimum height to make loading popup more space
        blockSize: '100%', // fill the entire <Outer>
        
        
        
        // borders:
        [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
        [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
        
        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
        [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
        [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
    });
};

const usesCreateModelLayout = () => { // the <ListItem> of model add_new
    return style({
        // layouts:
        display: 'grid',
    });
};
const usesEmptyModelLayout = () => {
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
        
        
        
        // spacings:
        gapInline : spacers.md,
        gapBlock  : spacers.sm,
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
    scope('listModel', {
        ...usesListModelLayout(),
    }, { specificityWeight: 2 }),
    scope('listModelInner', { // the <List> of model
        ...usesModelListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        justifySelf: 'center',
    }),
    
    scope('createModel', { // the <ListItem> of model add_new
        ...usesCreateModelLayout(),
    }, { specificityWeight: 2 }),
    scope('emptyModel', { // the <ListItem> of model add_new
        ...usesEmptyModelLayout(),
    }, { specificityWeight: 2 }),
    
    scope('loadingBar', {
        // sizes:
        blockSize: '100%',
    }),
];
