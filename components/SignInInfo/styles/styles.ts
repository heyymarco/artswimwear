// cssfn:
import {
    // writes css in javascript:
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
    memoizeStyle,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onBasicStylesChange,
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component

// internals:
import {
    // configs:
    signInInfos,
    cssSignInInfoConfig,
}                           from './config'



// styles:
export const onSignInInfoStylesChange = watchChanges(onBasicStylesChange, cssSignInInfoConfig.onChange);

export const usesSignInInfoLayout = memoizeStyle(() => {
    // dependencies:
    
    // features:
    const {paddingRule, paddingVars} = usesPadding(signInInfos);
    
    
    
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display      : 'grid',
            gridTemplate : [[
                '"image  ...." 1fr',
                '"image  name" auto',
                '"image email" auto',
                '"image  ...." 1fr',
                '/',
                'max-content 1fr',
            ]],
            alignItems   : 'center', // center items vertically
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            
            
            // children:
            ...children('.image', {
                // positions:
                gridArea    : 'image',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signInInfos, 'image')), // apply config's cssProps starting with image***
            }),
            ...children(['.name', '.email'], {
                // typos:
                // crops very long word:
                overflow     : 'hidden',
                textWrap     : 'nowrap',
                textOverflow : 'ellipsis',
            }),
            ...children('.name', {
                // positions:
                gridArea    : 'name',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signInInfos, 'name')), // apply config's cssProps starting with name***
            }),
            ...children('.email', {
                // positions:
                gridArea    : 'email',
                
                
                
                // customize:
                ...usesCssProps(usesPrefixedProps(signInInfos, 'email')), // apply config's cssProps starting with email***
            }),
            
            
            
            // customize:
            ...usesCssProps(signInInfos), // apply config's cssProps
        }),
        
        
        
        // features:
        ...paddingRule(), // must be placed at the last
    });
}, onSignInInfoStylesChange);

export const usesSignInInfoVariants = memoizeStyle(() => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(signInInfos);
    
    
    
    return style({
        // variants:
        ...usesBasicVariants(),
        ...resizableRule(),
    });
}, onSignInInfoStylesChange);

export default () => style({
    // layouts:
    ...usesSignInInfoLayout(),
    
    // variants:
    ...usesSignInInfoVariants(),
});
