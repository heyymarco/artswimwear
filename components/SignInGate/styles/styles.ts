// cssfn:
import {
    // writes css in javascript:
    rule,
    fallback,
    descendants,
    children,
    style,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
const usesSignInGateLayout = () => {
    return style({
        // layouts:
        display  : 'grid',
        
        
        
        // spacings:
        gapBlock : spacers.md,
    });
};
const usesSignInSectionLayout = () => {
    return style({
        // layouts:
        display        : 'grid',
        justifyContent : 'center',
        
        
        
        // spacings:
        gapBlock       : spacers.sm,
    });
};
const usesSignInTextLayout = () => {
    return style({
        textAlign: 'center',
    });
};
const usesSignUpSectionLayout = () => {
    return style({
        // layouts:
        display        : 'flex',
        flexWrap       : 'wrap',
        justifyContent : 'center',
        alignItems     : 'center', // center vertically for text and button
        
        
        
        // spacings:
        gapInline       : spacers.sm,
    });
};
const usesSignUpTextLayout = () => {
    return style({
        textAlign: 'center',
    });
};

export default [
    scope('main', {
        // layouts:
        ...usesSignInGateLayout(),
    }),
    scope('signInSection', {
        // layouts:
        ...usesSignInSectionLayout(),
    }),
    scope('signInText', {
        // layouts:
        ...usesSignInTextLayout(),
    }),
    scope('signUpSection', {
        // layouts:
        ...usesSignUpSectionLayout(),
    }),
    scope('signUpText', {
        // layouts:
        ...usesSignUpTextLayout(),
    }),
];
