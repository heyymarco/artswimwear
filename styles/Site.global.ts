// cssfn:
import {
    // writes css in javascript:
    rule,
    globalScope,
}                           from '@cssfn/core'          // writes css in javascript

import { navbars } from '@reusable-ui/components'



// styles:
export default [
    globalScope({
        ...rule('html', {
            // scrolls:
            scrollPaddingBlockStart : navbars.blockSize,
        }),
    }),
];