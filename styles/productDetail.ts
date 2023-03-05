import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";



const minImageSize = 255;  // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);
export default () => [
    scopeOf('prodDtl', {
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
        }),
        ...rule('.loading', {
            ...children('article', {
                justifyContent: 'center',
                alignContent: 'center',
                
                ...children('[role="status"]', {
                    fontSize: '4rem',
                }),
            }),
        }),
        ...rule(':not(.loading)', {
            ...descendants('.img-frame', {
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...children(['img', '.img'], {
                    objectFit: 'contain',
                    fontSize: '3rem',
                })
            }, { specificityWeight: 2 }),
            
            
            ...children('article', {
                display: 'grid',
                gridTemplate: [[
                    '"images" 25rem',
                    '"addToCart" auto',
                    '"desc" auto',
                    '/',
                    '1fr',
                ]],
                ...ifScreenWidthAtLeast('lg', {
                    gridTemplate: [[
                        '"images addToCart" 25rem',
                        '"desc        desc" auto',
                        '/',
                        '3fr     2fr',
                    ]],
                }),
                gap: '4rem',
                ...children('.images', {
                    gridArea: 'images',
                    ...children('.slides', {
                        height: '100%',
                    })
                }),
                ...children('.addToCart', {
                    gridArea: 'addToCart',
                    ...descendants('.ctrlQty', {
                        display: 'flex',
                        width: 'max-content',
                    }),
                    ...descendants('.ctrlAction', {
                        width: '100%',
                    }),
                }),
                ...children('.desc', {
                    gridArea: 'desc',
                }),
            }),
        }),
    }),
];