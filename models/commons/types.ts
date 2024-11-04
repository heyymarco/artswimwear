export interface Model {
    id : string
}
export type PartialModel<TModel extends Model> =
    Pick<TModel, 'id'>
    & Partial<Omit<TModel, 'id'>>



export interface Pagination<TEntry> {
    total    : number
    entities : TEntry[]
}



export type MutationArgs<TModel extends Model> =
    & Required<Pick<TModel, 'id'>> // the [id] field is required
    & Partial<Omit<TModel, 'id'>>  // the [..rest] fields are optional

export interface PaginationArgs {
    page     : number
    perPage  : number
}



export type Literal =
    |null
    |string
    |number
    |boolean
export type Json =
    |Literal
    |Array<Json>
    |{ [key: string]: Json }
