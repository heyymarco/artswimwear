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
    
    
    
    // removes browser's default stylesheet:
    stripoutTextbox,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
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
    });
};


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
        // positions:
        gridArea : 'title',
        
        
        
        // appearances:
        ...usesTitleColor(),
        
        
        
        // spacings:
        // margin    : '0px', // kill <h1> auto margin
        
        
        
        // typos:
        textAlign : 'center',
    });
};

const usesTableInfoLayout = () => {
    return style({
        // positions:
        gridArea    : 'info',
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
    scope('title', {
        ...usesTitleLayout(),
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
