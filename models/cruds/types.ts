// models:
import {
    type Model,
    type PartialModel,
}                           from '@/models'



// Handlers for displaying confirmation dialogs:
/**
 * Represents a confirmation message for model-related actions.
 */
export interface ModelConfirmMessage {
    /**
     * The title of the confirmation message.
     */
    title   ?: React.ReactNode
    /**
     * The content of the confirmation message.
     */
    message  : React.ReactNode
}
/**
 * Handler for confirming deletion of a model.
 * @param draft - The draft model to be deleted.
 * @param event - The event triggered by clicking the delete button.
 * @returns A confirmation message.
 */
export type ModelConfirmDeleteEventHandler             <in     TModel extends Model, in TModelConfirmDeleteEvent      extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelConfirmDeleteEvent                                              ) => ModelConfirmMessage
/**
 * Handler for confirming unsaved changes of a model.
 * @param draft - The draft model with unsaved changes.
 * @param event - The event triggered by clicking the close button.
 * @returns A confirmation message.
 */
export type ModelConfirmUnsavedEventHandler            <in     TModel extends Model, in TModelConfirmUnsavedEvent     extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel|undefined    , event: TModelConfirmUnsavedEvent                                             ) => ModelConfirmMessage



// Handlers for creating, updating, or deleting models:
/**
 * Options for creating or updating a model.
 */
export interface ModelCreatingOrUpdatingOptions {
    /**
     * Indicates if the current user has permission to add a new entry.
     */
    addPermission     : boolean
    /**
     * Controls which parts of the model the current user is allowed to update.
     */
    updatePermissions : Record<string, boolean>
}
/**
 * Options for deleting a model.
 */
export interface ModelDeletingOptions {
    /**
     * Additional options for deleting a model.
     */
    [key: string]     : unknown
}
/**
 * Handler for creating or updating a model.
 * @param id - The ID of the model to be created or updated.
 * @param event - The event triggered by clicking the save or update button.
 * @param options - Options for creating or updating the model.
 * @returns A partial model or a promise that resolves to a partial model.
 */
export type ModelCreatingOrUpdatingEventHandler        <   out TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (id   : string|undefined    , event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => PartialModel<TModel>|Promise<PartialModel<TModel>>
/**
 * Handler for creating or updating a draft model.
 * @param draft - The draft model to be created or updated.
 * @param event - The event triggered by clicking the save or update button.
 * @param options - Options for creating or updating the draft model.
 * @returns A partial model or a promise that resolves to a partial model.
 */
export type ModelCreatingOrUpdatingOfDraftEventHandler <in out TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => PartialModel<TModel>|Promise<PartialModel<TModel>>
/**
 * Handler for deleting a model.
 * @param draft - The draft model to be deleted.
 * @param event - The event triggered by clicking the delete button.
 * @param options - Options for deleting the model.
 * @returns A void or a promise that resolves to void.
 */
export type ModelDeletingEventHandler                  <in     TModel extends Model, in TModelDeletingEvent           extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (draft: TModel              , event: TModelDeletingEvent          , options: ModelDeletingOptions|undefined) => void|Promise<void>



// Handlers for creating, updating, or deleting related external models, such as linked image URLs on external storage:
/**
 * Handler for creating or updating a related external model.
 * @param model - The partial model to be created or updated.
 * @param event - The event triggered by clicking the save or update button.
 * @param options - Options for creating or updating the related external model.
 * @returns A void or a promise that resolves to void.
 */
export type SideModelCreatingOrUpdatingEventHandler    <in     TModel extends Model, in TModelCreatingOrUpdatingEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model: PartialModel<TModel>, event: TModelCreatingOrUpdatingEvent, options: ModelCreatingOrUpdatingOptions) => void|Promise<void>
/**
 * Handler for deleting a related external model.
 * @param model - The model to be deleted.
 * @param event - The event triggered by clicking the delete button.
 * @param options - Options for deleting the related external model.
 * @returns A void or a promise that resolves to void.
 */
export type SideModelDeletingEventHandler              <in     TModel extends Model, in TModelDeletingEvent           extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model:              TModel , event: TModelDeletingEvent          , options: ModelDeletingOptions|undefined) => void|Promise<void>



// Handlers for actions after creating, updating, or deleting models:
/**
 * Handler for actions after a model has been created or updated.
 * @param model - The partial model that was created or updated.
 * @param event - The event triggered by clicking the save or update button.
 * @param options - Options for the action after creating or updating the model.
 * @returns A void or a promise that resolves to void.
 */
export type ModelCreatedOrUpdatedEventHandler          <in     TModel extends Model, in TModelCreatedOrUpdatedEvent   extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model: PartialModel<TModel>, event: TModelCreatedOrUpdatedEvent  , options: ModelCreatingOrUpdatingOptions) => void|Promise<void>
/**
 * Handler for actions after a model has been deleted.
 * @param model - The model that was deleted.
 * @param event - The event triggered by clicking the delete button.
 * @param options - Options for the action after deleting the model.
 * @returns A void or a promise that resolves to void.
 */
export type ModelDeletedEventHandler                   <in     TModel extends Model, in TModelDeletedEvent            extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (model:              TModel , event: TModelDeletedEvent           , options: ModelDeletingOptions|undefined) => void|Promise<void>
