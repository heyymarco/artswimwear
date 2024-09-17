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
    
    
    
    PaginationExplorerStateProvider,
    PaginationExplorer,
}                           from '@/components/explorers/PaginationExplorer'
import {
    WishlistGroupPreview,
}                           from '@/components/views/WishlistGroupPreview'
import {
    EditWishlistGroupDialog,
}                           from '@/components/dialogs/EditWishlistGroupDialog'

// models:
import {
    type WishlistGroupDetail,
}                           from '@/models'

// internals:
import {
    useNotifyWishlistAddedDialogStyleSheets,
}                           from './styles/loader'

// stores:
import {
    // hooks:
    useGetWishlistGroupPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface NotifyWishlistAddedDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishlistGroupDetail> = ModalExpandedChangeEvent<WishlistGroupDetail>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
}
const NotifyWishlistAddedDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishlistGroupDetail> = ModalExpandedChangeEvent<WishlistGroupDetail>>(props: NotifyWishlistAddedDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // other props:
        ...restNotifyWishlistAddedDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheets = useNotifyWishlistAddedDialogStyleSheets();
    
    
    
    // states:
    const [selectedCollection, setSelectedCollection] = useState<WishlistGroupDetail|null>(null);
    
    
    
    // handlers:
    const handleGroupSelected      = useEvent((wishlistGroup: WishlistGroupDetail): void => {
        setSelectedCollection(wishlistGroup);
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : wishlistGroup,
        } as TModalExpandedChangeEvent);
    });
    const handleGroupCreated      = useEvent<CreateHandler<WishlistGroupDetail>>((wishlistGroup) => {
        setSelectedCollection(wishlistGroup as WishlistGroupDetail);
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : wishlistGroup,
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
        theme          = 'success',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restNotifyWishlistAddedDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restNotifyWishlistAddedDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader className={styleSheets.cardHeader}>
                <h1>Saved to Wishlist!</h1>
                <ButtonIcon icon='menu' buttonStyle='link'>View Wishlist</ButtonIcon>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheets.cardBody}>
                <p>
                    Also save to <em>your collection</em>? <span className='txt-sec'>(optional)</span>
                </p>
                <PaginationExplorerStateProvider
                    // states:
                    initialPerPage={10}
                    
                    
                    
                    // data:
                    useGetModelPage={useGetWishlistGroupPage}
                >
                    <PaginationExplorer<WishlistGroupDetail>
                        // appearances:
                        showPaginationTop={false}
                        autoHidePagination={true}
                        
                        
                        
                        // accessibilities:
                        createItemText='Add New Collection'
                        textEmpty='Your collection is empty'
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            <WishlistGroupPreview
                                // data:
                                model={undefined as any}
                                
                                
                                
                                // values:
                                selectedModel={selectedCollection}
                                onModelSelect={handleGroupSelected}
                            />
                        }
                        modelCreateComponent={
                            <EditWishlistGroupDialog
                                // data:
                                model={null} // create a new model
                            />
                        }
                        
                        
                        
                        // handlers:
                        onModelCreate={handleGroupCreated}
                    />
                </PaginationExplorerStateProvider>
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='done' onClick={handleCloseDialog}>No, Thanks</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    NotifyWishlistAddedDialog,            // named export for readibility
    NotifyWishlistAddedDialog as default, // default export to support React.lazy
}
