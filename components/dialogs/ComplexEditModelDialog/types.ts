// reusable-ui components:
import {
    // dialog-components:
    type ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import {
    type Model,
    type PartialModel,
}                           from '@/models'



// types:
export type ComplexEditModelDialogResult<TModel extends Model> = PartialModel<TModel>|false|undefined // TModel: created|updated; false: deleted; undefined: not created|modified
export interface ComplexEditModelDialogExpandedChangeEvent<TModel extends Model> extends ModalExpandedChangeEvent<ComplexEditModelDialogResult<TModel>> {}

export type UpdateSideHandler                           = () => void|Promise<void>
export type DeleteSideHandler                           = () => void|Promise<void>
