// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesBaseCardFieldWrapperLayout = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // spacings:
        // copy parent's paddings:
        paddingInline  : paddingVars.paddingInline,
        paddingBlock   : paddingVars.paddingBlock,
        
        
        
        // children:
        ...children('*', {
            // children:
            ...children(['&', '*'], {
                // layouts:
                display   : 'grid',
                blockSize : '1lh !important',
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInline   : `calc(0px - ${paddingVars.paddingInline})`,
                marginBlock    : `calc(0px - ${paddingVars.paddingBlock })`,
                
                // copy parent's paddings:
                paddingInline  : paddingVars.paddingInline,
                paddingBlock   : paddingVars.paddingBlock,
            }),
        }),
    });
};
const usesHiddenLayout = () => {
    return style({
        // positions:
        position   : 'absolute', // do not take up a space
        zIndex     : -99,
        
        
        
        // appearances:
        visibility : 'hidden',
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesBaseCardFieldWrapperLayout(),
    }, { specificityWeight: 2 }),
    scope('hidden', {
        // layouts:
        ...usesHiddenLayout(),
    }, { specificityWeight: 2 }),
];
