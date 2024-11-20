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

// payment components:
import {
    type StripeElementStyle,
}                           from '@stripe/stripe-js'



// styles:
export const stripeCardFieldStyle : StripeElementStyle = {
    base : {
        fontSize            : typoValues.fontSizeMd?.toString(),
        fontFamily          : typoValues.fontFamilySansSerief?.toString(),
        fontWeight          : typoValues.fontWeightNormal?.toString(),
        fontStyle           : typoValues.fontStyle?.toString(),
        textDecoration      : typoValues.textDecoration?.toString(),
        lineHeight          : typoValues.lineHeightMd?.toString(),
        
        color               : colorValues.primaryBold.toString(),
        
        '::selection' : {
            color           : colorValues.primaryText.toString(),
            backgroundColor : colorValues.primary.toString(),
        },
    },
    empty : {
        '::placeholder' : {
            // color           : `color-mix(in srgb, currentColor, ${(inputValues.placeholderOpacity as number) * 100}% transparent)`, // doesn't work
            // opacity         : inputValues.placeholderOpacity as number, // doesn't work
            color           : colorValues.primaryBold.alpha(inputValues.placeholderOpacity as number).toString(),
        },
    },
    complete : {
        color               : colorValues.successBold.toString(),
        '::selection' : {
            color           : colorValues.successText.toString(),
            backgroundColor : colorValues.success.toString(),
        },
    },
    invalid : {
        color               : colorValues.dangerBold.toString(),
        '::selection' : {
            color           : colorValues.dangerText.toString(),
            backgroundColor : colorValues.danger.toString(),
        },
    },
};
