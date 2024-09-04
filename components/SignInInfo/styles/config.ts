// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    contents,
}                           from '@reusable-ui/content'         // a generic element for displaying contents such as paragraphs, images, videos, etc



// configs:
export const [signInInfos, signInInfoValues, cssSignInInfoConfig] = cssConfig(() => {
    const bases = {
        // spacings:
        paddingInlineSm     : contents.paddingInlineSm                                      as CssKnownProps['paddingInline' ],
        paddingBlockSm      : contents.paddingBlockSm                                       as CssKnownProps['paddingBlock'  ],
        paddingInlineMd     : contents.paddingInlineMd                                      as CssKnownProps['paddingInline' ],
        paddingBlockMd      : contents.paddingBlockMd                                       as CssKnownProps['paddingBlock'  ],
        paddingInlineLg     : contents.paddingInlineLg                                      as CssKnownProps['paddingInline' ],
        paddingBlockLg      : contents.paddingBlockLg                                       as CssKnownProps['paddingBlock'  ],
        
        gapInlineSm         : spacers.sm                                                    as CssKnownProps['gapInline'     ],
        gapBlockSm          : '0px'                                                         as CssKnownProps['gapBlock'      ],
        gapInlineMd         : spacers.md                                                    as CssKnownProps['gapInline'     ],
        gapBlockMd          : '0px'                                                         as CssKnownProps['gapBlock'      ],
        gapInlineLg         : spacers.lg                                                    as CssKnownProps['gapInline'     ],
        gapBlockLg          : '0px'                                                         as CssKnownProps['gapBlock'      ],
        
        
        
        // images:
        imageInlineSizeSm   : '36px'                                                        as CssKnownProps['inlineSize'    ],
        imageBlockSizeSm    : 'auto'                                                        as CssKnownProps['blockSize'     ],
        imageInlineSizeMd   : '60px'                                                        as CssKnownProps['inlineSize'    ],
        imageBlockSizeMd    : 'auto'                                                        as CssKnownProps['blockSize'     ],
        imageInlineSizeLg   : '96px'                                                        as CssKnownProps['inlineSize'    ],
        imageBlockSizeLg    : 'auto'                                                        as CssKnownProps['blockSize'     ],
        
        
        
        // names:
        nameFontSizeSm      : typos.fontSizeSm                                              as CssKnownProps['fontSize'      ],
        nameFontSizeMd      : typos.fontSizeMd                                              as CssKnownProps['fontSize'      ],
        nameFontSizeLg      : typos.fontSizeLg                                              as CssKnownProps['fontSize'      ],
        nameFontFamily      : 'inherit'                                                     as CssKnownProps['fontFamily'    ],
        nameFontWeight      : typos.fontWeightSemibold                                      as CssKnownProps['fontWeight'    ],
        nameFontStyle       : 'inherit'                                                     as CssKnownProps['fontStyle'     ],
        nameTextDecoration  : 'inherit'                                                     as CssKnownProps['textDecoration'],
        nameLineHeight      : 'inherit'                                                     as CssKnownProps['lineHeight'    ],
        
        
        
        // emails:
        emailFontSizeSm     : typos.fontSizeSm                                              as CssKnownProps['fontSize'      ],
        emailFontSizeMd     : [['calc((', typos.fontSizeSm, '+', typos.fontSizeMd, ')/2)']] as CssKnownProps['fontSize'      ],
        emailFontSizeLg     : typos.fontSizeMd                                              as CssKnownProps['fontSize'      ],
        emailFontFamily     : 'inherit'                                                     as CssKnownProps['fontFamily'    ],
        emailFontWeight     : 'inherit'                                                     as CssKnownProps['fontWeight'    ],
        emailFontStyle      : 'inherit'                                                     as CssKnownProps['fontStyle'     ],
        emailTextDecoration : 'inherit'                                                     as CssKnownProps['textDecoration'],
        emailLineHeight     : 'inherit'                                                     as CssKnownProps['lineHeight'    ],
    };
    
    
    
    const defaults = {
        // spacings:
        paddingInline       : bases.paddingInlineMd                                         as CssKnownProps['paddingInline' ],
        paddingBlock        : bases.paddingBlockMd                                          as CssKnownProps['paddingBlock'  ],
        
        gapInline           : bases.gapInlineMd                                             as CssKnownProps['gapInline'     ],
        gapBlock            : bases.gapBlockMd                                              as CssKnownProps['gapBlock'      ],
        
        
        
        // images:
        imageInlineSize     : bases.imageInlineSizeMd                                       as CssKnownProps['inlineSize'    ],
        imageBlockSize      : bases.imageBlockSizeMd                                        as CssKnownProps['blockSize'     ],
        
        
        
        // names:
        nameFontSize        : bases.nameFontSizeMd                                          as CssKnownProps['fontSize'      ],
        
        
        
        // emails:
        emailFontSize       : bases.emailFontSizeMd                                         as CssKnownProps['fontSize'      ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'sgInInfo' });
