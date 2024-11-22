// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles'
export const useEditPaymentMethodDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'e4w923s71x' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
