'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    usePaginationExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
    CollapsibleEventProps,
    ControllableCollapsibleProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    Generic,
    Basic,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    ListItemComponentProps,
    
    List,
    
    
    
    // menu-components:
    DropdownListButtonProps,
    
    
    
    // composite-components:
    Group,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals components:
import {
    PaginationNav,
}                           from './PaginationNav'

// internals:
import type {
    Pagination,
    Model,
    PartialModel,
}                           from '@/libs/types'
import {
    ModalLoadingError,
}                           from '@/components/ModalLoadingError'
import type {
    // types:
    ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    usePaginationExplorerState,
}                           from './states/paginationExplorerState'



// react components:

/* <ModelCreate> */
export type CloseEvent = string|false|null
export interface ModelCreateProps
    extends
        CollapsibleProps<ExpandedChangeEvent>,
        CollapsibleEventProps,
        ControllableCollapsibleProps<ExpandedChangeEvent>
{
}

export type CreateHandler<TModel extends Model> = (createdModel: PartialModel<TModel>) => void|Promise<void>

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps<TModel extends Model>
    extends
        // bases:
        ListItemProps,
        
        // components:
        ListItemComponentProps<Element>
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent  : React.ReactComponentElement<any, ModelCreateProps> | (() => TModel|Promise<TModel>) | false
    moreButtonComponent  ?: React.ReactComponentElement<any, DropdownListButtonProps>
    
    
    
    // handlers:
    onCreated            ?: CreateHandler<TModel>
}
export const ModelCreateOuter = <TModel extends Model>(props: ModelCreateOuterProps<TModel>) => {
    // styles:
    const styleSheets = usePaginationExplorerStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
        moreButtonComponent,
        listItemComponent = (<ListItem<Element> /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // handlers:
        onCreated,
    ...restListItemProps} = props;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleShowDialog = useEvent(async (): Promise<void> => {
        // conditions:
        if (modelCreateComponent === false) return;
        
        
        
        // actions:
        const createdModel = (
            (typeof(modelCreateComponent) === 'function')
            ? await modelCreateComponent()
            : await showDialog<ComplexEditModelDialogResult<TModel>>(
                modelCreateComponent
            )
        );
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        if (createdModel) { // if closed of created Model (ignores of canceled or deleted Model)
            onCreated?.(createdModel);
        } // if
    });
    
    
    
    // jsx:
    const addNewBUtton = (
        <ButtonIcon
            // appearances:
            icon='create'
            
            
            
            // classes:
            className='fluid'
            
            
            
            // states:
            enabled={
                (modelCreateComponent === false)
                ? false
                : true
            }
            
            
            
            // handlers:
            onClick={handleShowDialog}
        >
            {createItemText ?? 'Add New Item'}
        </ButtonIcon>
    );
    return React.cloneElement<ListItemProps<Element>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            
            
            
            // classes:
            className : `${styleSheets.createModel} ${props.className}`,
        },
        
        
        
        // children:
        (
            !moreButtonComponent
            ?
            addNewBUtton
            :
            <Group>
                {addNewBUtton}
                {moreButtonComponent}
            </Group>
        ),
    );
};

/* <ModelPreview> */
export interface ModelPreviewProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ListItemProps<TElement>,
            'draggable' // reserved for <OrderableList>
        >
{
    // data:
    model : Pagination<TModel>['entities'][number]
}

/* <ModelEmpty> */
export interface ModalEmptyProps {
    // accessibilities:
    textEmpty ?: React.ReactNode
}
export const ModelEmpty = (props: ModalEmptyProps) => {
    // props:
    const {
        // accessibilities:
        textEmpty = <>The data is empty.</>,
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationExplorerStyleSheet();
    
    
    
    // refs:
    const statusEmptyListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <ListItem
            // refs:
            elmRef={statusEmptyListRef}
            
            
            
            // classes:
            className={styleSheets.emptyModel}
        >
            <p>
                {textEmpty}
            </p>
        </ListItem>
    );
};

