// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [commerces, commerceValues, cssCommerceConfig] = cssConfig(() => {
    return {
        // media:
        defaultProductAspectRatio : '2/3'     as CssKnownProps['aspectRatio'],
    };
}, { prefix: 'comm' });
