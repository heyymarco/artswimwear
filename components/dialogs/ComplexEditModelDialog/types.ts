// react:
import {
    // react:
    type default as React,
}                           from 'react'

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

export type UpdateHandler<TModel extends Model>         = (args: { id: string|null, whenAdd: boolean, whenUpdate: Record<string, boolean> }) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type UpdateDraftHandler<TModel extends Model>    = (args: { draftModel: TModel, whenAdd: boolean, whenUpdate: Record<string, boolean> }) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type UpdatedHandler<TModel extends Model>        = (updatedModel: PartialModel<TModel>) => void|Promise<void>
export type AfterUpdateHandler                          = () => void|Promise<void>

export type DeleteHandler<TModel extends Model>         = (deletingModel: TModel, arg?: unknown|undefined) => void|Promise<void>
export type AfterDeleteHandler                          = () => void|Promise<void>

export type UpdateSideHandler                           = () => void|Promise<void>
export type DeleteSideHandler                           = () => void|Promise<void>

export type ConfirmDeleteHandler<TModel extends Model>  = (args: { model: TModel      }) => { title?: React.ReactNode, message: React.ReactNode }
export type ConfirmUnsavedHandler<TModel extends Model> = (args: { model: TModel|null }) => { title?: React.ReactNode, message: React.ReactNode }
