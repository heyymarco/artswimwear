// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    scope,
}                           from '@cssfn/core'   

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // a typography management system:
    typos,
    horzRules,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// configs:
import {
    commerces,
}                           from '@/config'



const imageSize = 64;  // 64px
export default () => [
    scope('cartWindow', {
    }),
    scope('cartListTitle', {
        margin: 0,
    }),
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
    
    scope('cartList', {
    }, {specificityWeight: 2}),
    scope('cartTitle', {
        textAlign: 'center',
        fontSize: typos.fontSizeLg,
    }, {specificityWeight: 2}),
    
    scope('productList', {
        // children:
        ...children('*', { // <li>
            // appearances:
            borderColor : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`,
        }),
    }),
    scope('productPreview', {
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
            // maxInlineSize: '15em',
            
            
            
            // typos:
            whiteSpace   : 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            overflow     : 'hidden',
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
        }),
        ...children('.subPrice', {
            // positions:
            gridArea    : 'subPrice',
            justifySelf : 'end',
        }),
    }, {specificityWeight: 2}),
    
    scope('shippingInfo', {
        fontSize: typos.fontSizeMd,
        marginBlockStart: 'auto',
    }),
];