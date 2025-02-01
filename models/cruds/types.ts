// models:
import {
    type Model,
    type PartialModel,
}                           from '@/models'



// Handlers for displaying confirmation dialogs:
export interface ModelConfirmMessage {
    title   ?: React.ReactNode
    message  : React.ReactNode
}
export type ModelConfirmDeleteEventHandler             <in     TModel extends Model, in TModelConfirmDeleteEvent      extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelConfirmDeleteEvent                                              ) => ModelConfirmMessage
export type ModelConfirmUnsavedEventHandler            <in     TModel extends Model, in TModelConfirmUnsavedEvent     extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel|undefined    , event: TModelConfirmUnsavedEvent                                             ) => ModelConfirmMessage



// Handlers for creating, updating, or deleting models:
export interface ModelCreatingOrUpdatingOptions {
    addPermission     : boolean
    updatePermissions : Record<string, boolean>
}
export interface ModelDeletingOptions {
    [key: string]     : unknown
}
export type ModelCreatingOrUpdatingEventHandler        <   out TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (id   : string|undefined    , event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type ModelCreatingOrUpdatingOfDraftEventHandler <in out TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => PartialModel<TModel>|Promise<PartialModel<TModel>>
export type ModelDeletingEventHandler                  <in     TModel extends Model, in TModelDeletingEvent           extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelDeletingEvent          , options: ModelDeletingOptions|undefined) => void|Promise<void>



// Handlers for creating, updating, or deleting related external models, such as linked image URLs on external storage:
export type SideModelCreatingOrUpdatingEventHandler    <in     TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model: PartialModel<TModel>, event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => void|Promise<void>
export type SideModelDeletingEventHandler              <in     TModel extends Model, in TModelDeletingEvent           extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model:              TModel , event: TModelDeletingEvent          , options: ModelDeletingOptions|undefined) => void|Promise<void>



// Handlers for actions after creating, updating, or deleting models:
export type ModelCreatedOrUpdatedEventHandler          <in     TModel extends Model, in TModelCreatedOrUpdatedEvent   extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model: PartialModel<TModel>, event: TModelCreatedOrUpdatedEvent  , options: ModelCreatingOrUpdatingOptions) => void|Promise<void>
export type ModelDeletedEventHandler                   <in     TModel extends Model, in TModelDeletedEvent            extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model:              TModel , event: TModelDeletedEvent           , options: ModelDeletingOptions|undefined) => void|Promise<void>
