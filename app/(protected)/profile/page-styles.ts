// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    typos,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// styles:
export const usesProfilePageLayout = () => {
    return style({
        ...children(['&', 'section'], {
            // layouts:
            display        : 'grid',
        }),
        ...children('section>article', {
            // layouts:
            display        : 'grid',
            gridTemplate   : [[
                '"image  name" auto',
                '"image email" auto',
                '"image ....." auto',
                '/',
                '100px max-content',
            ]],
            justifyContent : 'center',
            alignContent   : 'center',
            
            
            
            // gap:
            gapInline : spacers.default,
            gapBlock  : spacers.sm,
            
            
            
            // children:
            ...children('.image', {
                gridArea: 'image',
            }),
            ...children('.name', {
                gridArea: 'name',
            }),
            ...children('.email', {
                gridArea: 'email',
            }),
        }),
    });
};

export default () => style({
    // layouts:
    ...usesProfilePageLayout(),
});
