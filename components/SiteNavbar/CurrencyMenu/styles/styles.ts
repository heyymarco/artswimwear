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
    // border (stroke) stuff of UI:
    usesBorder,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    icons,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesCurrencyMenuLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // sizes:
        minInlineSize : icons.sizeLg, // has min size in desktop mode has 100% width in mobile mode
        
        
        
        // borders:
        [borderVars.borderWidth]: '0px',
        
        
        
        // typos:
        fontWeight: 700,
    });
};
const usesCurrencyDropdownListLayout = () => {
    return style({
        ...rule('.navbarCollapsed', {
            inlineSize : '100%',
            ...children('*', {
                inlineSize : '100%',
                textAlign  : 'center',
            }),
        }),
    });
};



export default () => [
    scope('currencyMenu', {
        // layouts:
        ...usesCurrencyMenuLayout(),
    }, { specificityWeight: 2 }),
    scope('currencyDropdown', {
        // layouts:
        ...usesCurrencyDropdownListLayout(),
    }),
];
