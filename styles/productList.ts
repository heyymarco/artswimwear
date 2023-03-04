import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";



const minImageSize = 255;  // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);
export default () => [
    scopeOf('list', {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minImageSize}px, 1fr))`,
        gap: '4rem',
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            ...children('figure', {
                position: 'relative',
                minWidth: `${minImageSize}px`,
                aspectRatio: '1/1',
                background: 'white',
                overflow: 'hidden',
                ...children('img', {
                    objectFit: 'contain',
                    transition: [
                        ['scale', '300ms'],
                    ]
                }),
            }),
            ...children('header', {
                ...children(['h2', 'span'], {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }),
            }),
            cursor: 'pointer',
            ...rule(':hover', {
                ...children('figure', {
                    ...children('img', {
                        scale: '105%',
                    }),
                }),
                ...children('header', {
                    ...children(['h2', 'span'], {
                        overflow: 'visible',
                    }),
                }),
            })
        }),
    }),
];