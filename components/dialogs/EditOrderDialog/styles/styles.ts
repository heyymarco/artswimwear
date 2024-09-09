// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a border (stroke) management system:
    borders,
    borderRadiuses,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a responsive management system:
    breakpoints,
    ifScreenWidthAtLeast,
    ifScreenWidthSmallerThan,
    
    
    
    // a typography management system:
    typos,
    horzRules,
    secondaries,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    containers,
    contents,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    commerces,
}                           from '@/config'



// defaults:
const imageSize = 64;  // 64px
const maxMobileTextWidth = `calc(${breakpoints.sm}px - (2 * ${contents.paddingInline}))`;



// styles:
const usesOrderShippingTabLayout = () => {
    return style({
        // layouts:
        display            : 'flex',
        flexDirection      : 'column',
        justifyContent     : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems         : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap           : 'nowrap',  // no wrapping
        
        
        
        // sizes:
        boxSizing          : 'content-box',
        // minInlineSize      : '32rem',
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
        
        
        
        // spacings:
        padding            : '0px',
    });
};
const usesMinPaddingForBadge = () => {
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // children:
        ...children(['&', 'article'], {
            // spacings:
            // add a minimum paddingBlock for <Badge>:
            [paddingVars.paddingBlock] : `max(2.5rem, ${containers.paddingBlock})`,
        }),
    });
};
const usesOrderShippingSectionLayout = () => {
    return style({
        // layouts:
        ...usesMinPaddingForBadge(),
        
        
        
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
            ...descendants('p', {
                margin: 0,
            }),
            ...descendants('.currencyBlock', {
                display: 'flex',
                
                ...rule('.totalCost', {
                    ...descendants(['&', '.currency'], {
                        fontSize: typos.fontSizeLg,
                        fontWeight: typos.fontWeightSemibold,
                    }),
                }),
                ...rule('[role="deletion"]', {
                    position: 'relative',
                    opacity: 0.25,
                    ...children('::before', {
                        position: 'absolute',
                        alignSelf: 'center',
                        content: '""',
                        display: 'block',
                        inlineSize: '100%',
                        borderTop: [[
                            'solid', '1px', 'currentColor'
                        ]],
                    }),
                }),
            }),
            ...descendants('.currency', {
                marginInlineStart: 'auto',
                fontSize: typos.fontSizeMd,
                fontWeight: typos.fontWeightSemibold,
                ...rule('.secondary', {
                    fontSize: typos.fontSizeSm,
                    fontWeight: typos.fontWeightLight,
                }),
            }),
        }),
    });
};
const usesViewCartLayout = () => {
    return style({
        // children:
        ...children('*', { // <li>
            // appearances:
            borderColor : `color-mix(in srgb, currentcolor calc(${horzRules.opacity} * 100%), transparent)`,
        }),
    });
}
const usesViewCartItemLayout = () => {
    return style({
        // positions:
        gridArea: 'orderSummary',
        
        
        
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"title    title              title    title" max-content',
            '"variants variants        variants variants" max-content',
            '"image    image              image    image" max-content',
            '".....    labelUnitPrice unitPrice ........" max-content',
            '".....    labelQuantity   quantity ........" max-content',
            '"subPrice subPrice        subPrice subPrice" max-content',
            '/',
            `1fr auto auto 1fr`,
        ]],
        ...ifScreenWidthAtLeast('sm', {
            gridTemplate : [[
                '"number image title              title" max-content',
                '"number image variants        variants" max-content',
                '"number image labelUnitPrice unitPrice" max-content',
                '"number image labelQuantity   quantity" max-content',
                '"number image subPrice        subPrice" max-content',
                '/',
                `min-content min-content min-content auto`,
            ]],
        }),
        
        
        
        // spacings:
        gapInline     : spacers.sm,
        ...ifScreenWidthAtLeast('sm', {
            gapInline : 0, // different gap between prodImg and label
        }),
        gapBlock      : '0.5rem',
        paddingInline : '0px',
        
        
        
        // children:
        ...children('::before', {
            display : 'none',
            ...ifScreenWidthAtLeast('sm', {
                gridArea        : 'number',
                display         : 'grid',
                justifyContent  : 'end',
                alignContent    : 'center',
                
                
                
                // spacings:
                marginInlineEnd : spacers.sm,
            }),
        }),
        ...children('.prodImg', {
            // positions:
            gridArea    : 'image',
            justifySelf : 'center', // center horizontally
            alignSelf   : 'center', // center vertically
            
            
            
            // sizes:
            width       : `${imageSize}px`,
            aspectRatio : commerces.defaultProductAspectRatio,
            
            
            
            // backgrounds:
            background  : 'white',
            
            
            
            // spacings:
            ...ifScreenWidthAtLeast('sm', {
                marginInlineEnd : spacers.default,
            }),
            
            
            
            // children:
            ...children('img', {
                // sizes:
                width  : '100% !important',
                height : '100% !important',
            }),
        }),
        ...children('.title', {
            // positions:
            gridArea    : 'title',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // stretch horizontally
            }),
            
            
            
            // sizes:
            ...ifScreenWidthSmallerThan('sm', {
                boxSizing     : 'border-box',
                maxInlineSize : maxMobileTextWidth,
            }),
            
            
            
            // spacings:
            margin       : 0,
            
            
            
            // typos:
            whiteSpace   : 'normal',
            textOverflow : 'ellipsis', // long text...
            wordBreak    : 'break-word',
            overflowWrap : 'break-word',
            overflow     : 'hidden',
            ...ifScreenWidthSmallerThan('sm', {
                textAlign: 'center',
            }),
        }),
        ...children('.variants', {
            // positions:
            gridArea        : 'variants',
            justifySelf     : 'center',  // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'stretch', // fill the entire gridArea
            }),
            
            
            
            // layouts:
            display          : 'flex',
            flexWrap         : 'wrap',   // wrap excess variant items
            
            
            
            // spacings:
            margin           : 0,
            gap              : spacers.xs,
        }),
        ...children(['.unitPrice', '.quantity'], {
            display             : 'grid',
            gridTemplateColumns : 'subgrid',
            
            
            
            // children:
            ...children('.label', {
                // spacings:
                marginInlineEnd : spacers.sm,
                
                
                
                // typos:
                textAlign       : 'end',   // right_most
            }),
            ...children('.value', {
                // typos:
                textAlign   : 'start', // left_most
            }),
        }),
        ...children('.unitPrice', {
            // positions:
            gridArea    : 'labelUnitPrice/labelUnitPrice / unitPrice/unitPrice',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // typos:
            fontWeight  : typos.fontWeightLight,
        }),
        ...children('.quantity', {
            // positions:
            gridArea    : 'labelQuantity/labelQuantity / quantity/quantity',
            justifySelf : 'center', // center horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifySelf : 'start', // place to the left
            }),
            
            
            
            // layouts:
            alignItems : 'center',
            
            
            
            // children:
            ...children('.label', {
                fontWeight  : typos.fontWeightLight,
            }),
            ...children('.value.number', {
                fontSize   : typos.fontSizeLg,
                fontWeight : typos.fontWeightSemibold,
            }),
        }),
        ...children('.subPrice', {
            // positions:
            gridArea    : 'subPrice',
            justifySelf : 'end',
        }),
    });
};
const usesOrderDeliverySectionLayout = () => {
    return style({
        // layouts:
        ...usesMinPaddingForBadge(),
        
        
        
        // children:
        ...children('article', {
            ...children('h3', {
                textAlign: 'center',
            }),
        }),
    });
};
const usesPaymentTabLayout = () => {
    return style({
        // layouts:
        display            : 'flex',
        flexDirection      : 'column',
        justifyContent     : 'start',   // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
        alignItems         : 'stretch', // items width are 100% of the parent (for variant `.block`) or height (for variant `.inline`)
        flexWrap           : 'nowrap',  // no wrapping
        
        
        
        // scrolls:
        overscrollBehavior : 'none',
    });
};
const usesPaymentSectionLayout = () => {
    return style({
        // children:
        ...children('article', {
            // layouts:
            display        : 'flex',
            flexDirection  : 'column',
            justifyContent : 'start',       // if items are not growable, the excess space (if any) placed at the end, and if no sufficient space available => the first item should be visible first
            alignItems     : 'center',      // center item(s) horizonally
            flexWrap       : 'nowrap',      // no wrapping
            
            
            
            // spacings:
            gap : spacers.lg,
        }),
    });
};
const usesPaymentAlertLayout = () => {
    return style({
        // layouts:
        justifyContent: 'center', // center horizontally
        alignContent  : 'center', // center vertically
        
        
        
        // sizes:
        alignSelf : 'stretch',
        
        
        
        // children:
        ...children('.body', {
            display: 'grid',
            justifyContent: 'center', // center horizontally
            alignContent  : 'center', // center vertically
        }),
    });
};
const usesPaymentNoteLayout = () => {
    return style({
        // sizes:
        alignSelf : 'stretch',
    });
};
const usesDataTableLayout = () => {
    return style({
        // sizes:
        alignSelf     : 'center',  // center
        ...ifScreenWidthSmallerThan('sm', {
            alignSelf : 'stretch', // full width
        }),
    });
};
const usesTableDataComposite = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    return style({
        // layouts:
        alignItems          : 'center', // center the each item vertically   (desktop mode)
        justifyItems        : 'center', // center the each item horizontally (mobile mode)
        gridAutoFlow        : 'row',    // stack the items vertically        (mobile mode)
        ...ifScreenWidthAtLeast('sm', {
            gridAutoFlow    : 'column', // stack the items horizontally      (desktop mode)
        }),
        
        
        
        // spacings:
        gap                 : spacers.sm,
        
        
        
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
        ...children('.paymentIdentifier', {
            // typos:
            fontSize       : typos.fontSizeSm,
            fontWeight     : typos.fontWeightNormal,
        }),
    });
};
const usesPaymentConfirmationAlertLayout = () => {
    return style({
        // sizes:
        contain: 'inline-size', // do not take up the <Dialog>'s width, just fill the available width
        width: '100%',
    });
};
const usesDateTimeLayout = () => {
    return style({
        alignSelf: 'center',
    });
};
const usesTableDataAmountLayout = () => {
    return style({
        alignItems         : 'center',  // center     the items horizontally (mobile mode)
        ...ifScreenWidthAtLeast('sm', {
            justifyContent : 'end',     // right_most the items horizontally (desktop mode)
        }),
    });
}
const usesSelectCurrencyDropdownLayout = () => {
    return style({
        // sizes:
        boxSizing     : 'content-box',
        minInlineSize : '3em',
    });
};
const usesPaymentConfirmActionsLayout = () => {
    return style({
        display: 'grid',
        gap: spacers.default,
    });
};
const usesBadgeLayout = () => {
    return style({
        // positions:
        position         : 'absolute',
        insetInlineStart : 0,
        insetBlockStart  : 0,
        
        
        
        // layouts:
        display: 'inline-block',
        
        
        
        // sizes:
        boxSizing     : 'content-box',
        minInlineSize : '6em',
        
        
        
        // borders:
        borderWidth  : 0,
        borderRadius : 0,
        
        
        
        // spacings:
        padding: spacers.sm,
        
        
        
        // typos:
        fontWeight : typos.fontWeightSemibold,
        textAlign  : 'center',
    });
};
const usesSelectCurrencyBadgeLayout = () => {
    return style({
        // positions:
        position         : 'absolute',
        insetInlineEnd   : 0,
        insetBlockStart  : 0,
        
        
        
        // sizes:
        boxSizing     : 'content-box',
        minInlineSize : '6em',
        
        
        
        // borders:
        borderWidth  : 0,
        borderRadius : 0,
    });
};
const usesShippingBadgeLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        gridAutoFlow: 'column',
        
        
        
        // spacings:
        columnGap : spacers.md,
    });
};
const usesProgressBadgeLayout = () => {
    return style({
        // positions:
        position         : 'relative',
        insetInlineStart : `calc(0px - ${containers.paddingInline} + ${contents.paddingInline})`,
        insetBlockStart  : `calc(0px - ${containers.paddingBlock } + ${contents.paddingBlock })`,
        
        
        
        // sizes:
        contain          : 'inline-size', // do not take up space of width
        alignSelf        : 'start',
        
        
        
        // typos:
        whiteSpace        : 'nowrap',
    });
};
const usesShippingAddressLayout = () => {
    return style({
        // positions:
        position        : 'relative',
    });
};
const usesEditShippingAddressLayout = () => {
    return style({
        // positions:
        position        : 'absolute',
        insetInlineEnd  : 0,
        insetBlockStart : 0,
        
        
        
        // spacings:
        margin: spacers.sm,
    });
};
const usesPrintSpacerLayout = () => {
    return style({
        // layouts:
        display: 'grid', // hide the <Content> if [screen mode]
        gridTemplate: [[
            '"scissors line" auto',
            '/',
            'auto 1fr',
        ]],
        alignItems: 'center', // center vertically
        
        
        
        // spacings:
        paddingBlock : spacers.lg,
        
        
        
        // prints:
        ...rule('@media print', {
            breakAfter : 'page',
        }),
        
        
        
        // children:
        ...children('.scissors', {
            // positions:
            gridArea: 'scissors',
        }),
        ...children('.line', {
            // positions:
            gridArea: 'line',
            
            
            
            // borders:
            borderBlockStartStyle: 'dashed',
            borderBlockStartWidth : borders.thin,
            
            
            
            // spacings:
            margin: 0,
        }),
    });
};
const usesNoteHeaderLayout = () => {
    return style({
        display: 'grid',
        justifyContent : 'center',
    });
};
const usesNoteBodyFullLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        
        
        
        // children:
        ...children('*', {
            gridArea : '1 / 1 / 1 / 1',
        }),
    });
};
const usesNoteBodyExpiredLayout = () => {
    return style({
        // layouts:
        display : 'grid',
        gridAutoFlow : 'column',
        gridArea : [[
            '"datetime timezone" 1fr',
            '/',
            '1fr max-content',
        ]],
        
        
        
        // spacings:
        gap: spacers.md,
    });
};
const usesNoteEmptyLayout = () => {
    return style({
        // positions:
        justifySelf : 'center',
        alignSelf   : 'center',
    });
};
const usesNoteContentCenterLayout = () => {
    return style({
        // positions:
        justifySelf : 'center',
        alignSelf   : 'center',
    });
};
const usesEditTroubleLayout = () => {
    return style({
        // positions:
        justifySelf : 'end',
        alignSelf   : 'center',
    });
};
const usesAlternateSeparatorLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        alignItems: 'center',
        gridTemplate: [[
            '"line1 label line2" auto',
            '/',
            '1fr auto 1fr'
        ]],
        
        
        
        // spacings:
        gap: spacers.sm,
    });
};
const usesCountDownLayout = () => {
    return style({
        // layouts:
        display: 'grid',
        justifyItems: 'center',
    });
};

