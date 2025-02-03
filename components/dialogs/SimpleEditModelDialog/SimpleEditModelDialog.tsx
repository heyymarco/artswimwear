'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// styles:
import {
    // style sheets:
    useSimpleEditModelDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type ButtonIconProps,
    ButtonIcon,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // dialog-components:
    ModalCardProps,
    ModalCard,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
    type EditorProps,
}                           from '@heymarco/editor'

// models:
import {
    type Model,
    type MutationArgs,
    
    type ModelConfirmMessage,
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    
    type ModelCreatingOrUpdatingOptions,
    type ModelDeletingOptions,
    type ModelCreatingOrUpdatingEventHandler,
    type ModelCreatingOrUpdatingOfDraftEventHandler,
    type ModelDeletingEventHandler,
    
    type SideModelCreatingOrUpdatingEventHandler,
    type SideModelDeletingEventHandler,
    
    type ModelCreatedOrUpdatedEventHandler,
    type ModelDeletedEventHandler,
}                           from '@/models'

// internals:
import {
    type KeyOfModel,
    type ValueOfModel,
    type SimpleEditModelDialogResult,
    type SimpleEditModelDialogExpandedChangeEvent,
    
    type InitialValueHandler,
    type TransformValueHandler,
    
    type UseUpdateModel,
    type UpdateModelApi,
    
    type UpdateSideHandler,
    type DeleteSideHandler,
}                           from './types'
import {
    getInvalidFields,
}                           from '@/libs/css-selectors'



// react components:
export interface SimpleEditModelDialogProps<TModel extends Model, TEdit extends keyof any = KeyOfModel<TModel>>
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement, SimpleEditModelDialogExpandedChangeEvent<TModel>>,
            // children:
            |'children'        // already taken over
        >
{
    // data:
    model                  : TModel
    edit                   : TEdit
    initialValue          ?: InitialValueHandler<TModel, TEdit>
    transformValue        ?: TransformValueHandler<TModel, TEdit>
    useUpdateModel        ?: UseUpdateModel<TModel> | UpdateModelApi<TModel>
    
    
    
    // stores:
    isCommiting           ?: boolean
    isReverting           ?: boolean
    
    
    
    // components:
    editorComponent        : React.ReactElement<EditorProps<Element, ValueOfModel<TModel>>>
    
    
    
    // components:
    buttonSaveComponent   ?: React.ReactElement<ButtonIconProps>
    buttonCancelComponent ?: React.ReactElement<ButtonIconProps>
    modalCardComponent    ?: React.ReactElement<ModalCardProps<HTMLElement, SimpleEditModelDialogExpandedChangeEvent<TModel>>>
    
    
    
    // handlers:
    onUpdated             ?: ModelCreatedOrUpdatedEventHandler<TModel>
    
    onSideUpdate          ?: UpdateSideHandler
    onSideDelete          ?: DeleteSideHandler
    
    onConfirmUnsaved      ?: ModelConfirmUnsavedEventHandler<TModel>
}
export type ImplementedSimpleEditModelDialogProps<TModel extends Model, TEdit extends keyof any = KeyOfModel<TModel>> = Omit<SimpleEditModelDialogProps<TModel, TEdit>,
    // data:
    |'initialValue'
    |'transformValue'
    |'useUpdateModel'
    
    // stores:
    |'isCommiting'      // already taken over
    |'isReverting'      // already taken over
    
    // handlers:
    |'onUpdated'        // already taken over
    |'onSideUpdate'     // already taken over
    |'onSideDelete'     // already taken over
