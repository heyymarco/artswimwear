// reusable-ui core:
import {
    // react helper hooks:
    EventHandler,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
    // CollapsibleEventProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// types:
interface CollapsibleEventProps {
    onExpandStart   ?: EventHandler<any>
    onExpandEnd     ?: EventHandler<any>
    onCollapseStart ?: EventHandler<any>
    onCollapseEnd   ?: EventHandler<any>
}
export type CollapsibleSuspendableProps<TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent> = CollapsibleProps<TExpandedChangeEvent> & CollapsibleEventProps
