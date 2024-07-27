// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
import './styles';
export const useCaptchaDialogStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'sd1dw9ej28', specificityWeight: 3 }); // need 3 degrees to overwrite `.cardClass.body`
