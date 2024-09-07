// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useOrderHistoryPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'nyz7q6sxvp' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
