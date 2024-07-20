// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const usePayPalHostedFieldStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'wmb3h4622b' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
