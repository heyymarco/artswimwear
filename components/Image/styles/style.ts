// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



export default () => style({
    // layouts:
    display        : ['inline-flex', '!important'],
    flexDirection  : 'row',    // we'll manipulate the <img> width
    justifyContent : 'center',
    alignItems     : 'center',
    
    
    
    // sizes:
    width          : 'fit-content', // follows the <img> width
    
    
    
    // children:
    ...children(':where(img)', {
        // positions:
        // position   : 'absolute',              // fill the <figure> BUT can't take space
        position   : ['relative', '!important'], // fill the <figure> AND can take space // !important : to override <NextImage>
        
        
        
        // appearances:
        objectFit  : 'contain', // default to contain (no image part is loss)
        visibility : 'visible', // override Site.global
        
        
        
        // sizes:
        flex   : [[0, 0, 'auto']],       // ungrowable, unshrinkable, initial from <img>'s width // set to fixed_size to make customization easier
        width  : ['100%', '!important'], // follows the <figure>'s width  // !important : to override <NextImage>
        height : ['100%', '!important'], // follows the <figure>'s height // !important : to override <NextImage>
    }),
    ...children(':where(.status)', {
        // positions:
        position   : 'absolute',
        zIndex     : 99,
        
        
        
        // typos:
        fontSize   : '2rem',
    }),
});
