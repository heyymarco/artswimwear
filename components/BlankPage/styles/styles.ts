// cssfn:
import {
    // writes css in javascript:
    fallback,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a color management system:
    colors,
    
    
    
    // a border (stroke) management system:
    borders,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // color options of UI:
    usesThemeable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    contents,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
const usesUnderConstructionMessageLayout = () => {
    // dependencies:
    
    // variants:
    const {themeableVars} = usesThemeable();
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"illus shared content"', '1fr',
            '/',
            ' 2fr   1fr    1fr'
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplateColumns : '1fr   1fr    1fr',
        }),
        justifyItems : 'center',
        alignItems   : 'center',
        
        
        
        // borders:
        borderBlockStartWidth : borders.hair,
        borderColor           : themeableVars.backg,
        
        
        
        // children:
        ...children('.illustration', {
            // positions:
            gridArea       : 'illus/illus / content/content',
            ...ifScreenWidthAtLeast('sm', {
                gridArea   : 'illus/illus / shared/shared',
            }),
            justifySelf : 'stretch', // move to most left
            alignSelf   : 'stretch',
            
            
            
            // appearances:
            objectFit      : 'contain',
            objectPosition : '50% 35%',
            
            
            
            // sizes:
            boxSizing  : 'border-box',
            
            
            
            // children:
            ...children('img', {
                contain: 'size', // do not taking space
            }),
        }),
        ...children('article', {
            // positions:
            gridArea     : 'shared/shared / content/content',
            ...ifScreenWidthAtLeast('sm', {
                gridArea : 'shared/shared / content/content',
            }),
            alignSelf    : 'end',
            
            
            
            // layouts:
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'stretch',
            
            
            
            // appearances:
            backdropFilter : [['blur(10px)']],
            filter         : [[`drop-shadow(0px 0px 10px ${colors.secondaryBold})`]],
            
            
            
            // sizes:
            boxSizing  : 'border-box',
            inlineSize : '100%',
            
            
            
            // backgrounds:
            backgroundImage : [
                `linear-gradient(${colors.secondaryThin}, ${colors.secondaryThin})`,
                'linear-gradient(rgba(255,255,255, 0.2), rgba(255,255,255, 0.2))'
            ],
            
            
            
            // borders:
            border : `solid 1px ${colors.white}`,
            
            
            
            // spacings:
            paddingInline : contents.paddingInline,
            paddingBlock  : contents.paddingBlock,
        }),
    });
};

export default () => [
    scope('main', {
        // layouts:
        display : 'grid',
        
        
        
        // sizes:
        boxSizing: 'border-box',
        // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
        ...fallback({
            minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
        }),
        ...fallback({
            minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
        }),
    }),
    
    scope('underConstructionMessage', {
        // layouts:
        ...usesUnderConstructionMessageLayout(),
    }),
];
