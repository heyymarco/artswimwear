// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
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
        display : 'grid',
        
        
        
        // spacings:
        [paddingVars.paddingInline] : '0px',
        [paddingVars.paddingBlock ] : '0px',
        
        
        
        // children:
        ...children('section', { // the section fills the entire page width
            // layouts:
            display      : 'grid',
            justifyItems : 'center',
            
            
            
            // children:
            ...children('article', { // center the content with limited max width
                // positions:
                justifySelf: 'center', // centering for `maxInlineSize`
                
                
                
                // sizes:
                maxInlineSize : `${breakpoints.lg}px`,
            }, { specificityWeight: 2 }),
        }),
    });
};



export default [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
];
