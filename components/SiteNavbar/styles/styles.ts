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
    // layout-components:
    wrapperElm,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const usesSignInMenuLayout = () => {
    return style({
        // layouts:
        display        : 'grid',
        gridAutoFlow   : 'column',
        justifyItems   : 'center',
        alignItems     : 'center',
        justifyContent : 'center',
        alignContent   : 'center',
        
        
        
        // spacings:
        gapInline : spacers.xs,
    });
};
const usesProfileImageLayout = () => {
    return style({
        // backgrounds:
        backgroundRepeat   : 'no-repeat',
        backgroundPosition : 'center',
        backgroundSize     : 'contain',
        
        
        
        // borders:
        borderRadius       : '50%',
        
        
        
        // states:
        ...rule('.hasImage', {
            ...children('::after', {
                opacity : 0, // hide the person icon
            }),
        }),
    });
};
const usesSignInDropdownLayout = () => {
    return style({
        // children:
        ...children(wrapperElm, {
            ...children('*', {
                // layouts:
                display      : 'grid',
                gridTemplate : [[
                    '"icon label" auto',
                    '/',
                    'auto 1fr',
                ]],
                
                
                
                // spacings:
                gap: spacers.sm,
            }),
        }),
    });
};



export default () => [
    scope('signInMenu', {
        // layouts:
        ...usesSignInMenuLayout(),
    }),
    scope('profileImage', {
        // layouts:
        ...usesProfileImageLayout(),
    }),
    scope('signInDropdown', {
        // layouts:
        ...usesSignInDropdownLayout(),
    }),
];
