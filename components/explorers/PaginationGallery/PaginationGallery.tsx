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
    usePaginationGalleryStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    isTruthyNode,
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    Generic,
    BasicProps,
    Basic,
    IndicatorProps,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type ModelCreateProps,
    type CreateHandler,
    
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationNav,
}                           from '@/components/explorers/PaginationNav'

// models:
import {
    type Model,
    type Pagination,
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
        GenericProps<TElement>,
        Pick<IndicatorProps,
            // states:
            |'enabled'
        >
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent ?: React.ReactComponentElement<any, ModelCreateProps> | (() => TModel|Promise<TModel>) | false
    
    
    
    // handlers:
    onModelCreate        ?: CreateHandler<TModel>
}

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps<TModel extends Model>
    extends
        // bases:
        ModelAddProps<TModel, HTMLButtonElement>,
        ButtonProps,
        
        // components:
        ButtonComponentProps
{
}
export const ModelCreateOuter = <TModel extends Model>(props: ModelCreateOuterProps<TModel>) => {
    // styles:
    const styleSheets = usePaginationGalleryStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
        buttonComponent = (<ButtonIcon icon='add' /> as React.ReactComponentElement<any, ButtonProps>),
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restModelCreateOuterProps
    } = props;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleShowDialog = useEvent(async (): Promise<void> => {
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
            onModelCreate?.(createdModel);
        } // if
    });
    
    
    
    // default props:
    const {
        // variants:
        mild        : buttonMild        = true,
        orientation : buttonOrientation = 'block',
        
        
        
        // classes:
        className   : buttonClassName   = '',
    } = buttonComponent.props;
    
    const {
        // variants:
        mild        = buttonMild,
        orientation = buttonOrientation,
        
        
        
        // classes:
        className   : propsClassName = '',
        
        
        
        // other props:
        ...restButtonProps
    } = restModelCreateOuterProps
    
    
    
    // jsx:
    return React.cloneElement<ButtonProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonProps,
            
            
            
            // variants:
            mild        : mild,
            orientation : orientation,
            
            
            
            // classes:
            className   : `${styleSheets.createModel} ${buttonClassName} ${propsClassName}`,
            
            
            
            // handlers:
            onClick     : handleShowDialog,
        },
        
        
        
        // children:
        (createItemText ?? 'Add New Item'),
    );
};

/* <ModelPreview> */
export interface ModelPreviewProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<BasicProps<TElement>,
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
        BasicProps<TElement>
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
    const styleSheets = usePaginationGalleryStyleSheet();
    
    
    
    // refs:
    const statusEmptyListRef = useRef<TElement|null>(null);
    
    
    
    // default props:
    const {
        // variants:
        theme = 'secondary',
        
        
        
        // other props:
        ...restBasicProps
    } = restModalEmptyProps;
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // refs:
            elmRef={statusEmptyListRef}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // classes:
            className={`${styleSheets.emptyModel} ${props.className}`}
        >
            <p>
                {textEmpty}
            </p>
        </Basic>
    );
};

