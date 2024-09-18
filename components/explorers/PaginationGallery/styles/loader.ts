// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles';
export const usePaginationGalleryStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'pnu0x3g63y' });
