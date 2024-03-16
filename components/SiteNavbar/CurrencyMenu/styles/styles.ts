// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
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
    scope('currencyDropdownDropdown', {
        // layouts:
        ...usesCurrencyDropdownDropdownLayout(),
    }),
];
