// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesPayPalHostedFieldLayout = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // spacings:
        // cancel-out parent's padding with negative margin:
        marginInline   : `calc(0px - ${paddingVars.paddingInline})`,
        marginBlock    : `calc(0px - ${paddingVars.paddingBlock })`,
        
        // children:
        ...children('iframe', {
            // copy parent's paddings:
            paddingInline  : paddingVars.paddingInline,
            paddingBlock   : paddingVars.paddingBlock,
        }),
    });
};

export default () => style({
    // layouts:
    ...usesPayPalHostedFieldLayout(),
});
