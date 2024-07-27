// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

import {
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const usesCaptchaDialogBodyLayout  = () => {
    // dependencies:
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        justifyItems : 'center',
        alignItems   : 'center',
        
        
        
        // sizes:
        boxSizing     : 'content-box',
        minInlineSize : '304px', // the width  of google captcha
        minBlockSize  : '78px',  // the height of google captcha
        
        
        
        // children:
        ...children('*', {
            gridArea: '1 / 1 / -1 / -1',
        }),
        ...children('.content', {
            // layouts:
            display: 'grid',
            
            
            
            // appearances:
            ...rule('.hidden', {
                opacity    : 0,
            }),
            
            
            
            // accessibilities:
            ...rule('.hidden', {
                pointerEvents : 'none', // prevents user interaction
            }),
            
            
            
            // animations:
            transition : [
                // appearances:
                ['opacity' , basics.defaultAnimationDuration, 'ease-out'],
            ],
            
            
            
            // spacings:
            gap: '1em',
            
            
            
            // children:
            ...children('.instructions', {
                // sizes:
                contain: 'inline-size', // do not take horz space
            }),
        }),
        ...children('.loading', {
            fontSize: '3rem',
        }),
        ...children('.error', {
            justifySelf  : 'stretch',
            alignSelf    : 'stretch',
            
            [groupableVars.paddingInline]: 'inherit !important',
            [groupableVars.paddingBlock ]: 'inherit !important',
            marginInline : `calc(0px - ${groupableVars.paddingInline})`,
            marginBlock  : `calc(0px - ${groupableVars.paddingBlock })`,
        }, {specificityWeight: 2}),
    });
};

export default () => style({
    // layouts:
    ...usesCaptchaDialogBodyLayout(),
});
