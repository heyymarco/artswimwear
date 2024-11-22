// cssfn:
import {
    children,
    descendants,
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript

import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesPaymentMethodViewLayout = () => { // the <ListItem> of order list
    return style({
        // layouts:
        // layouts:
        display: 'grid',
        gridTemplate: [[
            '"cardNumber  "', 'auto',
            '"............"', spacers.md,
            '"cardExpires "', 'auto',
            '"............"', spacers.md,
            '"cardCurrency"', 'auto',
            '"............"', spacers.md,
            '"cardBilling "', 'auto',
            '/',
            '1fr',
        ]],
        
        
        
        // children:
        ...descendants('p', {
            margin: 0,
        }),
        ...children('.cardNumber', {
            // positions:
            gridArea       : 'cardNumber',
            
            
            
            // layouts:
            display        : 'grid',
            gridAutoFlow   : 'column',
            justifyContent : 'space-between',
            
            
            
            // spacings:
            gap            : '0.25em',
            
            
            
            // typos:
            fontSize: typos.fontSizeXl,
        }),
        ...children('.cardExpires', {
            gridArea: 'cardExpires',
            
            
            
            // layouts:
            display        : 'grid',
            gridAutoFlow   : 'column',
            
            
            
            // spacings:
            gap            : '0.25em',
            
            
            
            // typos:
            fontSize: typos.fontSizeSm,
        }),
        ...children('.cardCurrency', {
            gridArea: 'cardCurrency',
            
            
            
            // typos:
            fontSize: typos.fontSizeSm,
        }),
        ...children('.cardBilling', {
            gridArea: 'cardBilling',
            
            
            
            // typos:
            fontSize: typos.fontSizeSm,
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
