// cssfn:
import {
    // writes css in javascript:
    children,
    scope,
}                           from '@cssfn/core'                  // writes css in javascript



// styles:
export default () => [
    scope('main', {
        // layouts:
        display : 'grid',
        
        
        
        // children:
        ...children('article', {
            // layouts:
            display : 'grid',
        }),
    }),
    
    scope('loadingIndicator', {
        // positions:
        justifySelf : 'center', // center self horizontally
        alignSelf   : 'center', // center self vertically
        
        
        
        // typos:
        fontSize    : '4rem',
    }),
    
    scope('statusMessage', {
        // layouts:
        display      : 'grid',
        justifyItems : 'center', // center items horizontally
        alignItems   : 'center', // center items vertically
        alignContent : 'center', // center items group vertically (in case of full screen height)
        
        
        
        // children:
        ...children(['h5', 'p'], {
            // positions:
            justifySelf : 'stretch', // stretch self horizontally
            
            
            
            // sizes:
            contain     : 'inline-size',
            
            
            
            // typos:
            textAlign   : 'center',
        }),
    }),
];
