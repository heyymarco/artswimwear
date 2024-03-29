// types:
export interface PaginationArgs {
    page    ?: number
    perPage ?: number
}
export interface Pagination<TEntry> {
    total    : number
    entities : TEntry[]
}



export interface Model {
    id : string
}



export type MutationArgs<TEntry extends { id: number|string }> =
    & Required<Pick<TEntry, 'id'>> // the [id] field is required
    & Partial<Omit<TEntry, 'id'>>  // the [..rest] fields are optional
