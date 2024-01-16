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
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    wrapperElm,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const usesSignInWrapperLayout = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    const {paddingVars  } = usesPadding();
    
    
    
    return style({
        // sizes:
        // fill entire <MenuItem>:
        inlineSize : '100%',
        blockSize  : '100%',
        
        
        
        // borders:
        [borderVars.borderStartStartRadius] : '0px',
        [borderVars.borderStartEndRadius  ] : '0px',
        [borderVars.borderEndStartRadius  ] : '0px',
        [borderVars.borderEndEndRadius    ] : '0px',
        
        
        
        // spacings:
        // fill entire <MenuItem> while preserves padding:
        [paddingVars.paddingInline]   : ['inherit', '!important'],
        [paddingVars.paddingBlock ]   : ['inherit', '!important'],
        marginInline                  : `calc(0px - ${paddingVars.paddingInline})`,
        marginBlock                   : `calc(0px - ${paddingVars.paddingBlock })`,
        paddingInline                 : paddingVars.paddingInline,
        paddingBlock                  : paddingVars.paddingBlock ,
    });
};
const usesSignInMenuLayout = () => {
    return style({
        // layouts:
        ...rule('.navbarCollapsed>*>*>&', {
            justifySelf    : 'center',
        }),
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
        ...rule(':not(.navbarCollapsed)>*>*>*>&', {
            // sizes:
            contain        : 'inline-size', // do not take horz space
            justifySelf    : 'stretch',     // fill available width
            alignSelf      : 'center',      // center vertically
            overflow       : 'hidden',
            textOverflow   : 'ellipsis',
            textAlign      : 'end',
        }),
    });
};
const usesSignInDropdownDropdownLayout = () => {
    return style({
        ...rule('.navbarCollapsed', {
            inlineSize : '100%',
            ...children('*', {
                inlineSize : '100%',
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
    scope('signInWrapper', {
        // layouts:
        ...usesSignInWrapperLayout(),
    }),
    scope('signInMenu', {
        // layouts:
        ...usesSignInMenuLayout(),
    }),
    scope('signInName', {
        // layouts:
        ...usesSignInNameLayout(),
    }),
    scope('signInDropdownDropdown', {
        // layouts:
        ...usesSignInDropdownDropdownLayout(),
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
