// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // removes browser's default stylesheet:
    stripoutTextbox,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesTitleColor = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    
    
    
    return style({
        // layouts:
        ...style({
            // accessibilities:
            ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                // backgrounds:
                backg     : backgroundVars.altBackgColor,
                
                
                
                // foregrounds:
                foreg     : foregroundVars.altForeg,
            }),
            
            
            
            // foregrounds:
            foreg     : backgroundVars.altBackgColor,
        }),
        
        
        
        // features:
        ...backgroundRule(), // must be placed at the last
        ...foregroundRule(), // must be placed at the last
    });
};
const usesTitleLayout = () => {
    return style({
        // appearances:
        ...usesTitleColor(),
        
        
        
        // spacings:
        // margin    : '0px', // kill <h1> auto margin
        
        
        
        // typos:
        textAlign : 'center',
    });
};
const usesTableLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    const {borderRule    , borderVars    } = usesBorder(basics);
    const {paddingRule   , paddingVars   } = usesPadding(basics);
    
    // capabilities:
    const {groupableRule, separatorRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never  => the <table> is never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <table> is always stacked in vertical
        itemsSelector             : ['thead', 'tbody', 'tfoot'], // select <thead>, <tbody>, <tfoot>
    });
    const {groupableRule: subGroupableRule, separatorRule: subSeparatorRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in vertical
        itemsSelector             : 'tr', // select <tr>
    });
    const {groupableRule: rowGroupableRule} = usesGroupable({
        orientationInlineSelector : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in horizontal
        orientationBlockSelector  : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in vertical
        itemsSelector             : ['td', 'th'], // select <tr> & <th>
    });
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display             : 'grid',
            gridTemplateColumns : 'repeat(1, auto)',
            ...ifScreenWidthAtLeast('sm', {
                gridTemplateColumns : 'auto 1fr auto', // <Title>|<Label> + <Content> + <EditButton>
            }),
            ...children(['thead', 'tbody', 'tfoot'], {
                gridColumn          : '1 / -1', // span the entire columns
                display             : 'grid',
                gridTemplateColumns : 'subgrid',
                ...children('tr', {
                    gridColumn          : 'inherit',
                    display             : 'inherit',
                    gridTemplateColumns : 'inherit',
                    ...children(['td', 'th'], {
                        display          : 'grid',
                        gridTemplateRows : 'auto', // only 1 row
                        gridAutoFlow     : 'column',
                    }),
                }),
            }),
            
            
            
            // borders:
            border                 : borderVars.border,
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            ...children(['thead', 'tbody', 'tfoot'], {
                border                 : borderVars.border,
                ...separatorRule(), // turns the current border as separator between <thead>, <tbody>, <tfoot>
                
             // borderRadius           : borderVars.borderRadius,
                borderStartStartRadius : borderVars.borderStartStartRadius,
                borderStartEndRadius   : borderVars.borderStartEndRadius,
                borderEndStartRadius   : borderVars.borderEndStartRadius,
                borderEndEndRadius     : borderVars.borderEndEndRadius,
                
                
                
                // children:
                ...subGroupableRule(),
                ...children('tr', {
                    border                 : borderVars.border,
                    ...subSeparatorRule(), // turns the current border as separator between <tr>(s)
                    
                 // borderRadius           : borderVars.borderRadius,
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    borderEndStartRadius   : borderVars.borderEndStartRadius,
                    borderEndEndRadius     : borderVars.borderEndEndRadius,
                    
                    
                    
                    // children:
                    ...rowGroupableRule(), // turns the borderRadius(es) of the first & last <td>|<th>
                    ...children(['td', 'th'], {
                        // border                 : borderVars.border,
                        // ...rowSeparatorRule(), // turns the current border as separator between <td>|<th>(s)
                        
                     // borderRadius           : borderVars.borderRadius,
                        borderStartStartRadius : borderVars.borderStartStartRadius,
                        borderStartEndRadius   : borderVars.borderStartEndRadius,
                        borderEndStartRadius   : borderVars.borderEndStartRadius,
                        borderEndEndRadius     : borderVars.borderEndEndRadius,
                    }),
                }),
            }),
            
            
            
            // spacings:
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            ...children(['thead', 'tbody', 'tfoot'], {
                marginInline         : `calc(0px - ${groupableVars.paddingInline})`, // cancel out parent's padding with negative margin
                ...rule(':first-child', {
                    marginBlockStart : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
                }),
                ...rule(':last-child', {
                    marginBlockEnd   : `calc(0px - ${groupableVars.paddingBlock })`, // cancel out parent's padding with negative margin
                }),
            }),
            
            
            
            // children:
            ...children(['thead', 'tbody', 'tfoot'], {
                ...children('tr', {
                    ...children(['td', 'th'], { // spacing for all cells
                        // spacings:
                        padding        : '0.75rem',
                        
                        ...rule('[colspan="2"]', {
                            gridColumnEnd : 'span 2',
                        }),
                        ...rule('[colspan="3"]', {
                            gridColumnEnd : 'span 3',
                        }),
                    }),
                    ...children(['td', 'th'], { // common features
                        // features:
                        ...backgroundRule(), // must be placed at the last
                        ...foregroundRule(), // must be placed at the last
                    }),
                    ...children('th', { // default title formatting
                        // typos:
                        fontWeight     : typos.fontWeightSemibold,
                        textAlign      : 'center', // center the title horizontally
                    }),
                    ...children('td', { // default data formatting
                        // typos:
                        wordBreak      : 'break-word',
                        overflowWrap   : 'anywhere', // break long text like email
                    }),
                }),
            }),
            ...children(['thead', 'tfoot'], {
                ...children('tr', {
                    ...children('th', { // special theme color for header|footer's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.backgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.foreg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.altBackgColor,
                        
                        
                        
                        // foregrounds:
                        foreg     : foregroundVars.altForeg,
                    }),
                }),
            }),
            ...children('tbody', {
                ...children('tr', {
                    ...children(['td', 'th'], { // special theme color for body's cell(s)
                        // accessibilities:
                        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                            // backgrounds:
                            backg : backgroundVars.altBackgColor,
                            
                            
                            
                            // foregrounds:
                            foreg : foregroundVars.altForeg,
                        }),
                        
                        
                        
                        // backgrounds:
                        backg     : backgroundVars.backgColor,
                        
                        
                        
                        // foregrounds:
                        foreg     : foregroundVars.foreg,
                    }),
                    ...children('th', { // special title formatting
                        ...rule(':nth-child(1)', { // <th> as <Label>
                            // layouts:
                            justifyContent     : 'center',  // center     the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'end',     // right_most the items horizontally
                            }),
                            
                            alignContent       : 'center',  // center     the items vertically
                        }),
                    }),
                    ...children('td', { // special data formatting
                        // special layouts:
                        ...rule(':nth-child(1)', { // <td> as <Label>
                            // layouts:
                            justifyContent     : 'center',  // center     the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'end',     // right_most the items horizontally
                            }),
                        }),
                        ...rule(':nth-child(2)', { // <td> as <Data>
                            // layouts:
                            justifyContent     : 'center',  // center    the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                justifyContent : 'start',   // left_most the items horizontally
                            }),
                        }),
                        ...rule(':nth-child(3)', { // <td> as <EditButton>
                            // layouts:
                            justifyContent : 'center', // center the items vertically
                        }),
                    }),
                }),
            }),
        }),
        
        
        
        // features:
        ...borderRule(),     // must be placed at the last
        ...paddingRule(),    // must be placed at the last
    });
};

const usesShippingTrackingLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        gridTemplate : [[
            '"..... title ....." auto',
            '"..... info  ....." auto',
            '"..... logs  ....." auto',
            '/',
            'auto max-content auto',
        ]],
        
        
        
        // spacings:
        gap     : spacers.xl,
        
        
        
        // children:
        ...children('.title', {
            // positions:
            gridArea : 'title',
            
            
            
            // layouts:
            ...usesTitleLayout(),
        }),
        ...children('table', {
            // positions:
            justifySelf : 'stretch',
            
            
            
            // layouts:
            ...usesTableLayout(),
            
            
            
            // children:
            ...children('tbody', {
                ...children('tr', {
                    ...children('td', { // special data formatting
                        ...rule('.editTimezone', {
                            // layouts:
                            justifyContent: 'stretch', // full width the editor
                        }),
                        ...rule('.labelDateTime', {
                            ...children('input', {
                                textAlign     : 'center',
                                ...ifScreenWidthAtLeast('sm', {
                                    textAlign : 'end',
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        }),
        ...children('.info', {
            // positions:
            gridArea       : 'info',
        }),
        ...children('.logsEmpty', {
            // positions:
            gridArea : 'logs',
            
            
            
            // typos:
            textAlign: 'center',
        }),
        ...children('.logs', {
            // positions:
            gridArea : 'logs',
            
            
            
            // typos:
            textAlign: 'center',
            
            
            
            // children:
            ...children('tbody', {
                ...children('.timezone', {
                    ...children('td', {
                        display: 'grid',
                        alignContent: 'center',
                    }),
                }),
            }),
        }),
    });
};
const usesOutputDateLayout = () => {
    return style({
        ...stripoutTextbox(),
    });
};



export default () => [
    scope('main', {
        // layouts:
        display      : 'grid',
        
        
        
        // scrolls:
        overflow: 'hidden', // workaround for overflowing popup
        
        
        
        // children:
        ...children('section', {
            padding: '0px',
        }),
    }),
    scope('shippingTracking', {
        ...usesShippingTrackingLayout(),
    }),
    scope('outputDate', {
        ...usesOutputDateLayout(),
    }),
];
