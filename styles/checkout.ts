import { children, descendants, fallbacks, rule, scopeOf } from "@cssfn/core";
import { containers } from "@reusable-ui/components";
import { ifScreenWidthAtLeast, ifScreenWidthBetween, ifScreenWidthSmallerThan, typos, usesGroupable, usesPadding } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => {
    const {paddingVars  } = usesPadding();
    const {groupableVars} = usesGroupable();
    
    
    
    return [
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
                '"progressCheckout" auto',
                '"orderSummary    " auto',
                '"currentStep     " auto',
                '"navCheckout     " auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate: [[
                    '"progressCheckout vertLine orderSummary" auto',
                    '"currentStep      vertLine orderSummary" auto',
                    '"navCheckout      vertLine orderSummary" auto',
                    '/',
                    '1fr min-content 1fr'
                ]],
            }),
            ...ifScreenWidthAtLeast('xl', {
                gridTemplateColumns: '3fr min-content 2fr',
            }),
            gapInline: `calc(${containers.paddingInline} / 2)`,
            gapBlock : containers.paddingBlock,
            alignContent: 'start',
            boxSizing: 'border-box',
            minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallbacks({
                minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallbacks({
                minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),
            ...children('section', {
                ...children(['&', 'article'], {
                    [paddingVars.paddingInline] : '0px !important',
                    [paddingVars.paddingBlock ] : '0px !important',
                }),
            }),
            ...children('aside', {
                ...ifScreenWidthSmallerThan('lg', {
                    marginInline: `calc(0px - ${groupableVars.paddingInline})`,
                }),
                ...ifScreenWidthAtLeast('lg', {
                    ...children(['&', 'article'], {
                        [paddingVars.paddingInline] : '0px !important',
                        // [paddingVars.paddingBlock ] : '0px !important',
                    }),
                }),
            }),
        }),
        scopeOf('progressCheckout', {
            gridArea: 'progressCheckout',
            
            ...ifScreenWidthSmallerThan('lg', {
                marginInline  : `calc(0px - ${containers.paddingInline})`,
                marginBlock   : `calc(0px - ${containers.paddingBlock })`,
                paddingInline : containers.paddingInline,
                paddingBlock  : containers.paddingBlock,
            }),
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px !important',
                [paddingVars.paddingBlock ] : '0px !important',
            }),
        }),
        scopeOf('currentStepLayout', {
            gridArea: 'currentStep',
            
            ...children(['section', 'aside'], {
                ...children(['&', 'article'], {
                    [paddingVars.paddingInline] : '0px !important',
                    [paddingVars.paddingBlock ] : '0px !important',
                }),
            }),
        }),
        
        scopeOf('orderSummary', {
            gridArea: 'orderSummary',
            
            ...ifScreenWidthSmallerThan('lg', {
                [paddingVars.paddingInline] : containers.paddingInline,
                [paddingVars.paddingBlock ] : containers.paddingBlock,
            }),
            
            ...descendants('.currencyBlock', {
                display: 'flex',
            }),
            ...descendants('.currency', {
                
                marginInlineStart: 'auto',
                fontSize: typos.fontSizeMd,
                fontWeight: typos.fontWeightSemibold,
            }),
            ...children('article', {
                ...children('.orderCollapse', {
                    ...children('[role="button"]', {
                        textAlign: 'center',
                        fontSize: typos.fontSizeLg,
                    }),
                }),
                ...descendants(['.orderList'], {
                    gap: '0.5rem',
                }),
            }),
        }, {specificityWeight: 2}),
        scopeOf('productEntry', {
            gridArea: 'orderSummary',
            
            display: 'grid',
            gridTemplate: [[
                '"image    title" max-content',
                '"image subPrice" max-content',
                '/',
                `${imageSize}px auto`,
            ]],
            gapInline: '1rem',
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
                whiteSpace: 'normal',
                textOverflow: 'ellipsis',
                // overflow: 'hidden',
            }),
            ...children('.subPrice', {
                gridArea: 'subPrice',
                
                margin: 0,
            }),
        }),
        
        scopeOf('review', {
        }),
        scopeOf('checkout', {
            display: 'flex',
            flexDirection: 'column',
        }),
        scopeOf('expressCheckout', {
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px !important',
                [paddingVars.paddingBlock ] : '0px !important',
            }),
        }),
        scopeOf('checkoutAlt', {
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
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px !important',
                [paddingVars.paddingBlock ] : '0px !important',
            }),
            ...children('article', {
                ...children('section', {
                    ...children(['&', 'article'], {
                        [paddingVars.paddingInline] : `calc(${containers.paddingInline} / 2)`,
                        [paddingVars.paddingBlock ] : `calc(${containers.paddingBlock } / 2)`,
                    }),
                }),
                
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
                        ...ifScreenWidthAtLeast('sm', {
                            ...children(['.firstName', '.lastName'], {
                                gridColumnEnd: 'span 3',
                            }),
                        }),
                        ...ifScreenWidthAtLeast('lg', {
                            ...children(['.zone', '.zip'], {
                                gridColumnEnd: 'span 3',
                            }),
                        }),
                        ...ifScreenWidthAtLeast('xl', {
                            ...children(['.city', '.zone', '.zip'], {
                                gridColumnEnd: 'span 2',
                            }),
                        }),
                        ...children('.hidden', {
                            position: 'absolute',
                        }),
                    }),
                }),
            }),
        }),
        scopeOf('shipping', {
        }),
        
        scopeOf('navCheckout', {
            gridArea: 'navCheckout',
            
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px !important',
                [paddingVars.paddingBlock ] : '0px !important',
            }),
            
            ...children('article', {
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'stretch',
                gap: '1rem',
                
                ...ifScreenWidthAtLeast('sm', {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }),
                ...ifScreenWidthBetween('lg', 'lg', {
                    flexDirection: 'column-reverse',
                    alignItems: 'stretch',
                    gap: '1rem',
                }),
            }),
        }),
        
        scopeOf('vertLine', {
            gridArea: 'vertLine',
            
            writingMode: 'vertical-lr',
            margin: 0,
            
            ...ifScreenWidthSmallerThan('lg', {
                display: 'none',
            }),
        }),
    ];
};