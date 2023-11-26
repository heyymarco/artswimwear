// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifContainerWidthAtLeast,
    ifContainerWidthBetween,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
    
    
    
    // base-content-components:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const usesSignInTitleColor = () => {
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

const usesPaymentConfirmationTabLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // spacings:
        gap     : spacers.default,
        
        
        
        // children:
        ...children('.title', {
            // appearances:
            ...usesSignInTitleColor(),
            
            
            
            // spacings:
            margin    : '0px', // kill <h1> auto margin
            
            
            
            // typos:
            textAlign : 'center',
        }),
    });
};
const usesPaymentConfirmationSentTabLayout = () => {
    return style({
        // layouts:
        display : 'grid',
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
            ...usesSignInTitleColor(),
        }),
    }),
];
