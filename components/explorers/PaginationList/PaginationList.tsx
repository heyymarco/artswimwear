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
    usePaginationListStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    type GenericProps,
    Generic,
    type BasicProps,
    Basic,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    type ListItemProps,
    ListItem,
    type ListItemComponentProps,
    
    type ListProps,
    List,
    
    type ListComponentProps,
    
    
    
    // menu-components:
    type  DropdownListButtonProps,
    
    
    
    // composite-components:
    Group,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelCreateProps,
    
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationNav,
}                           from '@/components/explorers/PaginationNav'

// models:
import {
    type Model,
    type Pagination,
    
    type ModelUpsertEventHandler,
}                           from '@/models'

// internals:
import {
    ModalLoadingError,
}                           from '@/components/ModalLoadingError'
import {
    // types:
    type ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'



// react components:

export interface ModelAddProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent ?: React.ReactComponentElement<any, ModelCreateProps> | (() => TModel|Promise<TModel>) | false
    
    
    
    // handlers:
    onModelCreate        ?: ModelUpsertEventHandler<TModel>
}

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps<TModel extends Model>
    extends
        // bases:
        ModelAddProps<TModel, HTMLElement>,
        
        // components:
        ListItemComponentProps<Element>
{
    /**
     * An additional button such as `<DropdownMoreButton>`.
     */
    moreButtonComponent  ?: React.ReactComponentElement<any, DropdownListButtonProps>
}
export const ModelCreateOuter = <TModel extends Model>(props: ModelCreateOuterProps<TModel>) => {
    // styles:
    const styleSheets = usePaginationListStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
        moreButtonComponent,
        listItemComponent = (<ListItem<Element> /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // handlers:
        onModelCreate,
    ...restListItemProps} = props;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleShowDialog = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event): Promise<void> => {
        // conditions:
        if (!modelCreateComponent) return;
        
        
        
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
            onModelCreate?.({
                model : createdModel,
                event : event,
            });
        } // if
    });
    
    
    
    // jsx:
    const addNewButton = (
        <ButtonIcon
            // appearances:
            icon='add'
            
            
            
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
            addNewButton
            :
            <Group>
                {addNewButton}
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
            // behaviors:
            |'draggable' // reserved for <OrderableList>
            
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >
{
    // data:
    model : Pagination<TModel>['entities'][number]
}

/* <ModelEmpty> */
export interface ModalEmptyProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>
{
    // accessibilities:
    textEmpty ?: React.ReactNode
}
export const ModelEmpty = <TElement extends Element = HTMLElement>(props: ModalEmptyProps<TElement>) => {
    // props:
    const {
        // accessibilities:
        textEmpty = <>The data is empty.</>,
        
        
        
        // other props:
        ...restModalEmptyProps
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationListStyleSheet();
    
    
    
    // refs:
    const statusEmptyListRef = useRef<TElement|null>(null);
    
    
    
    // default props:
    const {
        // variants:
        theme = 'secondary',
        
        
        
        // other props:
        ...restListItemProps
    } = restModalEmptyProps;
    
    
    
    // jsx:
    return (
        <ListItem<TElement>
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={statusEmptyListRef}
            
            
            
            // classes:
            className={`${styleSheets.emptyModel} ${props.className}`}
        >
            <p>
                {textEmpty}
            </p>
        </ListItem>
    );
};

/* <PaginationList> */
export interface PaginationListProps<TModel extends Model, TElement extends Element = HTMLElement>
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
            
            
            
            // handlers:
            |'onModelCreate'
        >>,
        
        // accessibilities:
        Pick<ModalEmptyProps<TElement>,
            // accessibilities:
            |'textEmpty'
        >,
        
        // components:
        ListComponentProps<Element>
{
    // appearances:
    showPaginationTop     ?: boolean
    showPaginationBottom  ?: boolean
    autoHidePagination    ?: boolean
    
    
    
    // components:
    bodyComponent         ?: React.ReactComponentElement<any, BasicProps<Element>>
    modelEmptyComponent   ?: React.ReactComponentElement<any, GenericProps<Element>>
    modelVoidComponent    ?: React.ReactComponentElement<any, GenericProps<Element>>
    modelPreviewComponent  : React.ReactComponentElement<any, ModelPreviewProps<TModel, Element>>
    modelAddComponent     ?: React.ReactComponentElement<any, ModelAddProps<TModel, Element>> | null
    
    
    
    // children:
    menusBefore           ?: React.ReactNode
    menusAfter            ?: React.ReactNode
}
const PaginationList         = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationListProps<TModel, TElement>): JSX.Element|null => {
    // props:
    const {
        // appearances:
        showPaginationTop      = true,
        showPaginationBottom   = true,
        autoHidePagination     = false,
        
        
        
        // accessibilities:
        createItemText,
        textEmpty,
        
        
        
        // components:
        
        // we use <Basic> for the <GalleryBodyWrapper>, because the <GalleryBody> is ALREADY has nice styling:
        bodyComponent          = (<Basic<Element> /> as React.ReactComponentElement<any, BasicProps<Element>>),
        
        modelEmptyComponent    = (<ModelEmpty className='fluid' /* fluid: fills the entire <PaginationList> height */ textEmpty={textEmpty} /> as React.ReactComponentElement<any, GenericProps<Element>>),
        modelVoidComponent,
        modelCreateComponent,
        modelAddComponent      = !modelCreateComponent ? null : (<ModelCreateOuter /> as React.ReactComponentElement<any, ModelAddProps<TModel, Element>>),
        modelPreviewComponent,
        
        listComponent          = (<List<Element> /> as React.ReactComponentElement<any, ListProps<Element>>),
        
        
        
        // children:
        menusBefore,
        menusAfter,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restPaginationListProps
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationListStyleSheet();
    
    
    
    // states:
    const {
        // states:
        perPage,
        
        
        
        // data:
        data,
        isFetching,
        isError,
        refetch,
    } = usePaginationState<TModel>();
    const showPagination = (
        !autoHidePagination
        ? true
        : (
            (data?.total ?? 0) > perPage
        )
    );
    const isModelEmpty = !!data && !data.total;
    const pagedItems   = !data ? undefined : Object.values(data.entities);
    
    
    
    // refs:
    const dataListRef  = useRef<HTMLElement|null>(null);
    const innerListRef = useRef<HTMLElement|null>(null);
    
    
    
    // effects:
    const [requiresSeparatorHack, setRequiresSeparatorHack] = useState<boolean>(false); // hack-LESS if possible
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const innerListElm = innerListRef.current;
        if (!innerListElm) return;
        
        
        
        // setups:
        const requiresSeparatorHack = (
            !isModelEmpty
            &&
            ((): boolean => {
                const lastItemBottom = innerListElm.lastElementChild?.getBoundingClientRect().bottom;
                if (!lastItemBottom) return false;
                return ((innerListElm.getBoundingClientRect().bottom - lastItemBottom) >= 1 /* px */);
            })()
        );
        setRequiresSeparatorHack(requiresSeparatorHack);
    }, [pagedItems?.length ?? 0, isModelEmpty]); // runs the effect every time the items added/removed
    
    
    
    // default props:
    const {
        // accessibilities:
        createItemText : modelAddComponentCreateItemText = createItemText,
        
        
        
        // classes:
        className      : modelAddComponentClassName      = '',
        
        
        
        // states:
        enabled        : modelAddComponentEnabled        = data !== undefined, /* data is fully loaded even if empty data */
        
        
        
        // other props:
        ...restModelAddComponentProps
    } = modelAddComponent?.props ?? {};
    
    const {
        // semantics:
        tag       = 'article',
        
        
        
        // classes
        mainClass = styleSheets.main,
        
        
        
        // other props:
        ...restGenericProps
    } = restPaginationListProps;
    
    const {
        // variants:
        theme     : listComponentTheme     = 'inherit',
        mild      : listComponentMild      = 'inherit',
        listStyle : listComponentListStyle = 'flush',
        
        
        
        // classes:
        className : listComponentClassName,
        
        
        
        // children:
        children  : listComponentChildren = <>
            {/* <ModelCreate> */}
            {!!modelAddComponent && !!modelCreateComponent  && React.cloneElement<ModelAddProps<TModel, Element>>(modelAddComponent,
                // props:
                {
                    // other props:
                    ...restModelAddComponentProps,
                    
                    
                    
                    // accessibilities:
                    createItemText       : modelAddComponentCreateItemText,
                    
                    
                    
                    // classes:
                    className            : `solid ${modelAddComponentClassName}`,
                    
                    
                    
                    // states:
                    enabled              : modelAddComponentEnabled,
                    
                    
                    
                    // components:
                    modelCreateComponent : modelCreateComponent,
                    
                    
                    
                    // handlers:
                    onModelCreate        : onModelCreate,
                },
            )}
            
            {/* <ModelEmpty> */}
            {isModelEmpty && modelEmptyComponent}
            
            {/* <GalleryItem> */}
            {pagedItems?.filter((model): model is Exclude<typeof model, undefined> => !!model).map((model) =>
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
            
            {/* <VoidGalleryItem> */}
            {!!modelVoidComponent && ((pagedItems?.length ?? 0) < perPage) && (new Array<null>(perPage - (pagedItems?.length ?? 0)).fill(null).map((_, index) =>
                /* <ModelPreview> */
                React.cloneElement<GenericProps<Element>>(modelVoidComponent,
                    // props:
                    {
                        // identifiers:
                        key   : modelPreviewComponent.key ?? index,
                    },
                )
            ))}
            
            {/* a hack for making last separator when the total of <ListItems>(s) is smaller than the min-height of <List> */}
            {requiresSeparatorHack && <ListItem className={`solid ${styleSheets.separatorHack}`} />}
        </>,
        
        
        
        // other props:
        ...restListComponentProps
    } = listComponent.props;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <header className={`toolbar ${styleSheets.toolbar}`}>
                <div className='toolbarBefore'>
                    {menusBefore}
                </div>
                <div className='toolbarMain'>
                </div>
                <div className='toolbarAfter'>
                    {menusAfter}
                </div>
            </header>
            
            
            
            {showPagination && showPaginationTop && <PaginationNav<TModel>
                // classes:
                className={styleSheets.paginTop}
            />}
            
            {/* <GalleryBodyWrapper> */}
            {React.cloneElement<BasicProps<Element>>(bodyComponent,
                // props:
                {
                    // refs:
                    elmRef    : dataListRef,
                    
                    
                    
                    // variants:
                    mild      : true,
                    
                    
                    
                    // classes:
                    className : styleSheets.galleryBodyWrapper,
                },
                
                
                
                // children:
                <ModalLoadingError
                    // data:
                    isFetching={isFetching}
                    isError={isError}
                    refetch={refetch}
                    
                    
                    
                    // global stackable:
                    viewport={dataListRef}
                />,
                
                /* <GalleryBody> */
                /* we use <List> for the gallery body and we removed the surrounding border (flush) because the <GalleryBodyWrapper> is ALREADY has border */
                React.cloneElement<ListProps<Element>>(listComponent,
                    // props:
                    {
                        // other props:
                        ...restListComponentProps,
                        
                        
                        
                        // refs:
                        outerRef  : innerListRef,
                        
                        
                        
                        // variants:
                        theme     : listComponentTheme,
                        mild      : listComponentMild,
                        listStyle : listComponentListStyle,
                        
                        
                        
                        // classes:
                        className : `${styleSheets.galleryBody} ${listComponentClassName ?? ''}`,
                    },
                    
                    
                    
                    // children:
                    listComponentChildren,
                ),
            )}
            
            {showPagination && showPaginationBottom && <PaginationNav<TModel>
                // classes:
                className={styleSheets.paginBtm}
            />}
        </Generic>
    );
};
export {
    PaginationList,            // named export for readibility
    PaginationList as default, // default export to support React.lazy
}
