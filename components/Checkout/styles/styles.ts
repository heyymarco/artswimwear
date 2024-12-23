// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    descendants,
    children,
    scope,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // configs:
    secondaries,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    ifScreenWidthBetween,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export default () => {
    // dependencies:
    
    // features:
    const {paddingVars  } = usesPadding();
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    
    
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
                '"currentStep     " 1fr', // the biggest part
                '"navCheckout     " auto',
                '/',
                '1fr'
            ]],
            ...ifScreenWidthAtLeast('lg', {
                gridTemplate: [[
                    '"progressCheckout vertLine orderSummary" auto',
                    '"currentStep      vertLine orderSummary" 1fr', // the biggest part
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
            
            // take over <parent> margin and restore <parent> padding when the screen below 'lg':
            ...ifScreenWidthSmallerThan('lg', {
                marginInline       : `calc(0px - ${containers.paddingInline})`,  // cancel out parent's padding with negative margin
                marginBlockStart   : `calc(0px - ${containers.paddingBlock})`,   // cancel out parent's padding with negative margin
                marginBlockEnd     : `calc(0px - ${containers.paddingBlockMd})`, // an adjustment between `progressCheckout` and `currentStepLayout`
                ...ifScreenWidthSmallerThan('sm', {
                    marginBlockEnd : `calc(0px - ${containers.paddingBlockSm})`, // an adjustment between `progressCheckout` and `currentStepLayout`
                }),
                paddingInline      : containers.paddingInline,                   // restore parent's padding with positive margin
                paddingBlock       : containers.paddingBlock,                    // restore parent's padding with positive margin
                ...ifScreenWidthSmallerThan('sm', {
                    paddingBlock   : containers.paddingBlockSm,                  // an adjustment of vertical padding
                }),
            }),
            
            // remove <section>'s and <article>'s padding to follow <container>'s padding:
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }, {specificityWeight: 2}),
        scope('currentStepLayout', {
            gridArea: 'currentStep',
            
            display: 'grid',
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
            // layouts:
            alignItems         : 'center', // center the each item vertically   (desktop mode)
            justifyItems       : 'center', // center the each item horizontally (mobile mode)
            gridAutoFlow       : 'row',    // stack the items vertically        (mobile mode)
            ...ifScreenWidthAtLeast('sm', {
                gridAutoFlow   : 'column', // stack the items horizontally      (desktop mode)
            }),
            
            
            
            // spacings:
            gap                : spacers.sm,
            
            
            
            // children:
            ...children(['.customerName', '.eta'], {
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
        
        scope('accountSection', {
            [paddingVars.paddingInline] : spacers.lg,
            [paddingVars.paddingBlock ] : spacers.md,
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        scope('editGuestSection', {
            // layouts:
            display: 'grid',
            
            
            
            // spacings:
            gap: '1rem',
        }),
        scope('signInCustomerSection', {
            // layouts:
            display: 'grid',
            gridAutoFlow: 'row',
            ...ifScreenWidthAtLeast('md', {
                gridAutoFlow: 'column',
                ...rule(':has(>:nth-child(2))', {
                    gridTemplateColumns : '3fr 2fr',
                }),
            }),
            justifyItems: 'center', // center items horizontally
            ...children(':first-child', {
                justifySelf: 'stretch',
            }),
            
            
            
            // spacings:
            gapInline : spacers.xl,
            gapBlock  : spacers.md,
        }),
        scope('signInCustomerInfo', {
            // layouts:
            display: 'grid',
            
            
            
            // spacings:
            gap: spacers.sm,
        }),
        scope('signInCustomerInfoText', {
            // typos:
            textAlign: 'center',
        }),
        scope('subscribeSection', {
            [paddingVars.paddingInline] : spacers.lg,
            [paddingVars.paddingBlock ] : spacers.md,
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        scope('selectShipping', {
            // layouts:
            display                         : 'grid',
            
            // narrow screen: without eta:
            gridTemplateColumns             : '[decor-start] max-content [decor-end label-start] 1fr [label-end currency-start] max-content [currency-end amount-start] max-content [amount-end]',
            ...ifScreenWidthAtLeast('sm', {
                // wide screen: with eta:
                gridTemplateColumns         : '[decor-start] max-content [decor-end label-start] 1fr [label-end eta-start] max-content [eta-end currency-start] max-content [currency-end amount-start] max-content [amount-end]',
            }),
            
            
            
            // children:
            ...children('li', {
                // children:
                ...children('&', {
                    gridRowEnd              : 'span 2',
                }),
                ...children(['&', ':first-child'], { // <li> & <ListItem>
                    // positions:
                    gridColumn              : '1 / -1',
                    
                    
                    
                    // layouts:
                    display                 : 'grid',
                    gridTemplateColumns     : 'subgrid',
                }),
                ...children([':first-child'], { // <ListItem>
                    // layouts:
                    gridTemplateRows        : '[row1-start] max-content [row1-end row2-start] max-content [row2-end]',
                    
                    
                    
                    // spacings:
                    columnGap               : spacers.md,
                    rowGap                  : spacers.xxs,
                    padding                 : spacers.md,
                }),
                ...children(':first-child', { // <ListItem>
                    // layouts:
                    alignItems              : 'center', // center vertically
                    
                    
                    
                    // children:
                    // ...children('*', {
                    //     gridRow             : 'row1-start / row2-end',
                    // }),
                    ...children('[role="radio"]', {
                        // positions:
                        gridArea            : 'row1-start / decor-start / row2-end / decor-end',
                    }),
                    ...children('.label', {
                        // positions:
                        gridArea            : 'row1-start / label-start / row1-end / label-end',
                        ...ifScreenWidthAtLeast('sm', {
                            gridArea        : 'row1-start / label-start / row2-end / label-end',
                        }),
                    }),
                    ...children('.eta', {
                        // positions:
                        gridArea            : 'row2-start / label-start / row2-end / label-end',
                        ...ifScreenWidthAtLeast('sm', {
                            gridArea        : 'row1-start / eta-start / row2-end / eta-end',
                        }),
                    }),
                    ...children('.cost', {
                        // positions:
                        alignSelf: 'center',
                        gridArea            : 'row1-start / currency-start / row2-end / amount-end',
                        
                        
                        
                        // layouts:
                        ...rule('.ready', {
                            display             : 'grid',
                            gridTemplateColumns : 'subgrid',
                            ...children('.currencySign', {
                                // customize:
                                ...usesCssProps(secondaries),
                            }),
                        }),
                        
                        
                        
                        // spacings:
                        ...rule('.ready', {
                            gap                 : 'inherit',
                        }),
                        
                        
                        
                        // typos:
                        whiteSpace          : 'nowrap',
                        textAlign           : 'end',
                    }),
                }),
            }),
        }, {specificityWeight: 3}),
        scope('selectBilling', {
            // layouts:
            display                         : 'grid',
            gridTemplateColumns             : '[decor-start] max-content [decor-end label-start] max-content [label-end] 1fr',
            
            
            
            // children:
            ...children('li', {
                // children:
                ...children(['&', ':first-child', ':not(:first-child)'], { // <li>, <AccordionHeader>, <AccordionBody>
                    // positions:
                    gridColumn          : '1 / -1',
                }),
                ...children([':first-child', ':not(:first-child)'], { // <AccordionHeader>, <AccordionBody>
                    // spacings:
                    gap                 : spacers.sm,
                    paddingInline       : spacers.md,
                    paddingBlock        : `calc((${spacers.sm} + ${spacers.md}) / 2)`,
                }),
                ...children(['&', ':first-child'], { // <li> & <AccordionHeader>
                    // layouts:
                    display             : 'grid',
                    gridTemplateColumns : 'subgrid',
                }),
                ...children(':first-child', { // <AccordionHeader>
                    // layouts:
                    alignItems          : 'center', // center vertically
                    
                    
                    
                    // children:
                    ...children('[role="radio"]', {
                        // positions:
                        gridColumn      : 'decor-start / decor-end',
                    }),
                    ...children('.label', {
                        // positions:
                        gridColumn      : 'label-start / label-end',
                    }),
                }),
            }),
        }, {specificityWeight: 2}),
        scope('selectPayment', {
            // layouts:
            display                     : 'grid',
            gridTemplateColumns         : '[decor-start] max-content [decor-end label-start] max-content [label-end] 1fr [icon-start] max-content [icon-end]',
            
            
            
            // children:
            ...children('li', {
                // children:
                ...children(['&', ':first-child', ':not(:first-child)'], { // <li>, <AccordionHeader>, <AccordionBody>
                    // positions:
                    gridColumn          : '1 / -1',
                }),
                ...children([':first-child', ':not(:first-child)'], { // <AccordionHeader>, <AccordionBody>
                    // spacings:
                    gap                 : spacers.md,
                    padding             : spacers.md,
                }),
                ...children(['&', ':first-child'], { // <li> & <AccordionHeader>
                    // layouts:
                    display             : 'grid',
                    gridTemplateColumns : 'subgrid',
                }),
                ...children(':first-child', { // <AccordionHeader>
                    // layouts:
                    alignItems          : 'center', // center vertically
                    
                    
                    
                    // children:
                    ...children('[role="radio"]', {
                        // positions:
                        gridColumn      : 'decor-start / decor-end',
                    }),
                    ...children('.label', {
                        // positions:
                        gridColumn      : 'label-start / label-end',
                    }),
                    ...children('img', {
                        // positions:
                        gridColumn      : 'icon-start / icon-end',
                        justifySelf     : 'center',
                        
                        
                        
                        // sizes:
                        inlineSize      : '60px',
                        blockSize       : '30px',
                        objectFit       : 'contain',
                    }),
                }),
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
            ...children('article', {
                // layout:
                display: 'grid',
                
                
                
                // children:
                ...children('*', { // * = a <div> by <PayPalCardFieldsProvider>
                    // layout:
                    display: 'grid',
                    gridTemplate: [[
                        '"instruct1  " auto',
                        '"savedButton" auto',
                        '"horz1      " auto',
                        '"instruct2  " auto',
                        '"number     " auto',
                        '"name       " auto',
                        '"expiry     " auto',
                        '"csc        " auto',
                        '"save       " auto',
                        '"horz2      " auto',
                        '"billing    " auto',
                        '"horz3      " auto',
                        '"verify     " auto',
                        '"payButton  " auto',
                        '/',
                        '1fr'
                    ]],
                    ...ifScreenWidthAtLeast('md', {
                        gridTemplate: [[
                            '"instruct1     instruct1" auto',
                            '"savedButton savedButton" auto',
                            '"horz1             horz1" auto',
                            '"instruct2     instruct2" auto',
                            '"number           number" auto',
                            '"name               name" auto',
                            '"expiry              csc" auto',
                            '"save               save" auto',
                            '"horz2             horz2" auto',
                            '"billing         billing" auto',
                            '"horz3             horz3" auto',
                            '"verify           verify" auto',
                            '"payButton     payButton" auto',
                            '/',
                            '1fr 1fr'
                        ]],
                    }),
                    
                    
                    
                    // spacings:
                    columnGap : spacers.md,
                    
                    
                    
                    // children:
                    ...children(':nth-child(n):not(:last-child)', {
                        // spacings:
                        marginBlockEnd : spacers.md,
                    }),
                    ...children('.instruct1', {
                        gridArea: 'instruct1',
                    }),
                    ...children('.savedButton', {
                        gridArea: 'savedButton',
                    }),
                    ...children('.horz1', {
                        gridArea: 'horz1',
                    }),
                    ...children('.instruct2', {
                        gridArea: 'instruct2',
                    }),
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
                    ...children('.save', {
                        gridArea: 'save',
                    }),
                    ...children('.horz2', {
                        gridArea: 'horz2',
                        marginBlock: 0,
                    }),
                    ...children('.billing', {
                        gridArea: 'billing',
                    }),
                    ...children('.horz3', {
                        gridArea: 'horz3',
                        marginBlock: 0,
                    }),
                    ...children('.verify', {
                        gridArea: 'verify',
                    }),
                    ...children('.payButton', {
                        gridArea: 'payButton',
                    }),
                }),
            }),
        }, {specificityWeight: 2}),
        scope('paymentEntryExpressCheckout', {
            [paddingVars.paddingInline] : '0rem',
            [paddingVars.paddingBlock ] : '0rem',
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            ...children('article', {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
            ...children('article', {
                [groupableVars.borderStartStartRadius] : ['inherit', '!important'], // reads parent's prop
                [groupableVars.borderStartEndRadius  ] : ['inherit', '!important'], // reads parent's prop
                [groupableVars.borderEndStartRadius  ] : ['inherit', '!important'], // reads parent's prop
                [groupableVars.borderEndEndRadius    ] : ['inherit', '!important'], // reads parent's prop
                borderStartStartRadius                 : groupableVars.borderStartStartRadius,
                borderStartEndRadius                   : groupableVars.borderStartEndRadius,
                borderEndStartRadius                   : groupableVars.borderEndStartRadius,
                borderEndEndRadius                     : groupableVars.borderEndEndRadius,
                
                ...children('div', {
                    // layouts:
                    display      : 'grid',
                    justifyItems : 'center',
                    alignItems   : 'center',
                }),
            }),
        }, {specificityWeight: 4}),
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
            
            paddingBlockEnd : containers.paddingBlockMd, // add a gap between `navCheckout` and <footer>
            
            // remove <section>'s and <article>'s padding to follow <container>'s padding:
            ...children(['&', 'article'], {
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
            
            ...children('article', {
                // back & next are stacked vertically, with back on the bottom:
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'stretch',
                flexWrap: 'nowrap',
                gap: '1rem',
                // back & next are stacked horizontally:
                ...ifScreenWidthAtLeast('sm', {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }),
                // back & next are stacked vertically, with back on the bottom:
                ...ifScreenWidthBetween('lg', 'lg', {
                    flexDirection: 'column-reverse',
                    alignItems: 'stretch',
                    gap: '1rem',
                }),
                
                // center the help message:
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
    ];
};
