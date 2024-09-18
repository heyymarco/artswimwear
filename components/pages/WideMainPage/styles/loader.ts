// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useWideMainPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'wbbzkdk5x8' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
