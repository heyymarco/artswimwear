// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    
    
    
    // simple components:
    usesIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesMainLayout = () => {
    // dependencies:
    
    // features:
    const {iconVars} = usesIcon();
    
    
    
    return style({
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"search " min-content',
            '"results" 1fr',
            '/',
            '1fr',
        ]],
        
        
        
        // spacings:
        gap : spacers.md,
        
        
        
        // children:
        ...children('.search', {
            gridArea: 'search',
            
            
            
            // layouts:
            display: 'grid',
        }),
        ...children('.results', {
            gridArea: 'results',
            
            ...rule('.empty', {
                ...children('.body', {
                    ...children('[role="list"]', {
                        justifyContent : 'center',
                        alignContent   : 'center',
                    }),
                }),
            }),
            ...rule('.initial', {
                // positions:
                justifySelf : 'center',
                alignSelf   : 'center',
                
                
                
                // appearances:
                opacity: 0.25,
                
                
                
                // sizes:
                [iconVars.size]: `min((100svw - (2 * ${containers.paddingInline})) * 0.5, (100svh - (2 * ${containers.paddingBlock})) * 0.5)`,
            }),
        }),
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesMainLayout(),
    }),
];
