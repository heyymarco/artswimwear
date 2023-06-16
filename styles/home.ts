import { children, descendants, fallback, scope } from "@cssfn/core";
import { ifScreenWidthAtLeast } from "@reusable-ui/core";



export default () => [
    scope('hero', {
        ...children('article', {
            display: 'grid',
            justifyContent: 'stretch',
            alignItems: 'center',
            
            boxSizing: 'border-box',
            // height: `calc(100svh - var(--site-header))`,
            ...fallback({
                height: `calc(100dvh - var(--site-header))`,
            }),
            ...fallback({
                height: `calc(100vh  - var(--site-header))`,
            }),
            
            
            
            ...children('.slides', {
                // height: `calc(100svh  - var(--site-header) - var(--site-footer))`,
                ...fallback({
                    height: `calc(100dvh  - var(--site-header) - var(--site-footer))`,
                }),
                ...fallback({
                    height: `calc(100vh  - var(--site-header) - var(--site-footer))`,
                }),
                ...children('ul>li>figure', {
                    background: 'white',
                    
                    inlineSize : '100%',
                    blockSize  : '100%',
                }),
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
    scope('story', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '3rem',
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
    scope('fabrics', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '3rem',
            }),
        }),
    }),
    scope('howWorks', {
        ...children('article', {
            ...descendants('.how-work-item', {
                display: 'flex',
                flexDirection: 'column',
                ...ifScreenWidthAtLeast('md', {
                    flexDirection: 'row',
                }),
                alignItems: 'center',
                gap: '2rem',
                ...children('.illus', {
                    flex: [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's height
                    
                    width: 'min(200px, 100%)',
                    ...children('img', {
                        objectFit: 'cover',
                    }),
                }),
            }),
        }),
    }),
    scope('regeneration', {
        ...children('article', {
            ...children(['h1', 'h2'], {
                fontSize: '2rem',
            }),
            ...descendants('.illus.fill-self', {
                ...children('img', {
                    objectFit: 'contain',
                    width: ['min(350px, 100%)', '!important'],
                }),
                
                background: 'transparent',
                marginBlockEnd: '3rem',
            }),
        }),
    }),
    scope('ethic', {
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            ...children(['h1', 'h2'], {
                fontSize: '2.5rem',
            }),
            ...children('.paragraphs', {
                columns: 1,
                ...ifScreenWidthAtLeast('md', {
                    columns: 2,
                }),
                marginBlockEnd: '3rem',
            }),
            ...descendants('.illus.fill', {
                ...children('img', {
                    objectFit: 'cover',
                }),
            }),
        }),
    }),
    scope('community', {
        ...children('article', {
            display: 'flex',
            flexDirection: 'column',
            ...children(['h1', 'h2'], {
                fontSize: '3rem',
            }),
            ...descendants('.illus.fill', {
                ...children('img', {
                    objectFit: 'cover',
                }),
            }),
        }),
    }),
];