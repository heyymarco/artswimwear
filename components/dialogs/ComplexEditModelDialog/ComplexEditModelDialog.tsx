// internals:
import type {
    Model,
    PartialModel,
}                           from '@/libs/types'



// react components:
export type ComplexEditModelDialogResult<TModel extends Model> = PartialModel<TModel>|false|undefined // TModel: created|updated; false: deleted; undefined: not created|modified
