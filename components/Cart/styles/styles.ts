// cssfn:
import {
    // writes css in javascript:
    rule,
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
            '"image    image              image    image" max-content',
            '"title    title              title    title" max-content',
            '"variants variants        variants variants" max-content',
            '".....    labelUnitPrice unitPrice ........" max-content',
            '".....    labelQuantity   quantity ........" max-content',
            '"subPrice subPrice        subPrice subPrice" max-content',
            '/',
            `1fr auto auto 1fr`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate : [[
                '"image title              title" max-content',
                '"image variants        variants" max-content',
                '"image labelUnitPrice unitPrice" max-content',
                '"image labelQuantity   quantity" max-content',
                '"image subPrice        subPrice" max-content',
                '/',
                `min-content min-content auto`,
            ]],
        }),
        
        
        
        // spacings:
        gapInline     : spacers.sm,
        ...ifScreenWidthAtLeast('sm', {
            gapInline : 0, // different gap between prodImg and label
        }),
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
            
            
            
            // spacings:
            ...ifScreenWidthAtLeast('sm', {
                marginInlineEnd : spacers.default,
            }),
            
            
            
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
            
            
            
            // spacings:
            margin       : 0,
            
            
            
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
        ...children('.variants', {
            // positions:
            gridArea        : 'variants',
            justifySelf     : 'center',  // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // fill the entire gridArea
            }),
            
            
            
            // layouts:
            display          : 'flex',
            flexWrap         : 'wrap',   // wrap excess variant items
            
            
            
            // spacings:
            margin           : 0,
            gap              : spacers.xs,
        }),
        ...children(['.unitPrice', '.quantity'], {
            display             : 'grid',
            gridTemplateColumns : 'subgrid',
            
            
            
            // children:
            ...children('.label', {
                // spacings:
                marginInlineEnd : spacers.sm,
                
                
                
                // typos:
                textAlign       : 'end',   // right_most
            }),
            ...children('.value', {
                ...rule(':not(.control)', {
                    // typos:
                    textAlign   : 'start', // left_most
                }),
                ...rule('.control', {
                    justifySelf : 'start',
                }),
            }),
        }),
        ...children('.unitPrice', {
            // positions:
            gridArea    : 'labelUnitPrice/labelUnitPrice / unitPrice/unitPrice',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // typos:
            fontWeight  : typos.fontWeightLight,
        }),
        ...children('.quantity', {
            // positions:
            gridArea    : 'labelQuantity/labelQuantity / quantity/quantity',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // children:
            ...children('.label', {
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
        // sizes:
        contain           : 'inline-size',
        // spacings:
        marginBlockStart  : 'auto', // place to very bottom
        
        
        
        // typos:
        fontSize          : typos.fontSizeMd,
        textAlign         : 'center',
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
    
    scope('viewOutOfStockTitle', {
        // typos:
        textAlign  : 'center',
        fontWeight : typos.fontWeightSemibold,
    }),
    scope('viewOutOfStockItem', {
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"image   " max-content',
            '"title   " max-content',
            '"variants" max-content',
            '"info    " max-content',
            '"action  " max-content',
            '/',
            `1fr`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate : [[
                '"image    title" max-content',
                '"image variants" max-content',
                '"image     info" max-content',
                '"image   action" max-content',
                '"image ........" max-content',
                '/',
                `min-content auto`,
            ]],
        }),
        
        
        
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
            
            
            
            // spacings:
            ...ifScreenWidthAtLeast('sm', {
                marginInlineEnd : spacers.default,
            }),
            
            
            
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
        ...children('.variants', {
            // positions:
            gridArea        : 'variants',
            justifySelf     : 'center',  // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // fill the entire gridArea
            }),
            
            
            
            // layouts:
            display          : 'flex',
            flexWrap         : 'wrap',   // wrap excess variant items
            
            
            
            // spacings:
            margin           : 0,
            gap              : spacers.xs,
        }),
        ...children('.info', {
            // positions:
            gridArea    : 'info',
        }),
        ...children('.action', {
            // positions:
            gridArea    : 'action',
        }),
    }, {specificityWeight: 2}),
];
