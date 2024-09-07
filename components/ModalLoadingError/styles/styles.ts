// cssfn:
import {
    children,
    style,
}                           from '@cssfn/core'          // writes css in javascript



// styles:
const usesModalLoadingErrorLayout = () => {
    return style({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...children('.loadingBar', {
            alignSelf: 'stretch',
        }),
    });
};

export default style({
    // layouts:
    ...usesModalLoadingErrorLayout(),
});