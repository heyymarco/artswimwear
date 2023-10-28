import { children, descendants, fallback, rule, scope, style } from "@cssfn/core";
import { ifScreenWidthAtLeast, usesBorder, usesPadding } from "@reusable-ui/core";



const descriptionLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule } = usesBorder({ borderWidth: '0px', borderRadius: '0px' });
    const {paddingRule} = usesPadding({ paddingInline: '0px', paddingBlock: '0px' });
    
    
    
    return style({
        ...style({
            gridArea: 'desc',
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};
const minImageSize = 255;  // 255px
// const gapImage     = 4*16; // 4rem
// const maxImageSize = (minImageSize * 2) - (gapImage * 1.5);
export default () => [
    scope('prodDtl', {
        ...children('article', {
            display: 'grid',
            
            boxSizing: 'border-box',
            // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallback({
                minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallback({
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
            ...descendants('figure', {
                display        : 'flex',
                justifyContent : 'center',
                alignItems     : 'center',
                width          : '100%',
                height         : '100%',
            }, { specificityWeight: 2 }),
            
            
            ...children('article', {
                display: 'grid',
                gridTemplate: [[
                    '"nav" auto',
                    '"images" 25rem',
                    '"addToCart" auto',
                    '"desc" auto',
                    '/',
                    '1fr',
                ]],
                ...ifScreenWidthAtLeast('lg', {
                    gridTemplate: [[
                        '"nav          nav" auto',
                        '"images addToCart" 25rem',
                        '"desc        desc" auto',
                        '/',
                        '3fr     2fr',
                    ]],
                }),
                gapInline: '4rem',
                gapBlock: '2rem',
                ...children('.images', {
                    gridArea: 'images',
                    ...children('.slides', {
                        height: '100%',
                        ...children('ul>li>figure', {
                            background: 'white',
                            
                            ...children(['&', 'img'], {
                                objectFit: 'contain',
                            }),
                        }),
                    }),
                }),
                ...children('.addToCart', {
                    gridArea: 'addToCart',
                    ...descendants('.ctrlQty', {
                        display: 'flex',
                        width: 'max-content',
                    }),
                    ...descendants('.ctrlAction', {
                        width: 'fill-available',
                        ...fallback({
                            width: '-webkit-fill-available',
                        }),
                        ...fallback({
                            width: '100%',
                        }),
                    }),
                }),
                ...children('.desc', descriptionLayout()),
            }),
        }),
    }),
];