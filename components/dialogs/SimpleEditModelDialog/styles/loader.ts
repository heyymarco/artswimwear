// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const useSimpleEditModelDialogStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'r1hbagluho', specificityWeight: 3 }); // need 3 degrees to overwrite `.cardClass.body`
