// reusable-ui core:
import {
    // a capability of UI to expand/reduce its size or toggle the visibility:
    type ExpandedChangeEvent,
    type CollapsibleProps,
    type CollapsibleEventProps,
    type ControllableCollapsibleProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    type Model,
    type PartialModel,
}                           from '@/libs/types'



export interface ModelCreateProps
    extends
        CollapsibleProps<ExpandedChangeEvent>,
        CollapsibleEventProps,
        ControllableCollapsibleProps<ExpandedChangeEvent>
{
}

export type CreateHandler<TModel extends Model> = (createdModel: PartialModel<TModel>) => void|Promise<void>
