// cssfn:
import {
    style,
    scope,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesCardLayout = () => {
    return style({
        // positions:
        justifySelf   : 'center',
        
        
        
        // sizes:
        maxInlineSize : 'max-content',
    });
};

export default () => [
    scope('card', {
        // layouts:
        ...usesCardLayout(),
    }, { specificityWeight: 2 }),
];
