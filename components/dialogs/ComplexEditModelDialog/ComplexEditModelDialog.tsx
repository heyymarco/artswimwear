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
    useComplexEditModelDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    type ButtonIconProps,
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    List,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // dialog-components:
    ModalCardProps,
    ModalCard,
    
    
    
    // composite-components:
    type TabPanelProps,
    TabPanel,
    TabProps,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageErrorProps,
    MessageError,
}                           from '@/components/MessageError'

// models:
import {
    type Model,
}                           from '@/models'

// internals:
import {
    type ComplexEditModelDialogResult,
    type ComplexEditModelDialogExpandedChangeEvent,
    
    type UpdateHandler,
    type AfterUpdateHandler,
    
    type DeleteHandler,
    type AfterDeleteHandler,
    
    type UpdateSideHandler,
    type DeleteSideHandler,
    
    type ConfirmDeleteHandler,
    type ConfirmUnsavedHandler,
}                           from './types'
import {
    getInvalidFields,
}                           from '@/libs/css-selectors'



// react components:
export interface ComplexEditModelDialogProps<TModel extends Model>
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement, ComplexEditModelDialogExpandedChangeEvent<TModel>>,
            // children:
            |'children'        // already taken over
        >,
        
        // components:
        Pick<TabProps,
            // states:
            |'defaultExpandedTabIndex'
        >
{
    // data:
    modelName              : string
    modelEntryName        ?: string|null
    model                  : TModel|null
    
    
    
    // privileges:
    privilegeAdd          ?: boolean
    privilegeUpdate       ?: Record<string, boolean>
    privilegeDelete       ?: boolean
    
    
    
    // stores:
    isModelLoading        ?: boolean
    isModelError          ?: boolean
    onModelRetry          ?: MessageErrorProps['onRetry']
    
    isModified            ?: boolean
    isCommiting           ?: boolean
    isReverting           ?: boolean
    isDeleting            ?: boolean
    
    
    
    // tabs:
    tabDelete             ?: React.ReactNode
    contentDelete         ?: React.ReactNode | ((props: { handleDelete: (arg?: unknown|undefined) => Promise<false|undefined> }) => React.ReactNode),
    
    
    
    // components:
    buttonSaveComponent   ?: React.ReactElement<ButtonIconProps>
    buttonCancelComponent ?: React.ReactElement<ButtonIconProps>
    modalCardComponent    ?: React.ReactElement<ModalCardProps<HTMLElement, ComplexEditModelDialogExpandedChangeEvent<TModel>>>
    
    
    
    // handlers:
    onUpdate              ?: UpdateHandler<TModel>
    onAfterUpdate         ?: AfterUpdateHandler
    
    onDelete              ?: DeleteHandler<TModel>
    onAfterDelete         ?: AfterDeleteHandler
    
    onSideUpdate          ?: UpdateSideHandler
    onSideDelete          ?: DeleteSideHandler
    
    onConfirmDelete       ?: ConfirmDeleteHandler<TModel>
    onConfirmUnsaved      ?: ConfirmUnsavedHandler<TModel>
    
    
    
    // children:
    children               : React.ReactNode | ((args: { whenAdd: boolean, whenUpdate: Record<string, boolean> }) => React.ReactNode)
}
export type ImplementedComplexEditModelDialogProps<TModel extends Model> = Omit<ComplexEditModelDialogProps<TModel>,
    // data:
    |'modelName'        // already taken over
    |'modelEntryName'   // already taken over
    
    // privileges:
    |'privilegeAdd'     // already taken over
    |'privilegeUpdate'  // already taken over
    |'privilegeDelete'  // already taken over
    
    // stores:
    |'isModified'       // already taken over
    |'isCommiting'      // already taken over
    |'isReverting'      // already taken over
    |'isDeleting'       // already taken over
    
    // tabs:
    |'tabDelete'        // already taken over
    
    // handlers:
    |'onUpdate'         // already taken over
    |'onAfterUpdate'    // already taken over
    |'onDelete'         // already taken over
    |'onAfterDelete'    // already taken over
    |'onSideUpdate'     // already taken over
    |'onSideDelete'     // already taken over
    |'onConfirmDelete'  // already taken over
    |'onConfirmUnsaved' // already taken over
    
    // children:
    |'children'         // already taken over