/* <PaginationExplorer> */
export interface PaginationExplorerProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            |'children' // no nested children
        >,
        // data:
        Partial<Pick<ModelCreateOuterProps<TModel>,
            // accessibilities:
            |'createItemText'
            
            
            
            // components:
            |'modelCreateComponent'
        >>,
        
        // accessibilities:
        ModalEmptyProps
{
    // appearances:
    showPaginationTop     ?: boolean
    showPaginationBottom  ?: boolean
    autoHidePagination    ?: boolean
    
    
    
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, ModelPreviewProps<TModel, Element>>
    
    
    
    // children:
    menusBefore           ?: React.ReactNode
    menusAfter            ?: React.ReactNode
}
const PaginationExplorer         = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationExplorerProps<TModel, TElement>): JSX.Element|null => {
    // props:
    const {
        // appearances:
        showPaginationTop    = true,
        showPaginationBottom = true,
        autoHidePagination   = false,
        
        
        
        // accessibilities:
        createItemText,
        textEmpty,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
        
        
        
        // children:
        menusBefore,
        menusAfter,
        
        
        
        // other props:
        ...restPaginationExplorerProps
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationExplorerStyleSheet();
    
    
    
    // states:
    const {
        // states:
        perPage,
        
        
        
        // data:
        data,
        isFetching,
        isError,
        refetch,
    } = usePaginationExplorerState<TModel>();
    const isDataEmpty = !!data && !data.total;
    const showPagination = (
        !autoHidePagination
        ? true
        : (
            (data?.total ?? 0) > perPage
        )
    );
    
    
    
    // refs:
    const dataListRef = useRef<HTMLElement|null>(null);
    
    
    
    // default props:
    const {
        // classes
        mainClass = styleSheets.main,
        
        
        
        // other props:
        ...restGenericProps
    } = restPaginationExplorerProps;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <div className={`toolbar ${styleSheets.toolbar}`}>
                <div className='toolbarBefore'>
                    {menusBefore}
                </div>
                <div className='toolbarMain'>
                </div>
                <div className='toolbarAfter'>
                    {menusAfter}
                </div>
            </div>
            
            {showPagination && showPaginationTop && <PaginationNav<TModel>
                // classes:
                className={styleSheets.paginTop}
            />}
            
            <Basic className={`${styleSheets.listModel}${isDataEmpty ? ' empty' : ''}`} mild={true} elmRef={dataListRef}>
                <ModalLoadingError
                    // data:
                    isFetching={isFetching}
                    isError={isError}
                    refetch={refetch}
                    
                    
                    
                    // global stackable:
                    viewport={dataListRef}
                />
                
                <List listStyle='flush' className={styleSheets.listModelInner}>
                    {/* <ModelCreate> */}
                    {!!modelCreateComponent  && <ModelCreateOuter<TModel> className='solid' createItemText={createItemText} modelCreateComponent={modelCreateComponent} />}
                    
                    {!!data && !data.total && <ModelEmpty textEmpty={textEmpty} />}
                    
                    {!!data?.total && Object.values(data?.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map((model) =>
                        /* <ModelPreview> */
                        React.cloneElement<ModelPreviewProps<TModel, Element>>(modelPreviewComponent,
                            // props:
                            {
                                // identifiers:
                                key   : modelPreviewComponent.key         ?? model.id,
                                
                                
                                
                                // data:
                                model : modelPreviewComponent.props.model ?? model,
                            },
                        )
                    )}
                </List>
            </Basic>
            
            {showPagination && showPaginationBottom && <PaginationNav<TModel>
                // classes:
                className={styleSheets.paginBtm}
            />}
        </Generic>
    );
};
export {
    PaginationExplorer,            // named export for readibility
    PaginationExplorer as default, // default export to support React.lazy
}