/* <PaginationGallery> */
export interface PaginationGalleryProps<TModel extends Model, TElement extends Element = HTMLElement>
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
        >
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
    
    galleryComponent      ?: React.ReactComponentElement<any, GenericProps<Element>>
    galleryGridComponent  ?: React.ReactComponentElement<any, GenericProps<Element>>
    galleryItemComponent  ?: React.ReactComponentElement<any, GenericProps<Element>>
    
    
    
    // children:
    menusBefore           ?: React.ReactNode
    menusAfter            ?: React.ReactNode
}
const PaginationGallery         = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationGalleryProps<TModel, TElement>): JSX.Element|null => {
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
        
        // we use <Content> for the <GalleryBodyWrapper>, because the <GalleryBody> is NOT have enough styling:
        bodyComponent          = (<Content<Element> /> as React.ReactComponentElement<any, BasicProps<Element>>),
        
        modelEmptyComponent    = (<ModelEmpty textEmpty={textEmpty} /> as React.ReactComponentElement<any, GenericProps<Element>>),
        modelVoidComponent,
        modelCreateComponent,
        modelAddComponent      = !modelCreateComponent ? null : (<ModelCreateOuter /> as React.ReactComponentElement<any, ModelAddProps<TModel, Element>>),
        modelPreviewComponent,
        
        galleryComponent       = (<Generic<Element> /> as React.ReactComponentElement<any, GenericProps<Element>>),
        galleryGridComponent   = (<Generic<Element> /> as React.ReactComponentElement<any, GenericProps<Element>>),
        galleryItemComponent   = (<Generic<Element> /> as React.ReactComponentElement<any, GenericProps<Element>>),
        
        
        
        // children:
        menusBefore,
        menusAfter,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restPaginationGalleryProps
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationGalleryStyleSheet();
    
    
    
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
    
    
    
    // default props:
    const {
        // semantics:
        tag       = 'article',
        
        
        
        // classes:
        mainClass = styleSheets.main,
        
        
        
        // other props:
        ...restGenericProps
    } = restPaginationGalleryProps;
    
    const {
        // semantics:
        tag       : galleryGridComponentTag  = 'div',
        role      : galleryGridComponentRole = 'presentation',
        
        
        
        // classes:
        className : galleryGridComponentClassName,
        
        
        
        // children:
        children  : galleryGridComponentChildren = flattenChildren(
            <>
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
                
                {/* <ModelCreate> */}
                {!!modelAddComponent && !!modelCreateComponent  && React.cloneElement<ModelAddProps<TModel, Element>>(modelAddComponent,
                    // props:
                    {
                        // accessibilities:
                        createItemText       : createItemText,
                        
                        
                        
                        // states:
                        enabled              : data !== undefined, /* data is fully loaded even if empty data */
                        
                        
                        
                        // components:
                        modelCreateComponent : modelCreateComponent,
                        
                        
                        
                        // handlers:
                        onModelCreate        : onModelCreate,
                    },
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
            </>
        )
        .filter(isTruthyNode) // only truthy children, so the <WrapperItem> doesn't wrap nullish children
        .map<React.ReactNode>((child, index) => {
            // tests:
            const isElement = React.isValidElement<GenericProps<Element>>(child);
            
            
            
            // default props:
            const {
                // semantics:
                tag       : galleryItemComponentTag  = 'div',
                role      : galleryItemComponentRole = 'listitem',
                
                
                
                // classes:
                className : galleryItemComponentClassName,
                
                
                
                // children:
                children  : galleryItemComponentChildren = child,
                
                
                
                // other props:
                ...restGalleryWrapperComponentProps
            } = galleryItemComponent.props;
            
            
            
            // jsx:
            return React.cloneElement<GenericProps<Element>>(galleryItemComponent,
                // props:
                {
                    // other props:
                    ...restGalleryWrapperComponentProps,
                    
                    
                    
                    // identifiers:
                    key       : (isElement ? child.key : null) ?? index,
                    
                    
                    
                    // semantics:
                    tag       : galleryItemComponentTag,
                    role      : galleryItemComponentRole,
                    
                    
                    
                    // classes:
                    className : `${styleSheets.galleryItem} ${galleryItemComponentClassName ?? ''}`,
                },
                
                
                
                // children:
                galleryItemComponentChildren,
            );
        }),
        
        
        
        // other props:
        ...restGalleryGridComponentProps
    } = galleryGridComponent.props;
    
    const {
        // semantics:
        tag       : galleryComponentTag  = 'div',
        role      : galleryComponentRole = 'list',
        
        
        
        // classes:
        className : galleryComponentClassName,
        
        
        
        // children:
        children  : galleryComponentChildren = <>
            {React.cloneElement<GenericProps<Element>>(galleryGridComponent,
                // props:
                {
                    // other props:
                    ...restGalleryGridComponentProps,
                    
                    
                    
                    // semantics:
                    tag       : galleryGridComponentTag,
                    role      : galleryGridComponentRole,
                    
                    
                    
                    // classes:
                    className : `${styleSheets.galleryGrid} ${galleryGridComponentClassName ?? ''}`,
                },
                
                
                
                // children:
                galleryGridComponentChildren,
            )}
        </>,
        
        
        
        // other props:
        ...restGalleryComponentProps
    } = galleryComponent.props;
    
    
    
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
                /* we use <Generic> for the gallery body because the <GalleryBodyWrapper> is ALREADY has nice styling */
                React.cloneElement<GenericProps<Element>>(galleryComponent,
                    // props:
                    {
                        // other props:
                        ...restGalleryComponentProps,
                        
                        
                        
                        // semantics:
                        tag       : galleryComponentTag,
                        role      : galleryComponentRole,
                        
                        
                        
                        // classes:
                        className : `${styleSheets.galleryBody} ${galleryComponentClassName ?? ''}`,
                    },
                    
                    
                    
                    // children:
                    galleryComponentChildren,
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
    PaginationGallery,            // named export for readibility
    PaginationGallery as default, // default export to support React.lazy
}
