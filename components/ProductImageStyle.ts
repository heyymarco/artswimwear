// cssfn:
import {
    // writes css in javascript:
    children,
    rule,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



// const imageSize = 255;  // 255px
export default () => style({
    // layouts:
    display        : 'flex',
    flexDirection  : 'column',
    justifyContent : 'center',
    alignItems     : 'center',
    
    
    
    // positions:
    position       : 'relative',
    
    
    
    // sizes:
    // width          : `${imageSize}px`,
    aspectRatio    : '1/1',
    
    
    
    // backgrounds:
    background     : 'white',
    
    
    
    // children:
    ...children(':where(img)', {
        // positions:
        // position   : 'absolute',              // fill the <figure> BUT can't take space
        position   : ['relative', '!important'], // fill the <figure> AND can take space // to override <NextImage>
        
        
        
        // appearances:
        objectFit  : 'contain', // default to contain (no image part is loss)
        visibility : 'visible', // override Site.global
        
        
        
        // sizes:
        flex : [[0, 0, 'auto']], // ungrowable, unshrinkable, initial from it's height
        ...rule(':not([width])', {
            width  : ['100%', '!important'], // to override <NextImage>
        }),
        ...rule(':not([height])', {
            height : ['100%', '!important'], // to override <NextImage>
        }),
    }),
    ...children(':where(.status)', {
        // positions:
        position   : 'absolute',
        zIndex     : 99,
        
        
        
        // typos:
        fontSize   : '2rem',
    }),
});
