// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



export const useCartBarStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'zkq40gkrgq' });
import './styles';
