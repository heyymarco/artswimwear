// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useProductGalleryPageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./styles')
, { id: 'sfrw8fp38l' });
