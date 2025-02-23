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
        margin    : '0px', // kill <h1> auto margin
        
        
        
        // typos:
        textAlign : 'center',
    });
};

const usesPaymentConfirmationTabLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // spacings:
        gap     : spacers.default,
        
        
        
        // children:
        ...children('.title', {
            // layouts:
            ...usesTitleLayout(),
        }),
    });
};
const usesPaymentConfirmationSentTabLayout = () => {
    return style({
        // layouts:
        display       : 'flex',
        flexDirection : 'column',
        
        
        
        // spacings:
        gap     : spacers.default,
        
        
        
        // children:
        ...children('.title', {
            // layouts:
            ...usesTitleLayout(),
        }),
        ...children('.actions', {
            // layouts:
            display : 'grid',
            alignContent: 'start',
            
            
            
            // spacings:
            marginBlockStart : 'auto',
            gap     : spacers.default,
        }),
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
    scope('paymentConfirmation', {
        ...usesPaymentConfirmationTabLayout(),
    }),
    scope('paymentConfirmationSent', {
        ...usesPaymentConfirmationSentTabLayout(),
        
        
        
        // children:
        ...children('.title', {
            // appearances:
            ...usesTitleColor(),
        }),
    }),
];
