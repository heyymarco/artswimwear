// cssfn:
import {
    // writes css in javascript:
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

import {
    // a typography management system:
    typos,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component



// styles:
const usesPaymentMethodBrandLayout = () => {
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display    : 'grid',
            
            
            
            // sizes:
            boxSizing  : 'content-box',
            inlineSize : 'fit-content',
            blockSize  : '1lh',
        }),
    });
};
const usesPaymentMethodBrandVariants = usesBasicVariants;

const usesPaymentMethodBrandLogoLayout = () => {
    
    // dependencies:
    
    // features:
    const {paddingVars} = usesPadding();
    
    // spacings:
    const positivePaddingInline = paddingVars.paddingInline;
    const positivePaddingBlock  = paddingVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // spacings:
        // cancel-out parent's padding with negative margin:
        marginInline : negativePaddingInline,
        marginBlock  : negativePaddingBlock,
    });
};
const usesPaymentMethodBrandNameLayout = () => {
    return style({
        // typos:
        fontWeight : typos.fontWeightSemibold,
    });
};



export default () => [
    scope('main', {
        // layouts:
        ...usesPaymentMethodBrandLayout(),
        
        // variants:
        ...usesPaymentMethodBrandVariants(),
    }),
    scope('logo', {
        // layouts:
        ...usesPaymentMethodBrandLogoLayout(),
    }),
    scope('name', {
        // layouts:
        ...usesPaymentMethodBrandNameLayout(),
    }),
];
