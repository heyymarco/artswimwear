// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    descendants,
    children,
    scope,
    
    
    
    // strongly typed of css variables:
    switchOf,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    ifScreenWidthBetween,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    basics,
    
    
    
    // base-content-components:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export default () => {
    // dependencies:
    
    // features:
    const {borderVars    } = usesBorder();
    const {paddingVars   } = usesPadding();
    
    // capabilities:
    const {groupableVars } = usesGroupable();
    
    
    
    return [
        scope('data', {
            whiteSpace : 'normal',
            wordBreak  : 'break-all',
        }),
        
        scope('blankSection', {
            // sizes:
            boxSizing: 'border-box',
            // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallback({
                minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallback({
                minHeight: `calc(100vh  - var(--site-header) - var(--site-footer))`,
            }),
        }),
        
        scope('layout', {
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
                    '8fr min-content 4fr'
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
            // minHeight:     `calc(100svh - var(--site-header) - var(--site-footer))`,
            ...fallback({
                minHeight: `calc(100dvh - var(--site-header) - var(--site-footer))`,
            }),
            ...fallback({
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
        }, {specificityWeight: 2}),
        scope('progressCheckout', {
            gridArea: 'progressCheckout',
            
            ...ifScreenWidthSmallerThan('lg', {
                marginInline       : `calc(0px - ${containers.paddingInline})`,
                marginBlockStart   : `calc(0px - ${containers.paddingBlock})`,
                marginBlockEnd     : `calc(0px - ${containers.paddingBlockMd})`,
                ...ifScreenWidthSmallerThan('sm', {
                    marginBlockEnd : `calc(0px - ${containers.paddingBlockSm})`,
                }),
                paddingInline      : containers.paddingInline,
                paddingBlock       : containers.paddingBlock,
                ...ifScreenWidthSmallerThan('sm', {
                    paddingBlock   : containers.paddingBlockSm,
                }),
            }),
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('currentStepLayout', {
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
        }, {specificityWeight: 2}),
        
        scope('orderSummary', {
            gridArea: 'orderSummary',
            
            ...children(['&', 'article'], {
                [paddingVars.paddingBlock ] : '0px',
                ...ifScreenWidthSmallerThan('lg', {
                    [paddingVars.paddingInline] : containers.paddingInline,
                    [paddingVars.paddingBlock ] : containers.paddingBlock,
                }),
            }),
            ...children('article', {
                // layouts:
                display       : 'flex',
                flexDirection : 'column',
                
                
                
                // spacings:
                gap : spacers.sm,
                
                
                
                ...descendants('.currencyBlock', {
                    // layouts:
                    display: 'flex',
                    
                    
                    
                    // specifics:
                    ...rule('.totalCost', {
                        ...descendants(['&', '.currency'], {
                            // typos:
                            fontSize   : typos.fontSizeLg,
                            fontWeight : typos.fontWeightSemibold,
                        }),
                    })
                }),
                ...descendants('.currency', {
                    // spacings:
                    marginInlineStart: 'auto',
                    
                    
                    
                    // typos:
                    fontSize   : typos.fontSizeMd,
                    fontWeight : typos.fontWeightSemibold,
                }),
                ...descendants(['.title', '.unitPrice', '.currencyBlock', '.quantity', 'hr'], {
                    // spacings:
                    margin: '0px',
                }),
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
        
        scope('info', {
            ...children('article', {
                display: 'flex',
                flexDirection: 'column',
                gap: spacers.default,
            }),
        }),
        scope('tableDataComposite', {
            alignItems         : 'center', // center the each item vertically
            justifyItems       : 'center', // center the each item horizontally
            
            gridAutoFlow       : 'row',    // stack the items horizontally
            ...ifScreenWidthAtLeast('sm', {
                gridAutoFlow   : 'column', // stack the items vertically
            }),
            
            
            
            // spacings:
            gap                : spacers.sm,
            
            
            
            // children:
            ...children('.paymentProvider', {
                // sizes:
                width           : 'auto',
                height          : '26px',
                
                
                
                // backgrounds:
                backgroundColor : 'white',
                
                
                
                // borders:
                border          : borderVars.border,
                borderWidth     : borders.defaultWidth,
                borderRadius    : borderRadiuses.sm,
                
                
                
                // spacings:
                padding         : spacers.xs,
            }),
            ...children(['.customerName', '.shippingEstimate', '.paymentIdentifier'], {
                // typos:
                fontSize       : typos.fontSizeSm,
                fontWeight     : typos.fontWeightNormal,
            }),
        }, {specificityWeight: 2}),
        scope('tableDataAddress', {
            // layouts:
            display : 'block', // paragraph friendly
            
            
            
            // typos:
            textAlign     : 'center',  // center    the text horizontally
            ...ifScreenWidthAtLeast('sm', {
                textAlign : 'start',   // left_most the text horizontally
            }),
        }, {specificityWeight: 2}),
        
        scope('checkout', {
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
        }, {specificityWeight: 2}),
        scope('expressCheckout', { // TODO: implement
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('checkoutAlt', { // TODO: implement
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
        scope('regularCheckout', {
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
        }, {specificityWeight: 2}),
        scope('address', {
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
        scope('payment', {
            display: 'flex',
            flexDirection: 'column',
            
            // decrease indent on sub section(s):
            ...children('article', {
                display: 'flex',
                flexDirection: 'column',
                gapBlock: containers.paddingBlockMd,
                
                ...children(['&', '.collapse'], {
                    ...children('section', {
                        ...children(['&', 'article'], {
                            [paddingVars.paddingInline] : '0px',
                            [paddingVars.paddingBlock ] : '0px',
                        }),
                    }),
                }),
            }),
        }, {specificityWeight: 2}),
        scope('optionEntryHeader', {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            ...children(['.name', '.estimate', '.cost', '.icon'], {
                flex: '0 0 auto',
                margin: 0,
            }),
            ...children('.name', {
                textAlign  : 'start',
                fontSize   : typos.fontSizeMd,
                fontWeight : typos.fontWeightSemibold,
            }),
            ...children(['.estimate'], {
                // typos:
                fontSize   : typos.fontSizeSm,
                fontWeight : typos.fontWeightNormal,
            }),
            ...children(['.cost', '.icon'], {
                textAlign: 'end',
            }),
            ...children(['.cost'], {
                flex: '1 1 auto',
            }),
        }, {specificityWeight: 2}),
        scope('billingEntry', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('paymentEntryCard', {
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
        scope('paymentEntryPaypal', {
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
        scope('paymentEntryPaymentButton', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
                display: 'grid',
                gridAutoFlow: 'row',
                gap: spacers.default,
                ...children('p', {
                    margin: 0,
                }),
            }),
        }, {specificityWeight: 2}),
        scope('paymentEntryManual', {
            [paddingVars.paddingInline] : '1rem',
            [paddingVars.paddingBlock ] : '1rem',
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('paymentFinish', {
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
        }, {specificityWeight: 2}),
        
        scope('navCheckout', {
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
        }, {specificityWeight: 2}),
        
        scope('vertLine', {
            gridArea: 'vertLine',
            
            writingMode: 'vertical-lr',
            margin: 0,
            
            ...ifScreenWidthSmallerThan('lg', {
                display: 'none',
            }),
        }),
        
        scope('captchaDialogBody', {
            // layouts:
            display      : 'grid',
            justifyItems : 'center',
            alignItems   : 'center',
            
            
            
            // sizes:
            boxSizing     : 'content-box',
            minInlineSize : '304px', // the width  of google captcha
            minBlockSize  : '78px',  // the height of google captcha
            
            
            
            // children:
            ...children('*', {
                gridArea: '1 / 1 / -1 / -1',
            }),
            ...children('.loading', {
                fontSize: '3rem',
            }),
            ...children('.error', {
                justifySelf  : 'stretch',
                alignSelf    : 'stretch',
                
                [groupableVars.paddingInline]: 'inherit !important',
                [groupableVars.paddingBlock ]: 'inherit !important',
                marginInline : `calc(0px - ${groupableVars.paddingInline})`,
                marginBlock  : `calc(0px - ${groupableVars.paddingBlock })`,
            }, {specificityWeight: 2}),
        }, {specificityWeight: 2}),
    ];
};
