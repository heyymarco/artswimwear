// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'              // writes css in javascript

// reusable-ui components:
import {
    // simple-components:
    inputElm,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components



// styles:
const usesRadioDecoratorLayout = () => {
    return style({
        // positions:
        justifySelf : 'center', // center horizontally, no resize
        alignSelf   : 'center', // center vertically  , no resize
        
        
        
        // sizes:
        flex        : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width, no resize
        
        
        
        // children:
        ...children(inputElm, {
            borderColor: 'currentcolor', // follows the <Parent>'s foreground color
        }),
    });
};

export default style({
    // layouts:
    ...usesRadioDecoratorLayout(),
});
