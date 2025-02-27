// reusable-ui core:
import {
    // react helper hooks:
    type EventHandler,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    type ExpandedChangeEvent,
    type CollapsibleProps,
    type CollapsibleEventProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// types:
export type CollapsibleSuspendableProps<TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent> = CollapsibleProps<TExpandedChangeEvent> & CollapsibleEventProps
