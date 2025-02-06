// models:
import {
    type Model,
    type PartialModel,
}                           from '@/models'



// Handlers for retrying errors:
/**
 * Handler for retrying an error.
 * @param param - The parameters for the handler.
 * @param param.error - The error that occurred.
 * @param param.event - The event triggered by clicking the retry button.
 * @returns A void or a promise that resolves to void.
 */
export type ModelRetryErrorEventHandler                <in     TError extends unknown   , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { error: TError              , event: TCrudEvent                                           }) => void|Promise<void>



// Handlers for viewing and selecting models:
/**
 * Handler for selecting a model.
 * @param param - The parameters for the handler.
 * @param param.model - The model to be selected, or null if no model is selected. It's a model because it is coming from view mode.
 * @param param.event - The event triggered by clicking the select button.
 * @returns A void or a promise that resolves to void.
 */
export type ModelSelectEventHandler                    <in     TModel extends Model|null, in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { model: TModel              , event: TCrudEvent                                           }) => void|Promise<void>

/**
 * Handler for toggling the selection of a model.
 * @param param - The parameters for the handler.
 * @param param.model - The model to be toggled. It's a model because it is coming from view mode.
 * @param param.event - The event triggered by clicking the select button.
 * @param param.selected - A boolean indicating whether the model is selected or not.
 * @returns A void or a promise that resolves to void.
 */
export type ModelToggleSelectEventHandler              <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { model: TModel              , event: TCrudEvent, selected: boolean                        }) => void|Promise<void>



// Handlers for entering and quitting edit mode:
/**
 * Handler for entering edit mode from view mode.
 * @param param - The parameters for the handler.
 * @param param.model - The model to be edited. It's a model because it is coming from view mode.
 * @param param.event - The event triggered by clicking the edit button.
 * @returns A void or a promise that resolves to void.
 */
export type ModelEditEventHandler                      <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { model: TModel              , event: TCrudEvent                                           }) => void|Promise<void>

/**
 * Handler for quitting edit mode and returning to view mode.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes that was canceled to save. It's a draft because it is coming from edit mode and may be modified by the user.
 * @param param.event - The event triggered by clicking the close button.
 * @returns A void or a promise that resolves to void.
 */
export type ModelCancelEditEventHandler                <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel              , event: TCrudEvent                                           }) => void|Promise<void>



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
 * Handler for confirming unsaved changes of a model.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes to be saved or canceled to save, or null if no draft exists. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the close button.
 * @returns A confirmation message.
 */
export type ModelConfirmUnsavedEventHandler            <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel|null         , event: TCrudEvent                                           }) => ModelConfirmMessage

/**
 * Handler for confirming deletion of a model.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes to be deleted. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the delete button.
 * @param param.options - Options for deleting the model.
 * @returns A confirmation message.
 */
export type ModelConfirmDeleteEventHandler             <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel              , event: TCrudEvent, options?: ModelDeletingOptions|undefined }) => ModelConfirmMessage



// Handlers for creating, updating, or deleting models:
/**
 * Options for creating or updating a model.
 */
export interface ModelUpsertingOptions {
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
 * @param param - The parameters for the handler.
 * @param param.id - The ID of the model to be created or updated.
 * @param param.event - The event triggered by clicking the save or update button.
 * @param param.options - Options for creating or updating the model.
 * @returns A partial model or a promise that resolves to a partial model. It returns a partial model because it represents a partial update.
 */
export type ModelUpsertingEventHandler                 <   out TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { id   : string|null         , event: TCrudEvent, options : ModelUpsertingOptions          }) => PartialModel<TModel>|Promise<PartialModel<TModel>>

/**
 * Handler for creating or updating a draft model.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model to be created or updated. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the save or update button.
 * @param param.options - Options for creating or updating the model.
 * @returns A partial model or a promise that resolves to a partial model. It returns a partial model because it represents a partial update.
 */
export type ModelCreatingOrUpdatingOfDraftEventHandler <in out TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel              , event: TCrudEvent, options : ModelUpsertingOptions          }) => PartialModel<TModel>|Promise<PartialModel<TModel>>

/**
 * Handler for deleting a model.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes to be deleted. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the delete button.
 * @param param.options - Options for deleting the model.
 * @returns A void or a promise that resolves to void.
 */
export type ModelDeletingEventHandler                  <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel              , event: TCrudEvent, options?: ModelDeletingOptions|undefined }) => void|Promise<void>



// Handlers for committing or discarding changes of related external models, such as linked image URLs on external storage:
/**
 * Handler for committing changes of related external models, such as linked image URLs on external storage.
 * @param param - The parameters for the handler.
 * @param param.model - The partial model that was created or updated. It's a partial model because it represents a partial update of a related model.
 * @param param.event - The event triggered by clicking the save or update button.
 * @returns A void or a promise that resolves to void.
 */
export type SideModelCommittingEventHandler            <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { model: PartialModel<TModel>, event: TCrudEvent                                           }) => void|Promise<void>

/**
 * Handler for discarding changes of related external models, such as linked image URLs on external storage.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes that was deleted or canceled to save, or null if no draft exists. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the delete button.
 * @returns A void or a promise that resolves to void.
 */
export type SideModelDiscardingEventHandler            <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel|null         , event: TCrudEvent                                           }) => void|Promise<void>



// Handlers for actions after creating, updating, or deleting models:
/**
 * Handler for actions after a model has been created or updated.
 * @param param - The parameters for the handler.
 * @param param.model - The partial model that was created or updated. It's a partial model because it represents a partial update.
 * @param param.event - The event triggered by clicking the save or update button.
 * @returns A void or a promise that resolves to void.
 */
export type ModelCreateOrUpdateEventHandler            <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { model: PartialModel<TModel>, event: TCrudEvent                                           }) => void|Promise<void>

/**
 * Handler for actions after a model has been deleted.
 * @param param - The parameters for the handler.
 * @param param.draft - The draft model with unsaved changes that was deleted. It's a draft because it may be modified by the user.
 * @param param.event - The event triggered by clicking the delete button.
 * @param param.options - Options for deleting the model.
 * @returns A void or a promise that resolves to void.
 */
export type ModelDeleteEventHandler                    <in     TModel extends Model     , in TCrudEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> = (param: { draft: TModel              , event: TCrudEvent, options?: ModelDeletingOptions|undefined }) => void|Promise<void>
