// react-redux:
import {
    type MutationDefinition,
    type BaseQueryFn,
    type QueryArgFrom,
    type MutationActionCreatorResult,
}                           from '@reduxjs/toolkit/dist/query'

// reusable-ui components:
import {
    // dialog-components:
    type ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import {
    type Model,
    type MutationArgs,
}                           from '@/models'



// types:
export type KeyOfModel<TModel extends Model>   = Exclude<keyof TModel, 'id'> // all Model's keys except id
export type ValueOfModel<TModel extends Model> = TModel[KeyOfModel<TModel>]  // union values of Model's keys except id
export type SimpleEditModelDialogResult<TModel extends Model> = ValueOfModel<TModel>|undefined // ValueOfModel<TModel>: created|updated; undefined: not created|modified
export interface SimpleEditModelDialogExpandedChangeEvent<TModel extends Model> extends ModalExpandedChangeEvent<SimpleEditModelDialogResult<TModel>> {}

export type InitialValueHandler  <TModel extends Model, TEdit extends keyof any = KeyOfModel<TModel>> = (                             edit: TEdit, model: TModel) => ValueOfModel<TModel>
export type TransformValueHandler<TModel extends Model, TEdit extends keyof any = KeyOfModel<TModel>> = (value: ValueOfModel<TModel>, edit: TEdit, model: TModel) => MutationArgs<TModel>

export type UseUpdateModel<TModel extends Model> = () => UpdateModelApi<TModel>

// export type MutationTrigger<D extends MutationDefinition<any, any, any, any>> = (arg: QueryArgFrom<D>) => MutationActionCreatorResult<D>
export type MutationTrigger<D extends MutationDefinition<any, any, any, any>> = {
    /**
     * Triggers the mutation and returns a Promise.
     * @remarks
     * If you need to access the error or success payload immediately after a mutation, you can chain .unwrap().
     *
     * @example
     * ```ts
     * // codeblock-meta title="Using .unwrap with async await"
     * try {
     *   const payload = await addPost({ id: 1, name: 'Example' }).unwrap();
     *   console.log('fulfilled', payload)
     * } catch (error) {
     *   console.error('rejected', error);
     * }
     * ```
     */
    (arg: QueryArgFrom<D>): MutationActionCreatorResult<D>;
}
export type UpdateModelApi<TModel extends Model> = readonly [
    MutationTrigger<MutationDefinition<MutationArgs<TModel>, BaseQueryFn<any, unknown, unknown, {}, {}>, string, TModel>>,
    
    {
        isLoading : boolean
    },
]
