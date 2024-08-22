// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useSignInPageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'kpwsaj27dr' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
