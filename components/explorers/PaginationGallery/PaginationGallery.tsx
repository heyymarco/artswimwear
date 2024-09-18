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
    BasicComponentProps,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // menu-components:
    DropdownListButtonProps,
    
    
    
    // composite-components:
    Group,
    
    
    
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

// internals:
import {
    type Pagination,
    type Model,
}                           from '@/libs/types'
import {
    ModalLoadingError,
}                           from '@/components/ModalLoadingError'
import {
    // types:
    type ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'



// react components:

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps<TModel extends Model>
    extends
        // bases:
        BasicProps,
        
        // components:
        BasicComponentProps<Element>
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent  : React.ReactComponentElement<any, ModelCreateProps> | (() => TModel|Promise<TModel>) | false
    moreButtonComponent  ?: React.ReactComponentElement<any, DropdownListButtonProps>
    
    
    
    // handlers:
    onModelCreate        ?: CreateHandler<TModel>
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
        moreButtonComponent,
        basicComponent = (<Basic<Element> /> as React.ReactComponentElement<any, BasicProps<Element>>),
        
        
        
        // handlers:
        onModelCreate,
    ...resBasicProps} = props;
    
    
    
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
            onModelCreate?.(createdModel);
        } // if
    });
    
    
    
    // jsx:
    const addNewBUtton = (
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
    return React.cloneElement<BasicProps<Element>>(basicComponent,
        // props:
        {
            // other props:
            ...resBasicProps,
            
            
            
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
        Omit<BasicProps<TElement>,
            'draggable' // reserved for <OrderableList>
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
    } = props;
    
    
    
    // styles:
    const styleSheets = usePaginationGalleryStyleSheet();
    
    
    
    // refs:
    const statusEmptyListRef = useRef<TElement|null>(null);
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // refs:
            elmRef={statusEmptyListRef}
            
            
            
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
        ModalEmptyProps<TElement>
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
const PaginationGallery         = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationGalleryProps<TModel, TElement>): JSX.Element|null => {
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
            <Basic className={styleSheets.galleryBodyWrapper} mild={true} elmRef={dataListRef}>
                <ModalLoadingError
                    // data:
                    isFetching={isFetching}
                    isError={isError}
                    refetch={refetch}
                    
                    
                    
                    // global stackable:
                    viewport={dataListRef}
                />
                
                {/* <GalleryBody> */}
                <Basic tag='section' theme='inherit' mild='inherit' className={styleSheets.galleryBody}>
                    {/* <ModelCreate> */}
                    {!!modelCreateComponent  && <ModelCreateOuter<TModel>
                        // accessibilities:
                        createItemText={createItemText}
                        
                        
                        
                        // classes:
                        className='solid'
                        
                        
                        
                        // components:
                        modelCreateComponent={modelCreateComponent}
                        
                        
                        
                        // handlers:
                        onModelCreate={onModelCreate}
                    />}
                    
                    {/* <ModelEmpty> */}
                    {isModelEmpty && <ModelEmpty textEmpty={textEmpty} className='fluid' />}
                    
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
                </Basic>
            </Basic>
            
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
