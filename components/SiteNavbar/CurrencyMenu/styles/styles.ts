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
    // a capability of UI to rotate its layout:
    OrientationableOptions,
    usesOrientationable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    icons,
    
    
    
    // layout-components:
    inheritBorderFromParent,
    usesListItemBaseLayout,
    usesListItemSelfLayout,
    
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    // defaults:
    defaultOrientationableOptions,
}                           from '@reusable-ui/list'



// styles:
const usesCurrencyMenuLayout = (options?: OrientationableOptions) => {
    // options:
    const orientationableStuff = usesOrientationable(options, defaultOrientationableOptions);
    options = orientationableStuff;
    
    
    
    return style({
        // layouts:
        ...style({
            // sizes:
            minInlineSize : icons.sizeLg, // has min size in desktop mode has 100% width in mobile mode
            
            
            
            // typos:
            fontWeight: 700,
        }),
        ...inheritBorderFromParent(),
        ...usesListItemBaseLayout(options), // must be placed at the last
        ...usesListItemSelfLayout(),        // must be placed at the last
    });
};
const usesCurrencyDropdownListLayout = () => {
    return style({
        ...rule('.navbarCollapsed', {
            inlineSize : '100%',
            ...children('*', {
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
