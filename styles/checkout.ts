import { children, descendants, fallbacks, rule, scopeOf, style, switchOf, vars } from "@cssfn/core";
import { basics, containers, iconElm, usesIcon, usesIconFontLayout } from "@reusable-ui/components";
import { borders, ifNeutralize, ifScreenWidthAtLeast, ifScreenWidthBetween, ifScreenWidthSmallerThan, markValid, themes, typos, usesBorder, usesGroupable, usesPadding, usesValidationIcon } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => {
    const {paddingVars  } = usesPadding();
    const {groupableVars} = usesGroupable();
    const {borderVars   } = usesBorder();
    
    
    
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
                    '"...........      vertLine orderSummary" auto',
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
                    [paddingVars.paddingInline] : '0px',
                    [paddingVars.paddingBlock ] : '0px',
                }),
            }),
            ...children('aside', {
                ...ifScreenWidthSmallerThan('lg', {
                    marginInline: `calc(0px - ${groupableVars.paddingInline})`,
                }),
                ...ifScreenWidthAtLeast('lg', {
                    ...children(['&', 'article'], {
                        [paddingVars.paddingInline] : '0px',
                        // [paddingVars.paddingBlock ] : '0px',
                    }),
                }),
            }),
            ...descendants('.tooltip', {
                minInlineSize: '10rem',
            })
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
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        scopeOf('currentStepLayout', {
            gridArea: 'currentStep',
            
            display: 'flex',
            flexDirection: 'column',
            gapBlock: containers.paddingBlock,
            
            ...children(['section', 'aside'], {
                ...children(['&', 'article'], {
                    [paddingVars.paddingInline] : '0px',
                    [paddingVars.paddingBlock ] : '0px',
                }),
            }),
        }),
        
        scopeOf('orderSummary', {
            gridArea: 'orderSummary',
            
            ...children(['&', 'article'], {
                [paddingVars.paddingBlock ] : '0px',
                ...ifScreenWidthSmallerThan('lg', {
                    [paddingVars.paddingInline] : containers.paddingInline,
                    [paddingVars.paddingBlock ] : containers.paddingBlock,
                }),
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
        
        scopeOf('orderReview', {
            ...descendants('table', {
                borderCollapse: 'collapse',
                tableLayout: 'auto',
                // tableLayout: 'fixed',
                border: borderVars.border,
                borderWidth: borders.defaultWidth,
                width: '100%',
                
                
                
                // ...descendants('tbody', {
                //     display: 'block',
                //     padding: '1rem',
                // }),
                ...descendants('tr', {
                    ...rule(':not(:last-child)', {
                        borderBlockEnd: borderVars.border,
                        borderBlockEndWidth: borders.defaultWidth,
                    }),
                }),
                ...descendants('td', {
                    padding: '0.75rem',
                }),
            }),
        }),
        scopeOf('checkout', {
            display: 'flex',
            flexDirection: 'column',
        }),
        scopeOf('expressCheckout', {
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
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
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
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
        scopeOf('shippingMethod', {
        }),
        scopeOf('shippingEntry', {
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            padding: '1rem',
            ...children('.indicator', {
                flex: '0 0 auto',
                ...children('input', {
                    borderColor: 'currentcolor',
                }),
            }),
            ...children(['.name', '.cost'], {
                flex: '1 1 auto',
                margin: 0,
            }),
            ...children('.name', {
                textAlign: 'start',
                fontSize: typos.fontSizeMd,
                fontWeight : typos.fontWeightSemibold,
            }),
            ...children('.cost', {
                textAlign: 'end',
            }),
        }),
        scopeOf('paymentMethod', {
        }),
        scopeOf('paymentEntryHeader', {
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            padding: '1rem',
            ...children('.indicator', {
                flex: '0 0 auto',
                ...children('input', {
                    borderColor: 'currentcolor',
                }),
            }),
            ...children(['.name', '.icon'], {
                flex: '1 1 auto',
                margin: 0,
            }),
            ...children('.name', {
                textAlign: 'start',
                fontSize: typos.fontSizeMd,
                fontWeight : typos.fontWeightSemibold,
            }),
            ...children('.icon', {
                textAlign: 'end',
            }),
        }),
        scopeOf('paymentEntryCard', {
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
            ...children('article>*', { // added * because <PayPalHostedFieldsProvider> render as <div>
                display: 'grid',
                gridTemplate: [[
                    '"number" auto',
                    '"name  " auto',
                    '"expiry" auto',
                    '"csc   " auto',
                    '"horz  " auto',
                    '"payNow" auto',
                    '/',
                    '1fr'
                ]],
                ...ifScreenWidthAtLeast('sm', {
                    gridTemplate: [[
                        '"number number" auto',
                        '"name     name" auto',
                        '"expiry    csc" auto',
                        '"horz      horz" auto',
                        '"payNow  payNow" auto',
                        '/',
                        '1fr 1fr'
                    ]],
                }),
                gap: '1rem',
                ...children('.number', {
                    gridArea: 'number',
                }),
                ...children('.name', {
                    gridArea: 'name',
                    
                    // sync the style to CardNumber, ExpirationDate, SecurityCode:
                    ...descendants('*', {
                        boxShadow: 'none !important',
                    }),
                }),
                ...children('.expiry', {
                    gridArea: 'expiry',
                }),
                ...children('.csc', {
                    gridArea: 'csc',
                }),
                ...children('.horz', {
                    gridArea: 'horz',
                    
                    margin: 0,
                }),
                ...children('.payNow', {
                    gridArea: 'payNow',
                }),
                ...descendants('.hostedField', {
                    // layouts:
                    display        : 'flex',
                    flexDirection  : 'row',
                    justifyContent : 'stretch',
                    alignItems     : 'stretch',
                    flexWrap       : 'nowrap',
                    
                    ...children(':only-child', {
                        blockSize  : `calc(1em * ${switchOf(basics.lineHeight, typos.lineHeight)})`,
                        flex           : [[1, 1, '100%']], // growable, shrinkable, initial 100% parent's width
                    }),
                })
            }),
        }),
        scopeOf('paymentEntryPaypal', {
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
                ...children('div', {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }),
            }),
        }),
        
        scopeOf('navCheckout', {
            gridArea: 'navCheckout',
            
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
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