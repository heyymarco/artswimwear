// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useIframeDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'ld0a0c6sm4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
