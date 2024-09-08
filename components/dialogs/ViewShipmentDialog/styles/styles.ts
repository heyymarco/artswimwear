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
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesPageLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        gridTemplate : [[
            '"..... info  ....." auto',
            '"..... logs  ....." auto',
            '/',
            'auto max-content auto',
        ]],
        
        
        
        // spacings:
        rowGap : spacers.xl,
    });
};

const usesTableInfoLayout = () => {
    return style({
        // positions:
        gridArea    : 'info',
        
        
        
        // children:
        ...children('tbody', {
            ...children('tr', {
                ...children('th', {
                    fontWeight : typos.fontWeightLight,
                }),
                ...children('td', {
                    fontWeight : typos.fontWeightSemibold,
                }),
            }),
        }),
    });
};

const usesLogsEmptyLayout = () => {
    return style({
        // positions:
        gridArea : 'logs',
        
        
        
        // typos:
        textAlign: 'center',
    });
};

const usesTableLogLayout = () => {
    return style({
        // positions:
        gridArea    : 'logs',
        
        
        
        // children:
        ...children('tbody', {
            ...children('tr', {
                ...children('th', {
                    fontWeight : typos.fontWeightLight,
                }),
                ...rule(':not(:first-child)', {
                    ...children('td', {
                        fontWeight : typos.fontWeightSemibold,
                    }),
                }),
            }),
        }),
    });
};

const usesEditTimezoneLayout = () => {
    return style({
        // positions:
        justifyContent: 'stretch', // full width the editor
    });
};
const usesDateTimeLayout = () => {
    return style({
        alignSelf: 'center',
    });
};



export default () => [
    scope('page', {
        ...usesPageLayout(),
    }),
    
    scope('tableInfo', {
        ...usesTableInfoLayout(),
    }, { specificityWeight: 2 }),
    
    scope('logsEmpty', {
        ...usesLogsEmptyLayout(),
    }),
    
    scope('tableLogs', {
        ...usesTableLogLayout(),
    }, { specificityWeight: 2 }),
    scope('editTimezone', {
        ...usesEditTimezoneLayout(),
    }, { specificityWeight: 2 }),
    scope('dateTime', {
        ...usesDateTimeLayout(),
    }),
];
