// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui components:
import {
    // simple-components:
    icons,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesCurrencyMenuLayout = () => {
    return style({
        // sizes:
        inlineSize : icons.sizeLg,
        
        
        
        // typos:
        fontWeight: 700,
    });
};
const usesCurrencyDropdownDropdownLayout = () => {
    return style({
        ...rule('.navbarCollapsed', {
            inlineSize : '100%',
            ...children('*', {
                inlineSize : '100%',
            }),
        }),
    });
};



export default () => [
    scope('currencyMenu', {
        // layouts:
        ...usesCurrencyMenuLayout(),
    }, { specificityWeight: 2 }),
    scope('currencyDropdownDropdown', {
        // layouts:
        ...usesCurrencyDropdownDropdownLayout(),
    }),
];
