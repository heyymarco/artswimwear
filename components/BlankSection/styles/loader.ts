// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useBlankSectionStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'hsje8if34b' });
import './styles';
