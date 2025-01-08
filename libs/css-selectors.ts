// utilities:
export const getInvalidFields = (containerOrElements: Element|null|undefined | Array<Element|null|undefined>): Element[] => {
    // conditions:
    if (!containerOrElements) return [];
    
    
    
    /*
        Invalid elements:
        * Any elements with any `[aria-invalid]` attribute except `[aria-invalid="false"]`, `[aria-invalid=""]`.
        * Any element with `:invalid` which is not overridden by `[aria-invalid="false"]`, `[aria-invalid=""]`.
    */
    const invalidSelector = ':is(:invalid, [aria-invalid]):not(:is([aria-invalid="false"], [aria-invalid=""]))';
    const invalidElements = (
        Array.isArray(containerOrElements)
        ? containerOrElements.filter((element): element is Exclude<typeof element, null|undefined> => !!element && element.matches(invalidSelector))
        : containerOrElements.querySelectorAll(invalidSelector)
    );
    const results : Element[] = [];
    outerLoop: for (const invalidElement of invalidElements) {
        const ariaLabel = invalidElement.getAttribute('aria-label');
        if (ariaLabel) {
            // If the element itself has `aria-label`, select the element itself:
            results.push(invalidElement);
            continue;
        } // if
        
        
        
        for (
            let ancestor = invalidElement.parentElement,
            depth        = 1
            ;
            ancestor && (depth <= 5)
            ;
            depth++
        ) {
            // found:
            if (ancestor.hasAttribute('aria-label')) {
                // If the element doesn't have `aria-label`, select the nearest ancestor having `aria-label`:
                results.push(ancestor);
                continue outerLoop;
            } // if
            
            
            
            // continue searching:
            ancestor = ancestor.parentElement;
        } // for
        
        
        
        // If no `aria-label` found, select the element itself:
        results.push(invalidElement);
    } // for
    return results;
}
