import { commerces } from "@/config";
import { children, descendants, scope } from "@cssfn/core";
import { horzRules, ifScreenWidthAtLeast, typos } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => [
    scope('cartWindow', {
    }),
    scope('cartListTitle', {
        margin: 0,
    }),
    scope('cartBody', {
        display: 'flex',
        flexDirection: 'column',
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
        ...descendants('.currencyBlock', {
            // layouts:
            display: 'flex',
        }),
        ...descendants('.currency', {
            // spacings:
            marginInlineStart: 'auto',
        }),
        ...children('.prodImg', {
            // positions:
            gridArea    : 'image',
            alignSelf   : 'center',
            
            
            
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
            gridArea: 'title',
            
            
            
            // sizes:
            // maxInlineSize: '15em',
            
            
            
            // spacings:
            margin: 0,
            
            
            
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
            justifySelf : 'start',
            
            
            
            // spacings:
            margin      : 0,
            
            
            
            // typos:
            fontSize    : typos.fontSizeSm,
            fontWeight  : typos.fontWeightLight,
        }),
        ...children('.quantity', {
            // positions:
            gridArea    : 'quantity',
            justifySelf : 'start',
        }),
        ...children('.subPrice', {
            // positions:
            gridArea    : 'subPrice',
            justifySelf : 'end',
            
            
            
            // spacings:
            margin: 0,
        }),
    }, {specificityWeight: 2}),
    
    scope('shippingInfo', {
        fontSize: typos.fontSizeMd,
        marginBlockStart: 'auto',
    }),
];