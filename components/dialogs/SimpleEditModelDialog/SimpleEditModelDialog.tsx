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
    ButtonIcon,
    
    
    
    // layout-components:
    CardBody,
    
    
    
    // dialog-components:
    ModalCardProps,
    ModalCard,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type EditorChangeEventHandler,
    type EditorProps,
}                           from '@/components/editors/Editor'

// internals:
import {
    type Model,
    type MutationArgs,
}                           from '@/libs/types'
import {
    type KeyOfModel,
    type ValueOfModel,
    type SimpleEditModelDialogResult,
    type SimpleEditModelDialogExpandedChangeEvent,
    
    type InitialValueHandler,
    type TransformValueHandler,
    type UpdateModelApi,
    
    type AfterUpdateHandler,
    
    type UpdateSideHandler,
    type DeleteSideHandler,
    
    type ConfirmUnsavedHandler,
}                           from './types'



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
    model             : TModel
    edit              : TEdit
    initialValue     ?: InitialValueHandler<TModel, TEdit>
    transformValue   ?: TransformValueHandler<TModel, TEdit>
    updateModelApi   ?: UpdateModelApi<TModel> | (() => UpdateModelApi<TModel>)
    
    
    
    // stores:
    isCommiting      ?: boolean
    isReverting      ?: boolean
    
    
    
    // components:
    editorComponent   : React.ReactComponentElement<any, EditorProps<Element, ValueOfModel<TModel>>>
    
    
    
    // handlers:
    onAfterUpdate    ?: AfterUpdateHandler
    
    onSideUpdate     ?: UpdateSideHandler
    onSideDelete     ?: DeleteSideHandler
    
    onConfirmUnsaved ?: ConfirmUnsavedHandler<TModel>
}
export type ImplementedSimpleEditModelDialogProps<TModel extends Model, TEdit extends keyof any = KeyOfModel<TModel>> = Omit<SimpleEditModelDialogProps<TModel, TEdit>,
    // data:
    |'initialValue'
    |'transformValue'
    |'updateModelApi'
    
    // stores:
    |'isCommiting'      // already taken over
    |'isReverting'      // already taken over
    
    // handlers:
    |'onAfterUpdate'    // already taken over
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
        updateModelApi,
        
        
        
        // stores:
        isCommiting : isCommitingExternal = false,
        isReverting = false,
        
        
        
        // components:
        editorComponent,
        
        
        
        // handlers:
        onAfterUpdate,
        
        onSideUpdate,
        onSideDelete,
        
        onConfirmUnsaved,
        
        onExpandedChange,
    ...restModalCardProps} = props;
    
    
    
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
    const [updateModel, {isLoading: isCommitingModel}] = (typeof(updateModelApi) === 'function') ? updateModelApi() : (updateModelApi ?? [undefined, {isLoading: false}]);
    const isCommiting = isCommitingExternal || isCommitingModel;
    const isLoading   = isCommiting || isReverting;
    
    
    
    // handlers:
    const handleSave           = useEvent(async () => {
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
                const matches = editorElm?.querySelectorAll?.(':is(.invalidating, .invalidated):not([aria-invalid="false"])');
                if (!matches?.length) return null;
                return matches;
            })()
            ??
            // for <input>:
            (editorElm?.matches?.(':is(.invalidating, .invalidated):not([aria-invalid="false"])') ? [editorElm] : null)
            ??
            // for <Input>:
            (editorElm?.parentElement?.matches?.(':is(.invalidating, .invalidated):not([aria-invalid="false"])') ? [editorElm.parentElement] : null)
        );
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingModelTask : Promise<TModel> = (
                updateModel
                ? updateModel(
                    transformValue(editorValue, edit, model)
                ).unwrap()
                : Promise.resolve<TModel>(model)
            );
            
            const updatingModelAndOthersTask = (
                updatingModelTask
                ? (
                    onAfterUpdate
                    ? updatingModelTask.then(onAfterUpdate)
                    : updatingModelTask
                )
                : Promise.resolve(onAfterUpdate)
            );
            
            await handleFinalizing((await updatingModelTask)[edit], /*commitSides = */true, [updatingModelAndOthersTask]); // result: created|mutated
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
    
    const handleCloseDialog    = useEvent(async () => {
        if (isModified) {
            // conditions:
            let answer : 'save'|'dontSave'|'continue'|undefined = 'save';
            {
                const {
                    title   = <h1>Unsaved Data</h1>,
                    message = <p>
                        Do you want to save the changes?
                    </p>,
                } = onConfirmUnsaved?.({model}) ?? {};
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
                    handleSave();
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
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            <ModalCard
                // other props:
                {...restModalCardProps}
                
                
                
                // variants:
                theme          = {props.theme          ?? 'primary'   }
                backdropStyle  = {props.backdropStyle  ?? 'static'    }
                modalCardStyle = {props.modalCardStyle ?? 'scrollable'}
                
                
                
                // auto focusable:
                autoFocusOn={props.autoFocusOn ?? autoFocusEditorRef}
                
                
                
                // handlers:
                onExpandedChange = {handleExpandedChange}
            >
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
                    <ButtonIcon className='btnSave' icon={isCommiting ? 'busy' : 'save'} theme='success' size='sm' onClick={handleSave}>Save</ButtonIcon>
                    <ButtonIcon className='btnCancel' icon={isReverting ? 'busy' : 'cancel'} theme='danger' size='sm' onClick={handleCloseDialog}>{isReverting ? 'Reverting' : 'Cancel'}</ButtonIcon>
                </CardBody>
            </ModalCard>
        </AccessibilityProvider>
    );
};
export {
    SimpleEditModelDialog,
    SimpleEditModelDialog as default,
}
