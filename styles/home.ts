import { children, descendants, fallbacks, scopeOf } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";

export default () => [
    scopeOf('hero', {
        ...children('article', {
            display: 'grid',
            justifyContent: 'stretch',
            alignItems: 'center',
            
            // backgroundImage: `url('/banners/cover.png')`,
            // backgroundRepeat: 'no-repeat',
            // backgroundPosition: 'center',
            // backgroundSize: 'contain',
            
            boxSizing: 'border-box',
            height: `calc(100svh - var(--site-header))`,
            ...fallbacks({
                height: `calc(100dvh - var(--site-header))`,
            }),
            ...fallbacks({
                height: `calc(100vh  - var(--site-header))`,
            }),
            
            
            
            ...children('.slides', {
                height: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),
            ...children('footer', {
                alignSelf: 'end',
                
                display: 'grid',
                gridTemplate: [[
                    '"left center right" auto',
                    '/',
                    '1fr auto 1fr'
                ]],
                padding: 0,
                blockSize: `var(--site-footer)`,
                
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                
                ...children('.scroller', {
                    gridArea: 'center',
                }),
                ...children('.hint', {
                    gridArea: 'right',
                    justifySelf: 'start',
                }),
            })
        }),
    }),
    scopeOf('features', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '4rem',
            }),
            ...children('.figures', {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '4rem',
                ...children('figure', {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    ...children('img', {
                        clipPath: 'circle(50%)',
                    }),
                    ...children('figcaption', {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        ...children('h3', {
                            fontSize: '1.25rem',
                            margin: 0,
                        }),
                    })
                }),
            }),
        }),
    }),
    scopeOf('fabrics', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '3rem',
            }),
        }),
    }),
    scopeOf('howWorks', {
        ...children('article', {
            ...descendants('.how-work-item', {
                display: 'flex',
                flexDirection: 'column',
                ...ifScreenWidthAtLeast('md', {
                    flexDirection: 'row',
                }),
                alignItems: 'center',
                gap: '2rem',
            }),
        }),
    }),
    scopeOf('regeneration', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '3rem',
            }),
            ...descendants('.illus', {
                objectFit: 'contain',
                marginBlockEnd: '3rem',
            }),
        }),
    }),
    scopeOf('ethic', {
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            ...children(['h1', 'h2'], {
                fontSize: '4rem',
            }),
            ...children('.paragraphs', {
                columns: 2,
                marginBlockEnd: '3rem',
            }),
            ...descendants('.illus', {
                objectFit: 'cover',
            }),
        }),
    }),
    scopeOf('community', {
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            ...children(['h1', 'h2'], {
                fontSize: '4rem',
            }),
            ...descendants('.illus', {
                objectFit: 'cover',
            }),
        }),
    }),
];