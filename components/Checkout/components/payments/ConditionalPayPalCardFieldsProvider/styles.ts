// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a typography management system:
    typoValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    inputValues,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// paypal:
import {
    type PayPalCardFieldsStyleOptions,
}                           from '@paypal/paypal-js'



// styles:
const paypalCardFieldResetStyle    : PayPalCardFieldsStyleOptions = {
    // layouts:
    'appearance'           : 'none !important',
    
    
    
    // sizes:
    // @ts-ignore
    'height'               : '1lh !important',
    
    
    
    // backgrounds:
    // @ts-ignore
    'background'           : 'none !important',
    
    
    
    // borders:
    // @ts-ignore
    'border'               : 'none !important',
    'borderRadius'         : '0 !important',
    'outline'              : 'none !important',
    'box-shadow'           : 'none !important',
    
    
    
    // spacings:
    'padding'              : '0 !important',
};
export const paypalCardFieldsStyle : Record<string, PayPalCardFieldsStyleOptions> = {
    // bases:
    body: {
        // spacings:
        'padding'          : '0',
        
        
        
        // typos:
        'font-size'        : `${typoValues.fontSizeMd}` || undefined,
    },
    
    
    
    // icons:
    '.card-icon': {
        // @ts-ignore
        // 'left'             : '0', doesn't work
        'width'            : '40px',
        'height'           : '1lh',
    },
    'input.card-field-number.display-icon': {
        'padding-left'     : 'calc(40px + 1.2rem + 1em) !important',
    },
    
    
    
    // inputs:
    input: {
        // resets:
        ...paypalCardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.primaryBold.toString(),
        
        
        
        // typos:
        'font-size'        : `${typoValues.fontSizeMd}` || undefined,
        'font-family'      : `${typoValues.fontFamilySansSerief}` || undefined,
        'font-weight'      : `${typoValues.fontWeightNormal}` || undefined,
        'font-style'       : `${typoValues.fontStyle}` || undefined,
        // @ts-ignore
        'text-decoration'  : `${typoValues.textDecoration}` || undefined,
        'line-height'      : `${typoValues.lineHeightMd}` || undefined,
    },
    '::placeholder': {
        // appearances:
        'opacity'          : `${inputValues.placeholderOpacity}` || undefined,
        
        
        
        // foregrounds:
        'color'            : 'currentColor',
    },
    '::selection': {
        // @ts-ignore
        background         : colorValues.primary.toString(),
        color              : colorValues.primaryText.toString(),
    },
    
    
    // states:
    ':focus': paypalCardFieldResetStyle,
    '.valid': {
        // resets:
        ...paypalCardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.successBold.toString(),
    },
    '.valid::selection': {
        // @ts-ignore
        'background'       : colorValues.success.toString(),
        'color'            : colorValues.successText.toString(),
    },
    '.invalid': {
        // resets:
        ...paypalCardFieldResetStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.dangerBold.toString(),
    },
    '.invalid::selection': {
        // @ts-ignore
        'background'       : colorValues.danger.toString(),
        'color'            : colorValues.dangerText.toString(),
    },
};