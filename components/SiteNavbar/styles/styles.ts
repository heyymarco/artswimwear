// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
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
        gridTemplate   : [[
            '"icon label" 1fr',
            '/',
            'auto 1fr',
        ]],
        gridAutoFlow   : 'column',
        justifyItems   : 'center',
        alignItems     : 'center',
        justifyContent : 'center',
        alignContent   : 'center',
        
        
        
        // spacings:
        gapInline : spacers.xs,
    });
};
const usesSignInNameLayout = () => {
    return style({
        // sizes:
        contain        : 'inline-size', // do not take horz space
        justifySelf    : 'stretch',     // fill available width
        alignSelf      : 'center',      // center vertically
        overflow       : 'hidden',
        textOverflow   : 'ellipsis',
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
const usesSignInEditProfileLayout = () => {
    return style({
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"image  name" auto',
            '"image email" auto',
            '"image  edit" 1fr',
            '/',
            '100px 1fr',
        ]],
        
        
        
        // spacings:
        gapInline : spacers.default,
        gapBlock  : 0,
        padding   : spacers.default,
        
        
        
        // children:
        ...children('.image', {
            // positions:
            gridArea    : 'image',
        }),
        ...children('.name', {
            // positions:
            gridArea    : 'name',
            
            
            
            // typos:
            fontSize    : typos.fontSizeMd,
        }),
        ...children('.email', {
            // positions:
            gridArea    : 'email',
            
            
            
            // typos:
            fontSize    : `calc((${typos.fontSizeSm} + ${typos.fontSizeMd}) / 2)`,
        }),
        ...children('.edit', {
            // positions:
            gridArea    : 'edit',
            justifySelf : 'end', // place to right
            alignSelf   : 'end', // place to bottom
        }),
    });
};



export default () => [
    scope('signInMenu', {
        // layouts:
        ...usesSignInMenuLayout(),
    }),
    scope('signInName', {
        // layouts:
        ...usesSignInNameLayout(),
    }),
    scope('signInDropdown', {
        // layouts:
        ...usesSignInDropdownLayout(),
    }),
    scope('signInEditProfile', {
        // layouts:
        ...usesSignInEditProfileLayout(),
    }, { specificityWeight: 2 }),
];
