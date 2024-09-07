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
    // a responsive management system:
    breakpoints,
    
    
    
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
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
    });
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // capabilities:
        ...groupableRule(),  // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // positions:
            gridArea  : 'modelList',
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
        flexGrow: 1,
        
        display: 'grid',
        gridAutoFlow: 'row',
        ...children('article', {
            // positions:
            justifySelf: 'center', // centering for `maxInlineSize`
            
            
            
            // layouts:
            display      : 'grid',
            gridTemplate : [[
                '"paginTop "', 'auto',
                '"modelList"', '1fr',
                '"paginBtm "', 'auto',
                '/',
                'auto',
            ]],
            ...rule(':has(>.toolbar>*:not(:empty))', {
                gridTemplate : [[
                    '"toolbar  "', 'auto',
                    '"paginTop "', 'auto',
                    '"modelList"', '1fr',
                    '"paginBtm "', 'auto',
                    '/',
                    'auto',
                ]],
            }),
            
            
            
            // spacings:
            gapInline : spacers.md,
            gapBlock  : spacers.sm,
            
            
            
            // sizes:
            flexGrow      : 1,
            maxInlineSize : `${breakpoints.xxxl}px`,
            alignSelf     : 'center',
        }),
    }, { specificityWeight: 2 }),
    
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
        gridArea: 'paginTop',
        
        justifySelf: 'center',
    }),
    scope('listModel', {
        ...usesListModelLayout(),
    }, { specificityWeight: 2 }),
    scope('listModelInner', { // the <List> of model
        ...usesModelListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        gridArea: 'paginBtm',
        
        justifySelf: 'center',
    }),
    
    scope('createModel', { // the <ListItem> of model add_new
        ...usesCreateModelLayout(),
    }),
    scope('emptyModel', { // the <ListItem> of model add_new
        ...usesEmptyModelLayout(),
    }),
    
    scope('loadingBar', {
        // sizes:
        blockSize: '100%',
    }),
];
