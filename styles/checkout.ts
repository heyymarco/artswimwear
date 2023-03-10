import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { containers } from "@reusable-ui/components";
import { ifScreenWidthAtLeast, typos } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => [
    scopeOf('loading', {
        ...children('article', {
            display: 'grid',
            
            boxSizing: 'border-box',
            minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallbacks({
                minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallbacks({
                minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),
            
            justifyContent: 'center',
            alignContent: 'center',
            
            ...children('[role="status"]', {
                fontSize: '4rem',
            }),
        }),
    }),
    
    
    
    scopeOf('layout', {
        display: 'grid',
        gridTemplate: [[
            '"expressCheckout vertLine orderSummary" auto',
            '"checkoutAlt     vertLine orderSummary" auto',
            '"regularCheckout vertLine orderSummary" auto',
            '"navCheckout     vertLine orderSummary" auto',
            '/',
            '3fr min-content 1fr'
        ]],
        gapInline: `calc(${containers.paddingInline} / 2)`,
        gapBlock : containers.paddingBlock,
    }),
    scopeOf('orderSummary', {
        gridArea: 'orderSummary',
        
        ...descendants('.currencyBlock', {
            display: 'flex',
        }),
        ...descendants('.currency', {
            
            marginInlineStart: 'auto',
            fontSize: typos.fontSizeMd,
            fontWeight: typos.fontWeightSemibold,
        }),
        ...children('article', {
            ...children(['ul', 'ol'], {
                gap: '0.5rem',
            }),
        }),
    }),
    scopeOf('productEntry', {
        gridArea: 'orderSummary',
        
        display: 'grid',
        gridTemplate: [[
            '"image    title" max-content',
            '"image subPrice" max-content',
            '/',
            `${imageSize}px auto`,
        ]],
        gapInline: '2rem',
        gapBlock: '0.5rem',
        padding: 0,
        ...children('figure', {
            gridArea: 'image',
            alignSelf: 'center',
            
            width: `${imageSize}px`,
        }),
        ...children('.title', {
            gridArea: 'title',
            
            fontWeight: typos.fontWeightNormal,
            margin: 0,
            // maxInlineSize: '15em',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            // overflow: 'hidden',
        }),
        ...children('.subPrice', {
            gridArea: 'subPrice',
            
            margin: 0,
        }),
    }),
    scopeOf('expressCheckout', {
        gridArea: 'expressCheckout',
    }),
    scopeOf('checkoutAlt', {
        gridArea: 'checkoutAlt',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '1rem',
        ...children('hr', {
            flex: [[1, 1]],
        }),
        ...children('span', {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }),
    }),
    scopeOf('regularCheckout', {
        gridArea: 'regularCheckout',
        
        ...children('article', {
            ...children('.contact', {
                ...children('article', {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }),
            }),
            ...children('.shipping', {
                ...children('article', {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridAutoRows: 'auto',
                    gridAutoFlow: 'row',
                    gap: '1rem',
                    
                    ...children('*', {
                        gridColumnEnd: 'span 6',
                    }),
                    ...children(['.firstName', '.lastName'], {
                        gridColumnEnd: 'span 3',
                    }),
                    ...children(['.city', '.zone', '.zip'], {
                        gridColumnEnd: 'span 2',
                    }),
                    ...children('.hidden', {
                        display: 'none',
                    }),
                }),
            }),
        }),
    }),
    scopeOf('navCheckout', {
        gridArea: 'navCheckout',
        
        ...children('article', {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }),
    }),
    scopeOf('vertLine', {
        gridArea: 'vertLine',
        
        writingMode: 'vertical-lr',
    }),
];