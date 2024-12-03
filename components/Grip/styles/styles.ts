// cssfn:
import {
    // writes css in javascript:
    states,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // background stuff of UI:
    usesBackground,
    
    
    
    // size options of UI:
    usesResizable,
    
    
    
    // a capability of UI to be disabled:
    ifDisable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onIndicatorStylesChange,
    usesIndicatorLayout,
    usesIndicatorVariants,
    usesIndicatorStates,
}                           from '@reusable-ui/indicator'       // a base component
import {
    // configs:
    controls,
}                           from '@reusable-ui/control'         // a base component

// internals:
import {
    // configs:
    grips,
    cssGripConfig,
}                           from './config'



// styles:
export const onGripStylesChange = watchChanges(onIndicatorStylesChange, cssGripConfig.onChange);

export const usesGripLayout = () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    
    
    
    return style({
        // layouts:
        ...usesIndicatorLayout(),
        ...style({
            // layouts:
            display             : 'grid',
            gridAutoFlow        : 'row',
            gridTemplateColumns : `repeat(auto-fill, minmax(calc(${grips.dotInlineSize} + (2 * ${grips.dotMarginInline})), 1fr))`,
            gridTemplateRows    : `repeat(auto-fill, minmax(calc(${grips.dotBlockSize } + (2 * ${grips.dotMarginBlock })), 1fr))`,
            gridAutoRows        : '1fr',
            justifyItems        : 'center',
            alignItems          : 'center',
            
            
            
            // children:
            ...children('*', {
                // sizes:
                boxSizing       : 'border-box',
                
                
                
                // accessibilities:
                pointerEvents   : 'none', // no interaction, just for decoration purpose
                
                
                
                // backgrounds:
                backgroundColor : backgroundVars.altBackgColor,
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(grips, 'dot')), // apply config's cssProps starting with dot***
            }),
            
            
            
            // customize:
            ...usesCssProps(grips), // apply config's cssProps
        }),
    });
};

export const usesGripVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(grips);
    
    
    
    return style({
        // variants:
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};

export const usesGripStates = () => {
    return style({
        // states:
        ...usesIndicatorStates(),
        ...states([
            ifDisable({
                // accessibilities:
                cursor : controls.cursorDisable,
            }),
        ]),
    });
};

export default () => style({
    // layouts:
    ...usesGripLayout(),
    
    // variants:
    ...usesGripVariants(),
    
    // states:
    ...usesGripStates(),
});
