// cssfn:
import {
    // writes css in javascript:
    children,
    style,
}                           from '@cssfn/core'                  // writes css in javascript



const imageSize = 255;  // 255px
export default () => style({
    // layouts:
    display        : 'flex',
    justifyContent : 'center',
    alignItems     : 'center',
    
    
    
    // positions:
    position       : 'relative',
    
    
    
    // sizes:
    width          : `${imageSize}px`,
    aspectRatio    : '1/1',
    
    
    
    // backgrounds:
    background     : 'white',
    
    
    
    // children:
    ...children(':where(img)', {
        visibility : 'visible',
        objectFit  : 'contain',
    }),
    ...children(':where(.status)', {
        fontSize   : '2rem',
    }),
});
