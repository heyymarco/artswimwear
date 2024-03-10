// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useSelectVariantEditorStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'vpg58pxrfe' });