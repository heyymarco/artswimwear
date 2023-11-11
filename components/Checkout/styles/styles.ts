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
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
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



// const imageSize = 64;  // 64px
export default () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    const {foregroundVars} = usesForeground();
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
                
                
                
                // children:
                ...children('table', {
                    // layouts:
                    borderCollapse : 'separate',
                    borderSpacing  : 0,
                    tableLayout    : 'auto',
                    
                    
                    
                    // sizes:
                    width          : '100%', // block like layout
                    
                    
                    
                    // children:
                    ...children(['thead', 'tbody'], {
                        // border strokes & radiuses:
                        ...children('tr', {
                            ...children(['th', 'td'], {
                                ...rule(':first-child', {
                                    borderInlineStart              : borderVars.border,
                                    borderInlineStartWidth         : borders.defaultWidth,
                                }),
                                ...rule(':last-child', {
                                    borderInlineEnd                : borderVars.border,
                                    borderInlineEndWidth           : borders.defaultWidth,
                                }),
                            }),
                        }),
                        ...rule(':first-child', {
                            ...children('tr', {
                                ...rule(':first-child', {
                                    ...children(['th', 'td'], {
                                        borderBlockStart           : borderVars.border,
                                        borderBlockStartWidth      : borders.defaultWidth,
                                        
                                        
                                        
                                        ...rule(':first-child', {
                                            borderStartStartRadius : borderRadiuses.default,
                                        }),
                                        ...rule(':last-child', {
                                            borderStartEndRadius   : borderRadiuses.default,
                                        }),
                                    }),
                                }),
                            }),
                        }),
                        ...rule(':last-child', {
                            ...children('tr', {
                                ...rule(':last-child', {
                                    ...children(['th', 'td'], {
                                        borderBlockEnd             : borderVars.border,
                                        borderBlockEndWidth        : borders.defaultWidth,
                                        
                                        
                                        
                                        ...rule(':first-child', {
                                            borderEndStartRadius   : borderRadiuses.default,
                                        }),
                                        ...rule(':last-child', {
                                            borderEndEndRadius     : borderRadiuses.default,
                                        }),
                                    }),
                                }),
                            }),
                        }),
                        
                        
                        // border separators:
                        ...children('tr', { // border as separator between row(s)
                            ...rule(':not(:last-child)', {
                                ...children(['th', 'td'], {
                                    borderBlockEnd      : borderVars.border,
                                    borderBlockEndWidth : borders.defaultWidth,
                                }),
                            }),
                        }),
                        ...rule(':not(:last-child)', { // border as separator between thead|tbody
                            ...children('tr', {
                                ...rule(':last-child', {
                                    ...children(['th', 'td'], {
                                        borderBlockEnd      : borderVars.border,
                                        borderBlockEndWidth : borders.defaultWidth,
                                    }),
                                }),
                            }),
                        }),
                        
                        
                        
                        // children:
                        ...children('tr', {
                            // children:
                            ...children(['th', 'td'], { // spacing for all cells
                                // spacings:
                                padding        : '0.75rem',
                            }),
                            ...children('th', { // default title formatting
                                // typos:
                                fontWeight     : typos.fontWeightSemibold,
                                textAlign      : 'center', // center the title horizontally
                            }),
                            ...children('td', { // default data formatting
                                // typos:
                                wordBreak      : 'break-word',
                                overflowWrap   : 'anywhere', // break long text like email
                            }),
                        }),
                    }),
                    ...children('thead', {
                        ...children('tr', {
                            ...children('th', { // special theme color for header's cell(s)
                                // accessibilities:
                                ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                                    // backgrounds:
                                    backg : backgroundVars.backgColor,
                                    
                                    
                                    
                                    // foregrounds:
                                    foreg : foregroundVars.foreg,
                                }),
                                
                                
                                
                                // backgrounds:
                                backg     : backgroundVars.altBackgColor,
                                
                                
                                
                                // foregrounds:
                                color     : foregroundVars.altForeg,
                            }),
                        }),
                    }),
                    ...children('tbody', {
                        ...children('tr', {
                            // layouts:
                            // the table cells is set to 'grid'|'block', causing the table structure broken,
                            // to fix this we set the table row to flex:
                            display               : 'flex',
                            
                            flexDirection         : 'column',
                            justifyContent        : 'start',   // top_most the items vertically
                            alignItems            : 'stretch', // stretch  the items horizontally
                            ...ifScreenWidthAtLeast('sm', {
                                flexDirection     : 'row',
                                // justifyContent : 'start',   // top_most the items horizontally
                                // alignItems     : 'stretch', // stretch  the items vertically
                            }),
                            
                            flexWrap              : 'nowrap',  // no wrapping
                            
                            
                            
                            // border separators:
                            ...ifScreenWidthSmallerThan('sm', { // conditional border as separator between row(s)
                                ...rule(':nth-child(n)', { // increase specificity
                                    ...children(['th', 'td'], {
                                        ...rule(':not(:last-child)', {
                                            borderBlockEnd : 0,
                                        }),
                                    }),
                                }),
                            }),
                            
                            
                            
                            // children:
                            ...children(['th', 'td'], { // special theme color for body's cell(s)
                                // accessibilities:
                                ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                                    // backgrounds:
                                    backg : backgroundVars.backgColor,
                                    
                                    
                                    
                                    // foregrounds:
                                    foreg : foregroundVars.foreg,
                                }),
                                
                                
                                
                                // backgrounds:
                                backg     : backgroundVars.backgColor,
                                
                                
                                
                                // foregrounds:
                                color     : foregroundVars.foreg,
                            }),
                            ...children('th', { // special title formatting
                                // layouts:
                                display            : 'grid',
                                
                                justifyContent     : 'center',  // center     the items horizontally
                                ...ifScreenWidthAtLeast('sm', {
                                    justifyContent : 'end',     // right_most the items horizontally
                                }),
                                
                                alignContent       : 'center',  // center     the items vertically
                                
                                
                                
                                // sizes:
                                ...ifScreenWidthAtLeast('sm', {
                                    // fixed size accross table(s), simulating subgrid:
                                    boxSizing      : 'content-box',
                                    inlineSize     : '5em', // a fixed size by try n error
                                    flex           : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
                                }),
                            }),
                            ...children('td', { // special data formatting
                                // sizes:
                                
                                // fill the remaining width for data cells:
                                ...rule(':nth-child(2)', {
                                    flex       : [[1, 1, 'auto']], // growable, shrinkable, initial from it's width
                                }),
                                
                                // fixed width of Edit cells:
                                ...rule(':nth-child(3)', {
                                    flex       : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's width
                                }),
                                
                                
                                
                                // special layouts:
                                ...rule(':nth-child(2)', {
                                    textAlign : 'center',
                                    ...ifScreenWidthAtLeast('sm', {
                                        textAlign : 'start',
                                    }),
                                }),
                                ...rule(':nth-child(3)', { // Edit cells:
                                    // layouts:
                                    display        : 'grid',
                                    justifyContent : 'center', // center the items vertically
                                }),
                                ...rule(['.shippingInfo', '.paymentInfo'], {
                                    // layouts:
                                    display            : 'grid',
                                    
                                    justifyContent     : 'center', // center    the items horizontally
                                    ...ifScreenWidthAtLeast('sm', {
                                        justifyContent : 'start',  // left_most the items horizontally
                                    }),
                                    
                                    alignItems         : 'center', // center    the each item vertically
                                    justifyItems       : 'center', // center    the each item horizontally
                                    
                                    gridAutoFlow       : 'row',
                                    ...ifScreenWidthAtLeast('sm', {
                                        gridAutoFlow   : 'column',
                                    }),
                                    
                                    
                                    
                                    // spacings:
                                    gap                : spacers.sm,
                                    
                                    
                                    
                                    // children:
                                    ...children('.paymentProvider', {
                                        // sizes:
                                        width             : '42px',
                                        height            : 'auto',
                                        
                                        
                                        
                                        // borders:
                                        border            : borderVars.border,
                                        borderWidth       : borders.defaultWidth,
                                        borderRadius      : borderRadiuses.sm,
                                    }),
                                    ...children(['.shippingEstimate', '.paymentIdentifier'], {
                                        // typos:
                                        fontSize          : typos.fontSizeSm,
                                    }),
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        }),
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
        scope('shippingMethod', {
        }),
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
        scope('paymentMethod', {
        }),
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
                opacity    : 0.8,
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
    ];
};
