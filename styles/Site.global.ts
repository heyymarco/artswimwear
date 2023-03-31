// cssfn:
import {
    // writes css in javascript:
    rule,
    globalScope,
}                           from '@cssfn/core'          // writes css in javascript

import { spacers } from '@reusable-ui/core'
import { navbars } from '@reusable-ui/components'



// styles:
export default [
    globalScope({
        ...rule('html', {
            // scrolls:
            scrollPaddingBlockStart : `calc(${navbars.blockSize} + ${spacers.sm})`,
        }),
    }),
];