>
const SimpleEditModelDialog = <TModel extends Model>(props: SimpleEditModelDialogProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = useSimpleEditModelDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        edit,
        initialValue   = (edit, model) => model[edit] satisfies ValueOfModel<TModel>,
        transformValue = (value, edit, model) => ({
            id     : model.id,
            
            [edit] : (value === '') ? (null as typeof value) : value, // auto convert empty string to null
        } as MutationArgs<TModel>),
        useUpdateModel : _useUpdateModel,
        
        
        
        // stores:
        isCommiting : isCommitingExternal = false,
        isReverting = false,
        
        
        
        // components:
        editorComponent,
        
        
        
        // components:
        buttonSaveComponent   = (<ButtonIcon /> as React.ReactElement<ButtonIconProps>),
        buttonCancelComponent = (<ButtonIcon /> as React.ReactElement<ButtonIconProps>),
        modalCardComponent    = (<ModalCard  /> as React.ReactElement<ModalCardProps<HTMLElement, SimpleEditModelDialogExpandedChangeEvent<TModel>>>),
        
        
        
        // handlers:
        onUpdated,
        
        onSideUpdate,
        onSideDelete,
        
        onConfirmUnsaved,
        
        onExpandedChange,
        
        
        
        // other props:
        ...restSimpleEditModelDialogProps
    } = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue     , setEditorValue     ] = useState<ValueOfModel<TModel>>(() => initialValue(edit, model));
    
    
    
    // refs:
    const editorRef          = useRef<HTMLInputElement|null>(null);
    const autoFocusEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stores:
    const [updateModel, {isLoading: isCommitingModel}] = (typeof(_useUpdateModel) === 'function') ? _useUpdateModel() : (_useUpdateModel ?? [undefined, {isLoading: false}]);
    const isCommiting = isCommitingExternal || isCommitingModel;
    const isLoading   = isCommiting || isReverting;
    
    
    
    // handlers:
    const handleSave           = useEvent(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const editorElm = editorRef.current;
        const fieldErrors = (
            // for <Form>:
            (() => {
                const matches = getInvalidFields(editorElm);
                if (!matches?.length) return null;
                return matches;
            })()
            ??
            // for <input>:
            getInvalidFields([editorElm])
            ??
            // for <Input>:
            getInvalidFields([editorElm?.parentElement])
        );
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            // First: run the update handler (if provided):
            const updatingModelPromise : Promise<TModel>|undefined = (
                updateModel
                ? updateModel(
                    transformValue(editorValue, edit, model)
                ).unwrap()
                : undefined // The update handler is not provided
            );
            
            const updatingModelAndOtherTasksPromise : Promise<void>|undefined = (
                updatingModelPromise
                // After the update handler is done, run the updated handler until it's done:
                ? updatingModelPromise.then(async (updatedModel): Promise<void> => {
                    // Wait for the updated handler to be done:
                    await onUpdated?.({
                        model   : updatedModel,
                        event   : event,
                    });
                })
                // The update handler is not provided, no need to run the updated handler:
                : undefined
            );
            
            await handleFinalizing((updatingModelPromise ? (await updatingModelPromise)[edit] : undefined), /*commitSides = */true, (updatingModelAndOtherTasksPromise ? [updatingModelAndOtherTasksPromise] : undefined)); // result: created|mutated
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    const handleSideSave       = useEvent(async (commitSides : boolean) => {
        if (commitSides) {
            await onSideUpdate?.();
        }
        else {
            await onSideDelete?.();
        } // if
    });
    
    const handleCloseDialog    = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
        if (isModified) {
            // conditions:
            let answer : 'save'|'dontSave'|'continue'|undefined = 'save';
            {
                const {
                    title   = <h1>Unsaved Data</h1>,
                    message = <p>
                        Do you want to save the changes?
                    </p>,
                } = onConfirmUnsaved?.({ draft: model, event: event }) ?? {};
                answer = await showMessage<'save'|'dontSave'|'continue'>({
                    theme         : 'warning',
                    title         : title,
                    message       : message,
                    options       : {
                        save      : <ButtonIcon icon='save'   theme='success' autoFocus={true}>Save</ButtonIcon>,
                        dontSave  : <ButtonIcon icon='cancel' theme='danger' >Don&apos;t Save</ButtonIcon>,
                        continue  : <ButtonIcon icon='edit'   theme='secondary'>Continue Editing</ButtonIcon>,
                    },
                    ...{
                        backdropStyle : 'static',
                    },
                });
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            } // if
            
            
            
            // actions:
            switch (answer) {
                case 'save':
                    // then do a save (it will automatically close the editor after successfully saving):
                    handleSave(event);
                    break;
                case 'dontSave':
                    // then close the editor (without saving):
                    await handleFinalizing(undefined, /*commitSides = */false); // result: discard changes
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleFinalizing(undefined, /*commitSides = */false); // result: no changes
        } // if
    });
    const handleFinalizing     = useEvent(async (result: SimpleEditModelDialogResult<TModel>|Promise<SimpleEditModelDialogResult<TModel>>, commitSides : boolean, processingTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSideSave(commitSides),
            ...processingTasks,
        ]);
        
        
        
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : await result,
        });
    });
    
    const handleExpandedChange = useEvent<EventHandler<SimpleEditModelDialogExpandedChangeEvent<TModel>>>((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    
    const handleChangeInternal = useEvent<EditorChangeEventHandler<ValueOfModel<TModel>>>((value) => {
        setEditorValue(value);
        setIsModified(true);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `editorComponent`:
        editorComponent.props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // default props:
    const {
        // appearances:
        icon      : buttonSaveComponentIcon        = (
            isCommiting
            ? 'busy'
            : 'save'
        ),
        
        
        
        // variants:
        theme     : buttonSaveComponentTheme       = 'success',
        size      : buttonSaveComponentSize        = 'sm',
        
        
        
        // classes:
        className : buttonSaveComponentClassName   = '',
        
        
        
        // children:
        children  : buttonSaveComponentChildren    = <>
            Save
        </>,
        
        
        
        // other props:
        ...restButtonSaveComponentProps
    } = buttonSaveComponent.props;
    
    const {
        // appearances:
        icon      : buttonCancelComponentIcon      = (
            isReverting
            ? 'busy'
            : 'cancel'
        ),
        
        
        
        // variants:
        theme     : buttonCancelComponentTheme     = 'danger',
        size      : buttonCancelComponentSize      = 'sm',
        
        
        
        // classes:
        className : buttonCancelComponentClassName = '',
        
        
        
        // children:
        children  : buttonCancelComponentChildren  = <>
            {
                isReverting
                ? 'Reverting'
                : 'Cancel'
            }
        </>,
        
        
        
        // other props:
        ...restButtonCancelComponentProps
    } = buttonCancelComponent.props;
    
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
        
        
        
        // auto focusable:
        autoFocusOn    = autoFocusEditorRef,
        
        
        
        // other props:
        ...restModalCardProps
    } = restSimpleEditModelDialogProps;
    
    const {
        // variants:
        theme          : modalCardComponentTheme          = theme,
        backdropStyle  : modalCardComponentBackdropStyle  = backdropStyle,
        modalCardStyle : modalCardComponentModalCardStyle = modalCardStyle,
        
        
        
        // auto focusable:
        autoFocusOn    : modalCardComponentAutoFocusOn    = autoFocusOn,
        
        
        
        // children:
        children       : modalCardComponentChildren = <>
            <CardBody className={styleSheet.main}>
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                    inheritValidation={false}
                >
                    {React.cloneElement<EditorProps<Element, ValueOfModel<TModel>>>(editorComponent,
                        // props:
                        {
                            elmRef    : autoFocusEditorRef, // focus on the first_important editor, if the editor is a <form>, not the primary input
                            outerRef  : editorRef, // use outerRef instead of elmRef, to validate all input(s), if the editor is a <form>, not the primary input
                            
                            
                            
                            size      : 'sm',
                            
                            
                            
                            className : 'editor',
                            
                            
                            
                            value     : editorComponent.props.value ?? editorValue,
                            onChange  : handleChange,
                        },
                    )}
                </ValidationProvider>
                
                {/* <ButtonSave> */}
                {React.cloneElement<ButtonIconProps>(buttonSaveComponent,
                    // props:
                    {
                        // other props:
                        ...restButtonSaveComponentProps,
                        
                        
                        
                        // appearances:
                        icon      : buttonSaveComponentIcon,
                        
                        
                        
                        // variants:
                        theme     : buttonSaveComponentTheme,
                        size      : buttonSaveComponentSize,
                        
                        
                        
                        // classes:
                        className : `btnSave ${buttonSaveComponentClassName}`,
                        
                        
                        
                        // handlers:
                        onClick   : handleSave,
                    },
                    
                    
                    
                    // children:
                    buttonSaveComponentChildren,
                )}
                
                {/* <ButtonCancel> */}
                {React.cloneElement<ButtonIconProps>(buttonCancelComponent,
                    // props:
                    {
                        // other props:
                        ...restButtonCancelComponentProps,
                        
                        
                        
                        // appearances:
                        icon      : buttonCancelComponentIcon,
                        
                        
                        
                        // variants:
                        theme     : buttonCancelComponentTheme,
                        size      : buttonCancelComponentSize,
                        
                        
                        
                        // classes:
                        className : `btnCancel ${buttonCancelComponentClassName}`,
                        
                        
                        
                        // handlers:
                        onClick   : handleCloseDialog,
                    },
                    
                    
                    
                    // children:
                    buttonCancelComponentChildren,
                )}
            </CardBody>
        </>,
        
        
        
        ...restModalCardComponentProps
    } = modalCardComponent.props;
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            {React.cloneElement<ModalCardProps<HTMLElement, SimpleEditModelDialogExpandedChangeEvent<TModel>>>(modalCardComponent,
                // props:
                {
                    // other props:
                    ...restModalCardProps,
                    ...restModalCardComponentProps, // overwrites restModalCardProps (if any conflics)
                    
                    
                    
                    // variants:
                    theme            : modalCardComponentTheme,
                    backdropStyle    : modalCardComponentBackdropStyle,
                    modalCardStyle   : modalCardComponentModalCardStyle,
                    
                    
                    
                    // auto focusable:
                    autoFocusOn      : modalCardComponentAutoFocusOn,
                    
                    
                    
                    // handlers:
                    onExpandedChange : handleExpandedChange,
                },
                
                
                
                // children:
                modalCardComponentChildren,
            )}
        </AccessibilityProvider>
    );
};
export {
    SimpleEditModelDialog,            // named export for readibility
    SimpleEditModelDialog as default, // default export to support React.lazy
}
