import {
    type Model,
} from '@/libs/types'



export const selectId       = <TModel extends Model>(model: TModel) => model.id;
export const selectWithSort = <TModel extends {}>(model: TModel, index: number) => ({ ...model, sort: index, });
