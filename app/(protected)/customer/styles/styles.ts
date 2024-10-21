// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    scope,
    
    
    
    // strongly typed of css variables:
    switchOf,
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
    basics,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export default [
    scope('main', {
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            gridTemplate   : [[
                '"preview     name" auto',
                '"preview username" auto',
                '"preview    email" auto',
                '"preview ........" auto',
                '/',
                '100px max-content',
            ]],
            justifyContent : 'center',
            alignContent   : 'center',
            
            
            
            // gap:
            gapInline : spacers.xl,
            gapBlock  : spacers.default,
            
            
            
            // children:
            ...children('*', {
                margin: 0,
                ...children('.label', {
                    display: 'block',
                    fontSize : typos.fontSizeSm,
                    fontWeight : typos.fontWeightNormal,
                }),
                ...descendants('.noValue', {
                    // appearances:
                    opacity    : 0.5,
                    
                    
                    
                    // typos:
                    fontStyle  : 'italic',
                }),
                ...children('.edit', {
                    ...rule(':not(.overlay)', {
                        // spacings:
                        marginInlineStart: '0.25em',
                        
                        
                        
                        // typos:
                        fontSize : '0.75em',
                    }),
                    
                    // invert the edit overlay, so the edit overlay can be seen on busy background:
                    ...rule('.overlay', {
                        // animations:
                        filter    : [['none'], '!important'],
                        animation : [['none'], '!important'],
                        
                        
                        
                        // children:
                        ...children('[role="img"]', {
                            transition: [
                                ['backdrop-filter' , basics.defaultAnimationDuration],
                                ['background-color', basics.defaultAnimationDuration],
                            ],
                            ...rule(':not(:hover)', {
                                backdropFilter  : [[
                                    switchOf(
                                        'var(--backdropFilter)',
                                        'invert(1)',
                                    ),
                                ]],
                                backgroundColor : 'transparent',
                            }),
                        }),
                    }),
                }),
            }),
            ...rule(':has(>.preview:not(.hasImage))', {
                ...children('.floatingEdit>.edit.overlay', {
                    '--backdropFilter': 'invert(0.4)',
                }),
            }),
            // invert the edit overlay, so the edit overlay can be seen on busy background:
            ...rule('& :has(>.edit.overlay)', { // select any element having children('>.edit.overlay') but within `<ProfilePage> > section > article`
                filter : [['none'], '!important'],
            }),
            ...children('.preview', {
                gridArea: 'preview',
            }),
            ...children('.floatingEdit', {
                translate: [[
                    `calc(100% + ${spacers.sm})`,
                    spacers.sm,
                ]],
            }),
            ...children('.name', {
                gridArea: 'name',
            }),
            ...children('.username', {
                gridArea: 'username',
            }),
            ...children('.email', {
                gridArea: 'email',
            }),
        }),
    }),
];
