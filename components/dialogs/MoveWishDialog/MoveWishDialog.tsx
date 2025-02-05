'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardBody,
    CardFooter,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    type CreateHandler,
    
    
    
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'
import {
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    WishGroupPreview,
}                           from '@/components/views/WishGroupPreview'
import {
    EditWishGroupDialog,
}                           from '@/components/dialogs/EditWishGroupDialog'

// models:
import {
    type ModelSelectEventHandler,
    
    type WishGroupDetail,
}                           from '@/models'

// internals:
import {
    useMoveWishDialogStyleSheets,
}                           from './styles/loader'

// stores:
import {
    // hooks:
    useGetWishGroupPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface MoveWishDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishGroupDetail> = ModalExpandedChangeEvent<WishGroupDetail>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
    // data:
    currentWishGroupId ?: string
}
const MoveWishDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishGroupDetail> = ModalExpandedChangeEvent<WishGroupDetail>>(props: MoveWishDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // data:
        currentWishGroupId,
        
        
        
        // other props:
        ...restMoveWishDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheets = useMoveWishDialogStyleSheets();
    
    
    
    // states:
    const [selectedCollection, setSelectedCollection] = useState<WishGroupDetail|null>(null);
    
    
    
    // handlers:
    const handleGroupSelect        = useEvent<ModelSelectEventHandler<WishGroupDetail>>(({ model: wishGroup }) => {
        setSelectedCollection(wishGroup);
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : wishGroup,
        } as TModalExpandedChangeEvent);
    });
    const handleGroupCreated       = useEvent<CreateHandler<WishGroupDetail>>((wishGroup) => {
        setSelectedCollection(wishGroup as WishGroupDetail);
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : wishGroup,
        } as TModalExpandedChangeEvent);
    });
    const handleCloseDialog        = useEvent((): void => {
        // actions:
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : undefined,
        } as TModalExpandedChangeEvent);
    });
    
    
    
    // default props:
    const {
        // variants:
        theme          = 'primary',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restMoveWishDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restMoveWishDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader>
                <h1>Select a Destination Collection</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheets.cardBody}>
                <p>
                    Please select a new wishlist location:
                </p>
                <PaginationStateProvider<WishGroupDetail>
                    // states:
                    initialPerPage={10}
                    
                    
                    
                    // data:
                    useGetModelPage={useGetWishGroupPage}
                >
                    <PaginationList<WishGroupDetail>
                        // appearances:
                        showPaginationTop={false}
                        autoHidePagination={true}
                        
                        
                        
                        // accessibilities:
                        createItemText='Add New Collection'
                        textEmpty='Your collection is empty'
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            <WishGroupPreview
                                // data:
                                model={undefined as any}
                                currentModelId={currentWishGroupId}
                                
                                
                                
                                // values:
                                selectedModel={selectedCollection}
                                onModelSelect={handleGroupSelect}
                            />
                        }
                        modelCreateComponent={
                            <EditWishGroupDialog
                                // data:
                                model={null} // create a new model
                            />
                        }
                        
                        
                        
                        // handlers:
                        onModelCreate={handleGroupCreated}
                    />
                </PaginationStateProvider>
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='cancel' onClick={handleCloseDialog}>Cancel</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    MoveWishDialog,            // named export for readibility
    MoveWishDialog as default, // default export to support React.lazy
}
