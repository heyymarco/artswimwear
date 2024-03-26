// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a capability of UI to rotate its layout:
    OrientationableOptions,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onListStylesChange,
    usesListItemLayout,
    usesListItemVariants,
    usesListItemStates,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // configs:
    selectDropdownEditors,
    cssSelectDropdownEditorConfig,
}                           from './config'



// styles:
export const onAccordionItemStylesChange          = watchChanges(onListStylesChange, cssSelectDropdownEditorConfig.onChange);

export const usesSelectDropdownEditorItemLayout   = (options?: OrientationableOptions) => {
    return style({
        // layout:
        ...usesListItemLayout(options), // the options are already handled internally by `usesListItemBaseLayout`
        ...style({
            display      : 'grid',
            ...rule(':has(>.indicator)', {
                gridTemplate : [[
                    '"indicator"  auto',
                    '/',
                    'max-content',
                ]],
            }),
            gridAutoFlow : 'column',
            
            
            
            // children:
            ...children('.indicator', {
                gridArea : 'indicator',
            }),
            
            
            
            // customize:
            ...usesCssProps(selectDropdownEditors), // apply config's cssProps
        }),
    });
};

export const usesSelectDropdownEditorItemVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(selectDropdownEditors);
    
    
    
    return style({
        // variants:
        ...usesListItemVariants(),
        ...resizableRule(),
    });
};

export const usesSelectDropdownEditorItemStates   = usesListItemStates;

export default () => style({
    // layouts:
    ...usesSelectDropdownEditorItemLayout(),
    
    // variants:
    ...usesSelectDropdownEditorItemVariants(),
    
    // states:
    ...usesSelectDropdownEditorItemStates(),
});
