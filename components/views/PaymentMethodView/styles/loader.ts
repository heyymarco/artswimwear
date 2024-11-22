// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const usePaymentMethodViewStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'wog75cr1st' });