export default () => [
    scope('data', {
        whiteSpace : 'normal',
        wordBreak  : 'break-all',
    }),
    
    scope('orderShippingTab', {
        ...usesOrderShippingTabLayout(),
    }, { specificityWeight: 3 }),
    scope('orderShippingSection', {
        ...usesOrderShippingSectionLayout(),
    }),
    scope('viewCart', {
        ...usesViewCartLayout(),
    }, { specificityWeight: 2 }),
    scope('viewCartItem', {
        ...usesViewCartItemLayout(),
    }, { specificityWeight: 2 }),
    scope('orderDeliverySection', {
        ...usesOrderDeliverySectionLayout(),
    }),
    
    scope('paymentTab', {
        ...usesPaymentTabLayout(),
    }),
    scope('paymentSection', {
        ...usesPaymentSectionLayout(),
    }),
    
    scope('paymentAlert', {
        ...usesPaymentAlertLayout(),
    }, { specificityWeight: 2 }),
    scope('paymentNote', {
        ...usesPaymentNoteLayout(),
    }),
    scope('dataTable', {
        ...usesDataTableLayout(),
    }),
    scope('tableDataComposite', {
        ...usesTableDataComposite(),
    }, {specificityWeight: 2}),
    scope('paymentConfirmationAlert', {
        ...usesPaymentConfirmationAlertLayout(),
    }),
    scope('dateTime', {
        ...usesDateTimeLayout(),
    }),
    scope('tableDataAmount', {
        ...usesTableDataAmountLayout(),
    }),
    scope('selectCurrencyDropdown', {
        ...usesSelectCurrencyDropdownLayout(),
    }),
    scope('paymentConfirmActions', {
        ...usesPaymentConfirmActionsLayout(),
    }),
    
    scope('badge', {
        ...usesBadgeLayout(),
    }, { specificityWeight: 2 }),
    scope('selectCurrencyBadge', {
        ...usesSelectCurrencyBadgeLayout(),
    }, { specificityWeight: 2 }),
    scope('shippingBadge', {
        ...usesShippingBadgeLayout(),
    }, { specificityWeight: 2 }),
    scope('progressBadge', {
        ...usesProgressBadgeLayout(),
    }, { specificityWeight: 2 }),
    
    scope('shippingAddress', {
        ...usesShippingAddressLayout(),
    }),
    scope('editShippingAddress', {
        ...usesEditShippingAddressLayout(),
    }, { specificityWeight: 2 }),
    
    scope('printSpacer', {
        ...usesPrintSpacerLayout(),
    }, { specificityWeight: 2 }),
    
    scope('noteHeader', {
        ...usesNoteHeaderLayout(),
    }),
    scope('noteBodyFull', {
        ...usesNoteBodyFullLayout(),
    }),
    scope('noteBodyExpired', {
        ...usesNoteBodyExpiredLayout(),
    }),
    scope('noteEmpty', {
        ...usesNoteEmptyLayout(),
    }),
    scope('noteContentCenter', {
        ...usesNoteContentCenterLayout(),
    }),
    scope('editTrouble', {
        ...usesEditTroubleLayout(),
    }, { specificityWeight: 2 }),
    scope('alternateSeparator', {
        ...usesAlternateSeparatorLayout(),
    }),
    scope('countDown', {
        ...usesCountDownLayout(),
    }, { specificityWeight: 2 }),
];
