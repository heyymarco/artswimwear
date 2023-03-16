// cssfn:
import {
    // writes css in javascript:
    states,
    style,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a possibility of UI having an invalid state:
    ifValid,
    ifInvalid,
    usesInvalidable,
    markValid,
    markInvalid,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    editableControls,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components


// styles:
export const usesCountryButtonStates = () => {
    // dependencies:
    
    // states:
    const {invalidableRule} = usesInvalidable(editableControls);
    
    
    
    return style({
        // states:
        ...invalidableRule(),
        ...states([
            ifValid(markValid()),
            ifInvalid(markInvalid()),
        ]),
    });
};

export default () => style({
    // states:
    ...usesCountryButtonStates(),
});