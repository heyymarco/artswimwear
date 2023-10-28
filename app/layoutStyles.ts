// cssfn:
import {
    // writes css in javascript:
    mainScope,
}                           from '@cssfn/core'              // writes css in javascript

// reusable-ui core:
import {
    // reusable-ui configs:
    spacers,
}                           from '@reusable-ui/core'        // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // composite-components:
    navbars,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components



// styles:
export default [
    mainScope({
        // scrolls:
        scrollPaddingBlockStart : `calc(${navbars.blockSize} + ${spacers.sm})`,
    }),
];
