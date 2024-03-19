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
    // reusable-ui configs:
    spacers,
}                           from '@reusable-ui/core'        // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    icons,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesCurrencyMenuLayout = () => {
    return style({
        // sizes:
        minInlineSize : icons.sizeLg, // has min size in desktop mode has 100% width in mobile mode
        
        
        
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
const usesCurrencyItemLayout = () => {
    return style({
        // layout:
        display : 'grid',
        gridTemplate : [[
            '"indicator name"  auto',
            '/',
            'auto 1fr',
        ]],
        
        
        
        // spacings:
        gap : spacers.sm,
        
        
        
        // children:
        ...children('.indicator', {
            gridArea : 'indicator',
        }),
        ...children('.name', {
            gridArea : 'name',
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
    scope('currencyItem', {
        // layouts:
        ...usesCurrencyItemLayout(),
    }),
];
