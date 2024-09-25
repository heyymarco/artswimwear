// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useMoveWishDialogStyleSheets = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'p8i7opot49' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
