// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const usePageErrorStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'ph6g9f9c57' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
