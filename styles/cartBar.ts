import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { typos } from "@reusable-ui/core";



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
    }),
    scopeOf('cartTitle', {
        textAlign: 'center',
        fontSize: typos.fontSizeLg,
    }),
    scopeOf('productEntry', {
        display: 'grid',
        gridTemplate: [[
            '"image    title" max-content',
            '"image quantity" max-content',
            '"image subPrice" max-content',
            '/',
            `${imageSize}px max-content`,
        ]],
        gapInline: '2rem',
        gapBlock: '0.5rem',
        ...descendants('.currencyBlock', {
            display: 'flex',
        }),
        ...descendants('.currency', {
            marginInlineStart: 'auto',
        }),
        ...children('figure', {
            gridArea: 'image',
            alignSelf: 'center',
            
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: `${imageSize}px`,
            aspectRatio: '1/1',
            background: 'white',
            overflow: 'hidden',
            ...children(['img', '.img'], {
                objectFit: 'contain',
                transition: [
                    ['scale', '300ms'],
                ],
                fontSize: '2rem',
            }),
        }),
        ...children('.title', {
            gridArea: 'title',
            
            margin: 0,
            maxInlineSize: '15em',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }),
        ...children('.quantity', {
            gridArea: 'quantity',
            
            justifySelf: 'start',
        }),
        ...children('.subPrice', {
            gridArea: 'subPrice',
            
            fontSize: typos.fontSizeSm,
            margin: 0,
        }),
    }),
    scopeOf('shippingInfo', {
        fontSize: typos.fontSizeMd,
        marginBlockStart: 'auto',
    }),
];