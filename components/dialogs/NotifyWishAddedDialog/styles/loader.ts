// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useNotifyWishAddedDialogStyleSheets = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'ck4iguv0os' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
