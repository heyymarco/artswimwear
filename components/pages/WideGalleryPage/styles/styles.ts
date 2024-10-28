// cssfn:
import {
    // writes css in javascript:
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesMainLayout = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        
        
        
        // spacings:
        [paddingVars.paddingInline] : '0px',
        [paddingVars.paddingBlock ] : '0px',
    });
};



export default [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
];
