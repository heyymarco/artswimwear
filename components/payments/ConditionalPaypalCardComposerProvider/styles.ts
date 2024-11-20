// reusable-ui core:
import {
    // a color management system:
    colorValues,
    
    
    
    // a spacer (gap) management system:
    spacerValues,
    
    
    
    // a typography management system:
    typoValues,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    inputValues,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// payment components:
import {
    type PayPalCardFieldsStyleOptions,
}                           from '@paypal/paypal-js'



// styles:
const paypalCardComposerResetBoxStyle     : PayPalCardFieldsStyleOptions = {
    // layouts:
    'appearance'           : 'none !important',
    
    
    
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
    'padding-top'          : '0 !important',
    'padding-bottom'       : '0 !important',
    'padding-left'         : '0 !important',
    'padding-right'        : '0 !important',
};
const paypalCardComposerResetTextboxStyle : PayPalCardFieldsStyleOptions = {
    // resets:
    ...paypalCardComposerResetBoxStyle,
    
    
    
    // sizes:
    // @ts-ignore
    'height'           : '100%',
    
    
    
    // spacings:
    'padding-top'      : `calc((${typoValues.fontSizeMd} / 3))`,
    'padding-bottom'   : `calc((${typoValues.fontSizeMd} / 3))`,
    'padding-left'     : `calc((${typoValues.fontSizeMd} / 1.5))`,
    'padding-right'    : `calc((${typoValues.fontSizeMd} / 1.5))`,
};
export const paypalCardComposerStyle : Record<string, PayPalCardFieldsStyleOptions> = {
    // bases:
    html : {
        // sizes:
        // @ts-ignore
        'height'           : '100%',
    },
    body: {
        // sizes:
        // @ts-ignore
        'height'           : '100%',
        
        
        
        // spacings:
        'padding'          : '0',
        
        
        
        // typos:
        'font-size'        : `${typoValues.fontSizeMd}` || undefined,
    },
    
    
    
    // icons:
    '.card-icon.card-icon': {
        // @ts-ignore
        // 'left'             : `calc((${typoValues.fontSizeMd} / 1.5)) !important`, // doesn't work, Paypal doesn't allow to declare `left` prop
        'width'            : '40px !important',
        'height'           : `calc(100% - (${spacerValues.md} / 2)) !important`,
    },
    'input.card-field-number.display-icon.display-icon': {
        'padding-left'     : `calc(1.1875rem + 40px + (${typoValues.fontSizeMd} / 1.5)) !important`,
    },
    
    
    
    // inputs:
    input: {
        // resets:
        ...paypalCardComposerResetTextboxStyle,
        
        
        
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
    ':focus': paypalCardComposerResetTextboxStyle,
    '.valid': {
        // resets:
        ...paypalCardComposerResetTextboxStyle,
        
        
        
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
        ...paypalCardComposerResetTextboxStyle,
        
        
        
        // foregrounds:
        'color'            : colorValues.dangerBold.toString(),
    },
    '.invalid::selection': {
        // @ts-ignore
        'background'       : colorValues.danger.toString(),
        'color'            : colorValues.dangerText.toString(),
    },
};
