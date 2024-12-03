// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'          // a styled basic building block of Reusable-UI components



// configs:
export const [grips, gripValues, cssGripConfig] = cssConfig(() => {
    const bases = {
        // sizes:
        minInlineSizeSm : '1.5rem'                                              as CssKnownProps['minInlineSize'],
        minInlineSizeMd : '3rem'                                                as CssKnownProps['minInlineSize'],
        minInlineSizeLg : '6rem'                                                as CssKnownProps['minInlineSize'],
        
        
        minBlockSizeSm  : `calc(${basics.fontSizeSm} * ${typos.lineHeight})`    as CssKnownProps['minBlockSize' ],
        minBlockSizeMd  : `calc(${basics.fontSizeSm} * ${typos.lineHeight})`    as CssKnownProps['minBlockSize' ],
        minBlockSizeLg  : `calc(${basics.fontSizeSm} * ${typos.lineHeight})`    as CssKnownProps['minBlockSize' ],
        
        
        
        // accessibilities:
        cursor          : 'move'                                                as CssKnownProps['cursor'       ],
        
        
        
        // dots:
        dotInlineSize   : '4px'                                                 as CssKnownProps['inlineSize'   ],
        dotBlockSize    : '4px'                                                 as CssKnownProps['blockSize'    ],
        dotMarginInline : '2px'                                                 as CssKnownProps['marginInline' ],
        dotMarginBlock  : '2px'                                                 as CssKnownProps['marginBlock'  ],
        dotBorderRadius : '50%'                                                 as CssKnownProps['borderRadius' ],
    };
    
    
    
    const defaults = {
        // sizes:
        minInlineSize   : bases.minInlineSizeMd                                 as CssKnownProps['minInlineSize'],
        minBlockSize    : bases.minInlineSizeMd                                 as CssKnownProps['minBlockSize' ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'grip' });
