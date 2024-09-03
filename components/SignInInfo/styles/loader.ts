// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useSignInInfoStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'dh1336gn1c' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
