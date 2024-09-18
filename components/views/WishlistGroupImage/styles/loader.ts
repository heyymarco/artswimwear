// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const useWishlistGroupImageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'eb49447y49' });
