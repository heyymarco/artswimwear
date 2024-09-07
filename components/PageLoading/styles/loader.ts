// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const usePageLoadingStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'aj8573q2a4', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
