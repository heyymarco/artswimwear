// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useSignInBusyDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'x4j66wdff2' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names