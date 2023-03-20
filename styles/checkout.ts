import { children, descendants, fallbacks, rule, scopeOf, style, switchOf, vars } from "@cssfn/core";
import { basics, containers, iconElm, usesIcon, usesIconFontLayout } from "@reusable-ui/components";
import { borders, ifNeutralize, ifScreenWidthAtLeast, ifScreenWidthBetween, ifScreenWidthSmallerThan, markValid, themes, typos, usesBackground, usesBorder, usesGroupable, usesPadding, usesValidationIcon } from "@reusable-ui/core";



const imageSize = 64;  // 64px
export default () => {
    const {paddingVars   } = usesPadding();
    const {groupableVars } = usesGroupable();
    const {borderVars    } = usesBorder();
    const {backgroundVars} = usesBackground();
    
    
    
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
                    '9fr min-content 3fr'
                ]],
            }),
            ...ifScreenWidthAtLeast('xl', {
                gridTemplateColumns: '7fr min-content 5fr',
            }),
            gapInline: `calc(${containers.paddingInline} / 2)`,
            gapBlock : containers.paddingBlockMd,
            ...ifScreenWidthSmallerThan('sm', {
                gapBlock : containers.paddingBlockSm,
            }),
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
        }, {specificityWeight: 2}),
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
                
                ...rule('.totalCost', {
                    ...descendants(['&', '.currency'], {
                        fontSize: typos.fontSizeLg,
                        fontWeight: typos.fontWeightSemibold,
                    }),
                })
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
                textOverflow : 'ellipsis', // long text...
                wordBreak    : 'break-word',
                overflowWrap : 'break-word',
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
                
                wordBreak    : 'break-word',
                overflowWrap : 'anywhere',
                
                
                
                ...children(['thead', 'tbody'], {
                    ...children('tr', {
                        ...ifScreenWidthSmallerThan('sm', {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '1rem',
                        }),
                        ...rule(':not(:last-child)', {
                            borderBlockEnd: borderVars.border,
                            borderBlockEndWidth: borders.defaultWidth,
                        }),
                        ...children(['th', 'td'], {
                            ...ifScreenWidthSmallerThan('sm', {
                                padding: '0rem',
                            }),
                            padding: '0.75rem',
                        }),
                        ...children('th', {
                            fontWeight: typos.fontWeightSemibold,
                        }),
                    }),
                }),
                ...children('thead', {
                    ...children('tr', {
                        backgroundColor     : backgroundVars.altBackgColor,
                        borderBlockEnd      : borderVars.border,
                        borderBlockEndWidth : borders.defaultWidth,
                        ...children(['th'], {
                            textAlign: 'center',
                        }),
                    }),
                }),
                ...children('tbody', {
                    ...ifScreenWidthSmallerThan('sm', {
                        display: 'flex',
                        flexDirection: 'column',
                    }),
                    ...children('tr', {
                        ...children(['th', 'td'], {
                            textAlign: 'start',
                            ...ifScreenWidthSmallerThan('sm', {
                                textAlign: 'center',
                            }),
                        }),
                        ...children('td', {
                            ...rule('.hasIcon', {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }),
                        })
                    }),
                }),
            }),
        }),
        scopeOf('checkout', {
            display: 'flex',
            flexDirection: 'column',
            
            // decrease indent on sub section(s):
            ...children('article', {
                ...children('section', {
                    ...children('article', {
                        ...children('section', {
                            ...children(['&', 'article'], {
                                [paddingVars.paddingInline] : `calc(${containers.paddingInline} / 2)`,
                                [paddingVars.paddingBlock ] : `calc(${containers.paddingBlock } / 2)`,
                            }),
                        }),
                    }),
                }),
            }),
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
                // decrease indent:
                // ...children('section', {
                //     ...children(['&', 'article'], {
                //         [paddingVars.paddingInline] : `calc(${containers.paddingInline} / 2)`,
                //         [paddingVars.paddingBlock ] : `calc(${containers.paddingBlock } / 2)`,
                //     }),
                // }),
                
                ...children('.contact', {
                    ...children('article', {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
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
        scopeOf('address', {
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
            }),
        }),
        scopeOf('payment', {
            display: 'flex',
            flexDirection: 'column',
            
            // decrease indent on sub section(s):
            ...children('article', {
                display: 'flex',
                flexDirection: 'column',
                gapBlock: containers.paddingBlockMd,
                
                ...children(['section', 'aside'], {
                    ...children(['&', 'article'], {
                        [paddingVars.paddingInline] : '0px',
                        [paddingVars.paddingBlock ] : '0px',
                    }),
                }),
            }),
        }),
        scopeOf('paymentMethod', {
        }),
        scopeOf('optionEntryHeader', {
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
        }, {specificityWeight: 2}),
        scopeOf('billingEntry', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scopeOf('paymentEntryCard', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
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
                    // '"horz  " auto',
                    // '"payNow" auto',
                    '/',
                    '1fr'
                ]],
                ...ifScreenWidthAtLeast('md', {
                    gridTemplate: [[
                        '"number number" auto',
                        '"name     name" auto',
                        '"expiry    csc" auto',
                        // '"horz      horz" auto',
                        // '"payNow  payNow" auto',
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
                }),
                ...children('.expiry', {
                    gridArea: 'expiry',
                }),
                ...children('.csc', {
                    gridArea: 'csc',
                }),
                // ...children('.horz', {
                //     gridArea: 'horz',
                    
                //     margin: 0,
                // }),
                // ...children('.payNow', {
                //     gridArea: 'payNow',
                // }),
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
        }, {specificityWeight: 2}),
        scopeOf('paymentEntryPaypal', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
            ...children('article', {
                ...children('div', {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }),
            }),
        }, {specificityWeight: 2}),
        
        scopeOf('navCheckout', {
            gridArea: 'navCheckout',
            
            paddingBlockEnd : containers.paddingBlockMd,
            
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
                
                ...children('p', {
                    margin: 0,
                    textAlign: 'center',
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