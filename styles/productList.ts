import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";



const minImageSize = 255;  // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);
export default () => [
    scopeOf('list', {
        display: 'grid',
        overflow: 'hidden', // workaround for overflowing popup
        ...rule('.loading', {
            justifyContent: 'center',
            alignContent: 'center',
            
            boxSizing: 'border-box',
            height:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallbacks({
                height: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallbacks({
                height: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),
            
            ...children('[role="status"]', {
                fontSize: '4rem',
            }),
        }),
        ...rule(':not(.loading)', {
            gridTemplateColumns: `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        }),
        gap: '4rem',
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            // gap: '1rem',
            ...children('figure', {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                minWidth: `${minImageSize}px`,
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
            ...children('header', {
                padding: '0.75rem',
                ...children(['.name', '.price'], {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }),
                ...children('.price', {
                    textAlign: 'end',
                }),
            }),
            cursor: 'pointer',
            boxShadow: '0px 0px 1rem rgba(0, 0, 0, 0.1)',
            transition: [
                ['box-shadow', '300ms'],
            ],
            ...rule(':hover', {
                boxShadow: '0px 0px 1rem rgba(0, 0, 0, 0.7)',
                ...children('figure', {
                    ...children(['img', '.img'], {
                        scale: '105%',
                    }),
                }),
                ...children('header', {
                    ...children(['.name', '.price'], {
                        overflow: 'visible',
                    }),
                }),
            })
        }),
    }, { specificityWeight: 2 }),
];