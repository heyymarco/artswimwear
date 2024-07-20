// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useStripeHostedFieldStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'ay7mvxa7bj' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
