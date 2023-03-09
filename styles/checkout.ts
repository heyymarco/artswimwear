import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";



const minImageSize = 255;  // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);
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
    scopeOf('expressCheckout', {
    }),
    scopeOf('regularCheckout', {
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
        ...children('article', {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }),
    }),
];