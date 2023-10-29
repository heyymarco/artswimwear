// cssfn:
import {
    // writes css in javascript:
    descendants,
    children,
    scope,
}                           from '@cssfn/core'   

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    
    
    
    // a typography management system:
    typos,
    horzRules,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    contents,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    commerces,
}                           from '@/config'


// defaults:
const imageSize = 64;  // 64px
const maxMobileTextWidth = `calc(${breakpoints.sm}px - (2 * ${contents.paddingInline}))`;



export default () => [
    scope('cartBody', {
        // layouts:
        display       : 'flex',
        flexDirection : 'column',
        
        
        
        // spacings:
        gap : spacers.sm,
        
        
        
        // children:
        ...descendants('.currencyBlock', {
            // layouts:
            display: 'flex',
        }),
        ...descendants('.currency', {
            // spacings:
            marginInlineStart: 'auto',
            
            
            
            // typos:
            fontSize   : typos.fontSizeMd,
            fontWeight : typos.fontWeightSemibold,
        }),
        ...descendants(['.title', '.unitPrice', '.currencyBlock', '.quantity', 'hr'], {
            // spacings:
            margin: '0px',
        }),
    }, {specificityWeight: 3}),
    
    scope('editCart', {
        // children:
        ...children('*', { // <li>
            // appearances:
            borderColor : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`,
        }),
    }),
    scope('editCartItem', {
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '" image   " max-content',
            '" title   " max-content',
            '"unitPrice" max-content',
            '"quantity " max-content',
            '"subPrice " max-content',
            '/',
            `minmax(${imageSize}px, 1fr)`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate : [[
                '"image     title" max-content',
                '"image unitPrice" max-content',
                '"image  quantity" max-content',
                '"image  subPrice" max-content',
                '/',
                `${imageSize}px auto`,
            ]],
        }),
        
        
        
        // spacings:
        gapInline     : '1rem',
        gapBlock      : '0.5rem',
        paddingInline : '0px',
        
        
        
        // children:
        ...children('.prodImg', {
            // positions:
            gridArea    : 'image',
            justifySelf : 'center', // center horizontally
            alignSelf   : 'center', // center vertically
            
            
            
            // sizes:
            width       : `${imageSize}px`,
            aspectRatio : commerces.defaultProductAspectRatio,
            
            
            
            // backgrounds:
            background  : 'white',
            
            
            
            // children:
            ...children('img', {
                // sizes:
                width  : '100% !important',
                height : '100% !important',
            }),
        }),
        ...children('.title', {
            // positions:
            gridArea    : 'title',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // stretch horizontally
            }),
            
            
            
            // sizes:
            ...ifScreenWidthSmallerThan('sm', {
                boxSizing     : 'border-box',
                maxInlineSize : maxMobileTextWidth,
            }),
            
            
            
            // typos:
            whiteSpace   : 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            overflow     : 'hidden',
            ...ifScreenWidthSmallerThan('sm', {
                textAlign: 'center',
            }),
        }),
        ...children('.unitPrice', {
            // positions:
            gridArea    : 'unitPrice',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // typos:
            ...children(['&', '.currency'], {
                fontSize    : typos.fontSizeSm,
                fontWeight  : typos.fontWeightLight,
            }),
        }),
        ...children('.quantity', {
            // positions:
            gridArea    : 'quantity',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // children:
            ...children('.label', {
                fontSize    : typos.fontSizeSm,
                fontWeight  : typos.fontWeightLight,
            }),
        }),
        ...children('.subPrice', {
            // positions:
            gridArea    : 'subPrice',
            justifySelf : 'end',
        }),
    }, {specificityWeight: 2}),
    
    scope('shippingTips', {
        // spacings:
        marginBlockStart : 'auto', // place to very bottom
        
        
        
        // typos:
        fontSize : typos.fontSizeMd,
        ...ifScreenWidthSmallerThan('sm', {
            boxSizing     : 'border-box',
            maxInlineSize : maxMobileTextWidth,
        }),
    }, {specificityWeight: 2}),
    scope('placeOrderBtn', {
        // sizes:
        minInlineSize : 'fit-content', // fix <ModalSide>'s collapsing animation
        
        
        
        // typos:
        flexWrap   : 'nowrap',         // fix <ModalSide>'s collapsing animation
        whiteSpace : 'nowrap',         // fix <ModalSide>'s collapsing animation
    }, {specificityWeight: 2}),
];
