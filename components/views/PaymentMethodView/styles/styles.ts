// cssfn:
import {
    children,
    descendants,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // configs:
    secondaries,
    
    
    
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesPaymentMethodViewLayout = () => { // the <ListItem> of order list
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // layouts:
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"label data actions"', 'auto',
            '"label data actions"', '1fr',
            '"label data actions"', 'auto',
            '/',
            '72px 1fr minmax(5rem, max-content)',
        ]],
        
        
        
        // spacings:
        columnGap : spacers.md,
        rowGap    : spacers.sm,
        [paddingVars.paddingInline] : spacers.md,
        [paddingVars.paddingBlock ] : spacers.md,
        
        
        
        // children:
        ...descendants('p', {
            margin: 0,
        }),
        ...children('[class^=card]', {
            // positions:
            gridColumn : '1 / -2',
            
            
            
            // layouts:
            display : 'grid',
            gridTemplateColumns: 'subgrid',
            alignItems : 'center',
            
            
            
            // children:
            ...children('.label', {
                // positions:
                gridColumn: '1 / 1',
                justifySelf: 'end',
                
                
                
                // typos:
                fontWeight : typos.fontWeightSemibold,
            }),
            ...children('.data', {
                // positions:
                gridColumn: '2 / -1',
                justifySelf: 'start',
            }),
        }),
        ...children('.cardNumber', {
            // children:
            ...children('.data', {
                // positions:
                justifySelf: 'stretch',
                
                
                
                // layouts:
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'space-between',
                
                
                
                // children:
                ...children('.cardNumberParts', {
                    // layouts:
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gap: spacers.sm,
                    
                    
                    
                    // typos:
                    fontSize: typos.fontSizeXl,
                    
                    
                    
                    // children:
                    ...children('.mask', {
                        opacity: secondaries.opacity,
                    }),
                }),
            }),
        }),
        ...children('.cardExpiry', {
            // children:
            ...children('.data', {
                // layouts:
                display: 'grid',
                gridAutoFlow: 'column',
                gap: spacers.sm,
            }),
        }),
        ...children('.cardCurrency', {
            // children:
            ...children('.data', {
                // layouts:
                display: 'grid',
                gridAutoFlow: 'column',
                gap: spacers.sm,
            }),
        }),
        ...children('.cardBilling', {
            // children:
            ...children('.data', {
                // layouts:
                display: 'block',
                
                
                
                // typos:
                fontSize: typos.fontSizeSm,
            }),
        }),
        ...children('.actions', {
            // positions:
            gridArea: 'actions',
            
            
            
            // layouts:
            display      : 'grid',
            gridTemplate : [[
                '"edit    " auto',
                '"grip    " minmax(2rem, 1fr)',
                '"priority" auto',
                '/',
                '1fr',
            ]],
            
            
            
            // spacings:
            gap: spacers.md,
            
            
            
            // children:
            ...children('.edit', {
                // positions:
                gridArea: 'edit',
                alignSelf: 'start',
            }),
            ...children('.grip', {
                // positions:
                gridArea: 'grip',
            }),
            ...children('.priority', {
                // positions:
                gridArea: 'priority',
                
                
                
                // typos:
                textAlign: 'center',
            }),
        }),
        ...descendants('[role="dialog"]', {
            // remove the padding of <Dialog>'s backdrop:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesDataLayout = () => {
    return style({
        // typos:
        whiteSpace : 'normal',
        wordBreak  : 'break-all',
    });
};

export default () => [
    scope('main', {
        // layouts:
        ...usesPaymentMethodViewLayout(),
    }, { specificityWeight: 2 }),
    
    scope('data', {
        // layouts:
        ...usesDataLayout(),
    }),
];