>
const ComplexEditModelDialog = <TModel extends Model>(props: ComplexEditModelDialogProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = useComplexEditModelDialogStyleSheet();
    
    
    
    // props:
    const {
        // data:
        modelName,
        modelEntryName,
        model,
        
        
        
        // privileges:
        privilegeAdd    = false,
        privilegeUpdate = {},
        privilegeDelete = false,
        
        
        
        // stores:
        isModelLoading = false,
        isModelError   = false,
        onModelRetry,
        
        isModified     = false,
        isCommiting    = false,
        isReverting    = false,
        isDeleting     = false,
        
        
        
        // tabs:
        tabDelete,
        contentDelete  : contentDeleteRaw,
        
        
        
        // states:
        defaultExpandedTabIndex,
        
        
        
        // components:
        buttonSaveComponent   = (<ButtonIcon /> as React.ReactElement<ButtonIconProps>),
        buttonCancelComponent = (<ButtonIcon /> as React.ReactElement<ButtonIconProps>),
        modalCardComponent    = (<ModalCard  /> as React.ReactElement<ModalCardProps<HTMLElement, ComplexEditModelDialogExpandedChangeEvent<TModel>>>),
        
        
        
        // handlers:
        onUpdate,
        onAfterUpdate,
        
        onDelete,
        onAfterDelete,
        
        onSideUpdate,
        onSideDelete,
        
        onConfirmDelete,
        onConfirmUnsaved,
        
        onExpandedChange,
        
        
        
        // children:
        children : childrenFn,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = props;
    const isModelNoData = isModelLoading || isModelError;
    
    const whenAdd    : boolean                 =   !model && privilegeAdd;
    const whenUpdate : Record<string, boolean> =  !!model ?  privilegeUpdate : {};
    const whenDelete : boolean                 =  !!model && privilegeDelete;
    const whenWrite  : boolean                 = (
        whenAdd
        || !!Object.values(whenUpdate).filter((u) => !!u).length // at least having one update privilege
        /* || whenDelete */ // except for delete
    );
    const isLoading = isCommiting || isReverting || isDeleting;
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // refs:
    const editorRef = useRef<HTMLFormElement|null>(null);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleSave           = useEvent(async () => {
        if (!whenWrite) return;
        
        
        
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const editorElm = editorRef.current;
        const fieldErrors = getInvalidFields(editorElm);
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingModelRaw = onUpdate?.({
                id : model?.id || null,
                
                whenAdd,
                whenUpdate,
            });
            const updatingModelTask = (updatingModelRaw instanceof Promise) ? updatingModelRaw : Promise.resolve(updatingModelRaw);
            
            const updatingModelAndOthersTask = (
                updatingModelTask
                ? (
                    onAfterUpdate
                    ? updatingModelTask.then(onAfterUpdate)
                    : updatingModelTask
                )
                : Promise.resolve(onAfterUpdate)
            );
            
            await handleFinalizing(updatingModelTask, /*commitSides = */true, [updatingModelAndOthersTask]); // result: created|mutated
        }
        catch (fetchError: any) {
            if ((fetchError !== null) && (fetchError !== undefined)) showMessageFetchError(fetchError);
        } // try
    });
    const handleDelete         = useEvent(async (arg?: unknown|undefined) => {
        // conditions:
        if (!model) return; // no model to delete => ignore
        {
            const {
                title   = <h1>Delete Confirmation</h1>,
                message = <p>
                    Are you sure to delete {!modelEntryName ? 'this ' : ''}<strong>{
                        // the model name is entered:
                        modelEntryName
                        ||
                        // the model name is blank:
                        modelName
                    }</strong>
                </p>,
            } = onConfirmDelete?.({model}) ?? {};
            if (
                (await showMessage<'yes'|'no'>({
                    theme    : 'warning',
                    title    : title,
                    message  : message,
                    options  : {
                        yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                        no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                    },
                }))
                !==
                'yes'
            ) return false;
            if (!isMounted.current) return false; // the component was unloaded before awaiting returned => do nothing
        } // if
        
        
        
        // actions:
        try {
            const deletingModelTask = onDelete?.(model, arg);
            
            const deletingModelAndOthersTask = (
                deletingModelTask
                ? (
                    onAfterDelete
                    ? deletingModelTask.then(onAfterDelete)
                    : deletingModelTask
                )
                : Promise.resolve(onAfterDelete)
            );
            
            await handleFinalizing(false, /*commitSides = */false, [deletingModelAndOthersTask]); // result: deleted
        }
        catch (fetchError: any) {
            showMessageFetchError(fetchError);
        } // try
    });
    const handleSideSave       = useEvent(async (commitSides : boolean) => {
        if (!whenWrite) return;
        
        
        
        if (commitSides) {
            await onSideUpdate?.();
        }
        else {
            await onSideDelete?.();
        } // if
    });
    
    const handleCloseDialog    = useEvent(async () => {
        if (whenWrite && isModified) {
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
    const handleFinalizing     = useEvent(async (result: ComplexEditModelDialogResult<TModel>|Promise<ComplexEditModelDialogResult<TModel>>, commitSides : boolean, processingTasks : Promise<any>[] = []) => {
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
    
    const handleExpandedChange = useEvent<EventHandler<ComplexEditModelDialogExpandedChangeEvent<TModel>>>((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    
    
    
    // default props:
    const children = flattenChildren(
        (typeof(childrenFn) === 'function')
        ? childrenFn?.({
            whenAdd,
            whenUpdate,
        })
        : childrenFn
    );
    const isMultiTabs = whenDelete || ((children.length) > 1) || (() => {
        const child = children[0]
        if (!React.isValidElement<TabPanelProps>(child)) return false;
        return !!child.props.label; // has <TabPanel>'s label
    })();
    
    const {
        contentDelete = !whenDelete ? undefined : <>
            <ButtonIcon icon={isDeleting ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                Delete {!modelEntryName ? 'this ' : ''}<strong>{
                    // the model name is entered:
                    modelEntryName
                    ||
                    // the model name is blank:
                    modelName
                }</strong>
            </ButtonIcon>
        </>,
    } = { contentDelete: contentDeleteRaw };
    
    const {
        // appearances:
        icon      : buttonSaveComponentIcon        = (
            isCommiting
            ? 'busy'
            : 'save'
        ),
        
        
        
        // variants:
        theme     : buttonSaveComponentTheme       = 'success',
        
        
        
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
            isModelNoData
            ? 'cancel'
            : (
                whenWrite
                ? (
                    isReverting
                    ? 'busy'
                    : 'cancel'
                )
                : 'done'
            )
        ),
        
        
        
        // variants:
        theme     : buttonCancelComponentTheme     = (
            isModelNoData
            ? 'primary'
            : (
                whenWrite
                ? 'danger'
                : 'primary'
            )
        ),
        
        
        
        // classes:
        className : buttonCancelComponentClassName = '',
        
        
        
        // children:
        children  : buttonCancelComponentChildren  = <>
            {
                isModelNoData
                ? 'Close'
                : (
                    isReverting
                    ? 'Reverting'
                    : (
                        whenWrite
                        ? 'Cancel'
                        : 'Close'
                    )
                )
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
        
        
        
        // other props:
        ...restModalCardProps
    } = restComplexEditModelDialogProps;
    
    const {
        // variants:
        theme          : modalCardComponentTheme          = theme,
        backdropStyle  : modalCardComponentBackdropStyle  = backdropStyle,
        modalCardStyle : modalCardComponentModalCardStyle = modalCardStyle,
        
        
        
        // children:
        children       : modalCardComponentChildren = <>
            <CardHeader>
                <h1>{
                    // the model name is entered:
                    modelEntryName
                    ||
                    // the model name is blank:
                    (
                        !model
                        ? `Add New ${modelName}` // create new model, if no  model
                        : `Edit ${modelName}`    // edit model      , if has model
                    )
                }</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            
            {isModelNoData && <Content
                // variants:
                theme={isModelError ? 'danger' : undefined}
                
                
                
                // classes:
                className={`${styleSheet.cardBody} body noData`}
            >
                {!isModelError && <MessageLoading />}
                {isModelError  && <MessageError onRetry={onModelRetry} />}
            </Content>}
            
            {!isModelNoData && <ValidationProvider
                // validations:
                enableValidation={enableValidation}
                inheritValidation={false}
            >
                {!isMultiTabs && <CardBody
                    // refs:
                    elmRef={editorRef} // use elmRef, to validate all input(s) inside <CardBody>
                    
                    
                    
                    // classes:
                    className={styleSheet.cardBody}
                >
                    {children}
                </CardBody>}
                {isMultiTabs && <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={`${styleSheet.cardBody} tabs`}
                    
                    
                    
                    // states:
                    defaultExpandedTabIndex={defaultExpandedTabIndex}
                    
                    
                    
                    // components:
                    listComponent={
                        <List
                            // classes:
                            className={styleSheet.tabList}
                        />
                    }
                    bodyComponent={
                        <Content
                            // refs:
                            elmRef={editorRef} // use elmRef, to validate all input(s) inside <Tab>'s body
                            
                            
                            
                            // classes:
                            className={styleSheet.tabBody}
                        />
                    }
                >
                    {children}
                    {whenDelete && <TabPanel label={tabDelete} panelComponent={<Content theme='warning' className={styleSheet.tabDelete} />}>
                        {(typeof(contentDelete) === 'function') ? contentDelete({ handleDelete }) : contentDelete}
                    </TabPanel>}
                </Tab>}
            </ValidationProvider>}
            
            <CardFooter>
                {/* <ButtonSave> */}
                {whenWrite && !isModelNoData && React.cloneElement<ButtonIconProps>(buttonSaveComponent,
                    // props:
                    {
                        // other props:
                        ...restButtonSaveComponentProps,
                        
                        
                        
                        // appearances:
                        icon      : buttonSaveComponentIcon,
                        
                        
                        
                        // variants:
                        theme     : buttonSaveComponentTheme,
                        
                        
                        
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
                        
                        
                        
                        // classes:
                        className : `btnCancel ${buttonCancelComponentClassName}`,
                        
                        
                        
                        // handlers:
                        onClick   : handleCloseDialog,
                    },
                    
                    
                    
                    // children:
                    buttonCancelComponentChildren,
                )}
            </CardFooter>
        </>,
        
        
        
        ...restModalCardComponentProps
    } = modalCardComponent.props;
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            {React.cloneElement<ModalCardProps<HTMLElement, ComplexEditModelDialogExpandedChangeEvent<TModel>>>(modalCardComponent,
                // props:
                {
                    // other props:
                    ...restModalCardProps,
                    ...restModalCardComponentProps, // overwrites restModalCardProps (if any conflics)
                    
                    
                    
                    // variants:
                    theme            : modalCardComponentTheme,
                    backdropStyle    : modalCardComponentBackdropStyle,
                    modalCardStyle   : modalCardComponentModalCardStyle,
                    
                    
                    
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
    ComplexEditModelDialog,            // named export for readibility
    ComplexEditModelDialog as default, // default export to support React.lazy
}
