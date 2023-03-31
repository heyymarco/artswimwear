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
    
    
    
    // positions:
    position       : 'relative',
    
    
    
    // sizes:
    width          : 'fit-content', // follows the <img> width
    
    
    
    // backgrounds:
    background     : 'white',
    
    
    
    // children:
    ...children(':where(img)', {
        // positions:
        // position   : 'absolute',              // fill the <figure> BUT can't take space
        position   : ['relative', '!important'], // fill the <figure> AND can take space // !important : to override <NextImage>
        
        
        
        // appearances:
        objectFit  : 'contain', // default to contain (no image part is loss)
        visibility : 'visible', // override Site.global
        
        
        
        // sizes:
        flex   : [[1, 1, 'auto']],       // growable, shrinkable, initial from <img>'s width
        width  : ['100%', '!important'], // follows the <figure>'s width    // !important : to override <NextImage>
        height : ['auto', '!important'], // follows the <img>'s aspectRatio // !important : to override <NextImage>
    }),
    ...children(':where(.status)', {
        // positions:
        position   : 'absolute',
        zIndex     : 99,
        
        
        
        // typos:
        fontSize   : '2rem',
    }),
});
