// cssfn:
import {
    // writes css in javascript:
    rule,
    descendants,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
    // size options of UI:
    usesResizable,
    
    
    
    // a capability of UI to be disabled:
    usesDisableable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // elements:
    uploadImageMediaGroupElm,
    uploadImageMediaGroupInnerElm,
    uploadImageDeletingImageTitleElm,
    uploadImageUploadingImageTitleElm,
    uploadImageUploadingImageErrorTitleElm,
    uploadImageNoImageElm,
    uploadImagePreviewImageElm,
    uploadImageImageElm,
    uploadImageBusyElm,
    uploadImageUploadProgressElm,
    uploadImageUploadErrorElm,
    
    uploadImageActionGroupElm,
    uploadImageSelectButtonElm,
    uploadImageDeleteButtonElm,
    uploadImageRetryButtonElm,
    uploadImageCancelButtonElm,
    
    uploadImageInputFileElm,
}                           from './elements'
import {
    // configs:
    uploadImages,
    cssUploadImageConfig,
}                           from './config'



// styles:
export const onUploadImageStylesChange = watchChanges(cssUploadImageConfig.onChange);

export const usesUploadImageLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null, // never, calculate the inner border radius manually
        orientationBlockSelector  : null, // never, calculate the inner border radius manually
        itemsSelector             : null, // never, calculate the inner border radius manually
    });
    
    // features:
    const {animationRule, animationVars} = usesAnimation(uploadImages as any);
    const {paddingRule  , paddingVars  } = usesPadding(usesPrefixedProps(uploadImages, 'media'));
    
    
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // layouts:
        display      : 'grid',
        gridTemplate : [[
            '"mediaGroup actionGroup" auto',
            '/',
            '1fr 1fr'
        ]],
        ...rule('.readonly', {
            gridTemplate : [[
                '"mediaGroup" auto',
                '/',
                '1fr'
            ]],
        }),
        
        
        
        // spacings:
        gap : spacers.default,
        
        
        
        // children:
        ...children(uploadImageMediaGroupElm, {
            // capabilities:
            ...groupableRule(), // make a nicely rounded corners
            
            
            
            // layouts:
            ...style({
                // positions:
                justifySelf    : 'center', // center the self horizontally
                alignSelf      : 'center', // center the self vertically
                
                
                
                // layouts:
                display        : 'grid',
                gridTemplate   : [[
                    '"image" auto',
                    '/',
                    'auto'
                ]],
                justifyItems   : 'center',  // default center the items horizontally
                alignItems     : 'center',  // default center the items vertically
                justifyContent : 'stretch', // force the width  follows aspectRatio
                alignContent   : 'stretch', // force the height follows aspectRatio
                
                
                
                // children:
                ...children([uploadImageNoImageElm, uploadImagePreviewImageElm, uploadImageImageElm, uploadImageMediaGroupInnerElm], {
                    // positions:
                    gridArea : 'image',
                }),
                ...children([uploadImagePreviewImageElm, uploadImageImageElm, uploadImageMediaGroupInnerElm], {
                    // borders:
                    // clone <Item>'s border radius:
                    borderStartStartRadius : `calc(${groupableVars.borderStartStartRadius} - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                    borderStartEndRadius   : `calc(${groupableVars.borderStartEndRadius}   - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                    borderEndStartRadius   : `calc(${groupableVars.borderEndStartRadius}   - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                    borderEndEndRadius     : `calc(${groupableVars.borderEndEndRadius}     - ${groupableVars.borderWidth} - min(${groupableVars.borderWidth}, 0.5px))`,
                    
                    
                    
                    // spacings:
                    marginInline  : negativePaddingInline, // cancel out parent's padding with negative margin
                    marginBlock   : negativePaddingBlock,  // cancel out parent's padding with negative margin
                }),
                ...children([uploadImagePreviewImageElm, uploadImageImageElm], {
                    // positions:
                    justifySelf    : 'stretch', // stretch the self horizontally
                    alignSelf      : 'stretch', // stretch the self vertically
                    // justifySelf    : 'center', // center the self horizontally
                    // alignSelf      : 'center', // center the self vertically
                    
                    
                    
                    // sizes:
                    minInlineSize  : 0,         // starts growing from 0px up to "image" gridArea
                    minBlockSize   : 0,         // starts growing from 0px up to "image" gridArea
                    // maxInlineSize  : '100%', // do not overflow the "image" gridArea
                    // maxBlockSize   : '100%', // do not overflow the "image" gridArea
                }),
                ...children(uploadImageNoImageElm, {
                    ...children('::after', {
                        // layouts:
                        display        : 'flex',   // use block flexbox, so it takes the entire parent's width
                        flexDirection  : 'column', // items are stacked vertically
                        justifyContent : 'center', // center items vertically
                        alignItems     : 'center', // center items horizontally
                        flexWrap       : 'nowrap', // no wrapping
                    }),
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'noImage')), // apply config's cssProps starting with noImage***
                }),
                ...children(uploadImagePreviewImageElm, {
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'previewImage')), // apply config's cssProps starting with previewImage***
                }),
                ...children(uploadImageImageElm, {
                    // layouts:
                    ...style({
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'image')), // apply config's cssProps starting with image***
                        
                        
                        
                        // animations:
                        filter : animationVars.filter,
                        anim   : animationVars.anim,
                    }),
                    
                    
                    
                    // features:
                    ...animationRule(), // must be placed at the last
                }),
                ...children(uploadImageMediaGroupInnerElm, {
                    // positions:
                    justifySelf     : 'stretch', // fill the <parent> horizontally
                    alignSelf       : 'stretch', // fill the <parent> vertically
                    zIndex          : 1,         // placed on the top of <Image>
                    
                    
                    
                    // layouts:
                    display         : 'flex',    // use block flexbox, so it takes the entire parent's width
                    flexDirection   : 'column',  // the flex direction to vert
                    justifyContent  : 'center',  // center items vertically
                    alignItems      : 'stretch', // stretch items horizontally
                    flexWrap        : 'nowrap',  // no wrapping
                    
                    
                    
                    // sizes:
                    contain         : 'size', // follows <Image>'s size, including fractional size, so the aspect ratio preserved accurately
                    
                    
                    
                    // spacings:
                    paddingInline   : positivePaddingInline, // restore parent's padding with positive margin
                    paddingBlock    : positivePaddingBlock,  // restore parent's padding with positive margin
                    gap             : spacers.default,
                    
                    
                    
                    // children:
                    
                    // titles & paragraphs:
                    ...descendants([uploadImageDeletingImageTitleElm, uploadImageUploadingImageTitleElm, uploadImageUploadingImageErrorTitleElm, 'p'], {
                        margin     : 0,        // no margin for <p>, <h1>...<h6>
                        textAlign  : 'center', // center text for <p>, <h1>...<h6>
                    }),
                    ...descendants([uploadImageDeletingImageTitleElm, uploadImageUploadingImageTitleElm, uploadImageUploadingImageErrorTitleElm], {
                        fontSize   : typos.fontSizeMd,
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'title')), // apply config's cssProps starting with title***
                    }),
                    
                    // deleting:
                    ...children(uploadImageBusyElm, {
                        // positions:
                        alignSelf   : 'center', // center the self horizontally
                        
                        
                        
                        // typos:
                        fontSize    : '3rem',
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'busy')), // apply config's cssProps starting with busy***
                    }),
                    
                    // uploading:
                    ...children(uploadImageUploadProgressElm, {
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadProgress')), // apply config's cssProps starting with uploadProgress***
                    }),
                    
                    // uploading error:
                    ...children(uploadImageUploadErrorElm, {
                        // positions:
                        alignSelf   : 'center', // center the self horizontally
                        
                        
                        
                        // layouts:
                        display     : 'grid',
                        
                        
                        
                        // spacings:
                        gap         : spacers.sm,
                        
                        
                        
                        // customize:
                        ...usesCssProps(usesPrefixedProps(uploadImages, 'uploadError')), // apply config's cssProps starting with uploadError***
                    }),
                    
                    
                    
                    // customize:
                    ...usesCssProps(usesPrefixedProps(uploadImages, 'mediaInner')), // apply config's cssProps starting with mediaInner***
                }),
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'media')), // apply config's cssProps starting with media***
                
                
                
                // spacings:
                /* important to be placed after "customize" */
             // padding       : paddingVars.padding,
                paddingInline : paddingVars.paddingInline,
                paddingBlock  : paddingVars.paddingBlock,
            }),
            
            
            
            // features:
            ...paddingRule(), // must be placed at the last
        }),
        
        ...children(uploadImageActionGroupElm, {
            // positions:
            gridArea        : 'actionGroup',
            
            
            
            // layouts:
            display         : 'flex',    // use block flexbox, so it takes the entire parent's width
            flexDirection   : 'column',  // the flex direction to vert
            justifyContent  : 'center',  // center items vertically
            alignItems      : 'stretch', // stretch items horizontally
            flexWrap        : 'nowrap',  // no wrapping
            
            
            
            // spacings:
            gap             : spacers.default,
            
            
            
            // children:
            ...children(uploadImageSelectButtonElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'selectButton')), // apply config's cssProps starting with selectButton***
            }),
            ...children(uploadImageDeleteButtonElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'deleteButton')), // apply config's cssProps starting with deleteButton***
            }),
            ...children(uploadImageRetryButtonElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'retryButton')), // apply config's cssProps starting with retryButton***
            }),
            ...children(uploadImageCancelButtonElm, {
                // customize:
                ...usesCssProps(usesPrefixedProps(uploadImages, 'cancelButton')), // apply config's cssProps starting with cancelButton***
            }),
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(uploadImages, 'action')), // apply config's cssProps starting with action***
        }),
        
        ...children(uploadImageInputFileElm, {
            // layouts:
            display: 'none',
        }),
        
        
        
        // customize:
        ...usesCssProps(uploadImages), // apply config's cssProps
    });
};

export const usesUploadImageVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(uploadImages);
    
    
    
    return style({
        // variants:
        ...resizableRule(),
    });
};

export const usesUploadImageStates = () => {
    // dependencies:
    
    // states:
    const {disableableRule} = usesDisableable(uploadImages);
    
    
    
    return style({
        // children:
        ...children(uploadImageMediaGroupElm, {
            ...children(uploadImageImageElm, {
                // states:
                ...disableableRule(),
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesUploadImageLayout(),
    
    // variants:
    ...usesUploadImageVariants(),
    
    // states:
    ...usesUploadImageStates(),
});
