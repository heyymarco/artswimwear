import { children, descendants, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast, typos } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => [
    scopeOf('cartWindow', {
    }),
    scopeOf('cartListTitle', {
        margin: 0,
    }),
    scopeOf('cartBody', {
        display: 'flex',
        flexDirection: 'column',
    }, {specificityWeight: 3}),
    
    scopeOf('cartList', {
    }, {specificityWeight: 2}),
    scopeOf('cartTitle', {
        textAlign: 'center',
        fontSize: typos.fontSizeLg,
    }, {specificityWeight: 2}),
    scopeOf('productEntry', {
        display: 'grid',
        gridTemplate: [[
            '" image  " max-content',
            '" title  " max-content',
            '"quantity" max-content',
            '"subPrice" max-content',
            '/',
            `minmax(${imageSize}px, 1fr)`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate: [[
                '"image    title" max-content',
                '"image quantity" max-content',
                '"image subPrice" max-content',
                '/',
                `${imageSize}px max-content`,
            ]],
        }),
        justifyItems: 'center',
        gapInline: '1rem',
        gapBlock: '0.5rem',
        ...descendants('.currencyBlock', {
            display: 'flex',
        }),
        ...descendants('.currency', {
            marginInlineStart: 'auto',
            fontWeight: typos.fontWeightBold,
        }),
        ...children('figure', {
            gridArea: 'image',
            alignSelf: 'center',
            
            width: `${imageSize}px`,
        }),
        ...children('.title', {
            gridArea: 'title',
            
            margin: 0,
            maxInlineSize: '15em',
            whiteSpace: 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            overflow: 'hidden',
        }),
        ...children('.quantity', {
            gridArea: 'quantity',
            
            // justifySelf: 'start',
        }),
        ...children('.subPrice', {
            gridArea: 'subPrice',
            
            fontSize: typos.fontSizeSm,
            margin: 0,
        }),
    }, {specificityWeight: 2}),
    
    scopeOf('shippingInfo', {
        fontSize: typos.fontSizeMd,
        marginBlockStart: 'auto',
    }),
];