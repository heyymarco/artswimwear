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
    Icon,
    Button,
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardBody,
    CardFooter,
    
    
    
    // notification-components:
    Alert,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'
// internal components:
import {
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
    type ModelUpsertEventHandler,
    
    type WishGroupDetail,
}                           from '@/models'

// internals:
import {
    useNotifyWishAddedDialogStyleSheets,
}                           from './styles/loader'

// stores:
import {
    // hooks:
    useGetWishGroupPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface NotifyWishAddedDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishGroupDetail> = ModalExpandedChangeEvent<WishGroupDetail>>
    extends
        // bases:
        Omit<ModalCardProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children'        // already taken over
        >
{
}
const NotifyWishAddedDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<WishGroupDetail> = ModalExpandedChangeEvent<WishGroupDetail>>(props: NotifyWishAddedDialogProps<TElement, TModalExpandedChangeEvent>) => {
    // props:
    const {
        // other props:
        ...restNotifyWishAddedDialogProps
    } = props;
    
    
    
    // styles:
    const styleSheets = useNotifyWishAddedDialogStyleSheets();
    
    
    
    // states:
    const [selectedCollection, setSelectedCollection] = useState<WishGroupDetail|null>(null);
    
    
    
    // handlers:
    const handleModelSelect        = useEvent<ModelSelectEventHandler<WishGroupDetail>>(({ model: wishGroup }) => {
        setSelectedCollection(wishGroup);
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : wishGroup,
        } as TModalExpandedChangeEvent);
    });
    const handleModelCreate        = useEvent<ModelUpsertEventHandler<WishGroupDetail>>(({ model: wishGroup }) => {
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
        theme          = 'success',
        backdropStyle  = 'static',
        modalCardStyle = 'scrollable',
    } = restNotifyWishAddedDialogProps;
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restNotifyWishAddedDialogProps}
            
            
            
            // variants:
            theme          = {theme}
            backdropStyle  = {backdropStyle}
            modalCardStyle = {modalCardStyle}
        >
            <CardHeader className={styleSheets.cardHeader}>
                <h1>Saved to Wishlist!</h1>
                <Button buttonStyle='link' onClick={handleCloseDialog}>
                    <Link href='/customer/wishes'>
                        <Icon icon='favorite' size='md' theme='danger' />
                        <span>
                            View my wishlist
                        </span>
                    </Link>
                </Button>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            <CardBody className={styleSheets.cardBody}>
                <Alert theme='success' expanded={true} mild={false} controlComponent={null}>
                    <p>
                        Item has been added to wishlist!
                    </p>
                </Alert>
                <p>
                    Also save to <em>your collection</em>? <span className='txt-sec'>(optional)</span>
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
                                
                                
                                
                                // values:
                                selectedModel={selectedCollection}
                                onModelSelect={handleModelSelect}
                            />
                        }
                        modelCreateComponent={
                            <EditWishGroupDialog
                                // data:
                                model={null} // create a new model
                            />
                        }
                        
                        
                        
                        // handlers:
                        onModelCreate={handleModelCreate}
                    />
                </PaginationStateProvider>
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnCancel' icon='done' onClick={handleCloseDialog}>No, Thanks</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    NotifyWishAddedDialog,            // named export for readibility
    NotifyWishAddedDialog as default, // default export to support React.lazy
}
