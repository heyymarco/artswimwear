// cssfn:
import {
    // writes css in javascript:
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // configs:
    secondaries,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component



// styles:
const usesPaymentMethodIdentifierLayout = () => {
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display      : 'inline-grid',
            
            
            
            // sizes:
            boxSizing    : 'content-box',
            minBlockSize : '1lh',
        }),
    });
};
const usesPaymentMethodIdentifierVariants = usesBasicVariants;

const usesPaymentMethodIdentifierMasksLayout = () => {
    return style({
        // layouts:
        display          : 'grid',
        gridAutoColumns  : '1fr',
        gridAutoFlow     : 'column',
        justifyContent   : 'end',
        
        
        
        // sizes:
        overflow         : 'hidden',
        
        
        
        // spacings:
        gap              : '0.5em',
    });
};
const usesPaymentMethodIdentifierMaskLayout = () => {
    return style({
        // layouts:
        display          : 'grid',
        justifyContent   : 'center',
        
        
        
        // appearances:
        opacity          : secondaries.opacity,
    });
};
const usesPaymentMethodIdentifierLast4Layout = () => {
    return style({
        // layouts:
        display          : 'grid',
        justifyContent   : 'center',
    });
};
const usesPaymentMethodIdentifierMayLongTextLayout = () => {
    return style({
        // typos:
        whiteSpace       : 'normal',
        wordBreak        : 'break-all',
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesPaymentMethodIdentifierLayout(),
        
        // variants:
        ...usesPaymentMethodIdentifierVariants(),
    }),
    scope('masks', {
        // layouts:
        ...usesPaymentMethodIdentifierMasksLayout(),
    }),
    scope('mask', {
        // layouts:
        ...usesPaymentMethodIdentifierMaskLayout(),
    }),
    scope('last4', {
        // layouts:
        ...usesPaymentMethodIdentifierLast4Layout(),
    }),
    scope('mayLongText', {
        // layouts:
        ...usesPaymentMethodIdentifierMayLongTextLayout(),
    }),
];
