'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    useEditWishlistGroupDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    UniqueWishlistGroupNameEditor,
}                           from '@/components/editors/UniqueWishlistGroupNameEditor'
import {
    // types:
    UpdateHandler,
    
    DeleteHandler,
    
    ConfirmDeleteHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type WishlistGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateWishlistGroup,
    useDeleteWishlistGroup,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface EditWishlistGroupDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<WishlistGroupDetail>
{
}
const EditWishlistGroupDialog = (props: EditWishlistGroupDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditWishlistGroupDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [name, setName] = useState<string >(model?.name ?? '');
    
    
    
    // stores:
    const [updateWishlistGroup, {isLoading : isLoadingUpdate}] = useUpdateWishlistGroup();
    const [deleteWishlistGroup, {isLoading : isLoadingDelete}] = useDeleteWishlistGroup();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<WishlistGroupDetail>>(async ({id}) => {
        return await updateWishlistGroup({
            id : id ?? '',
            
            name,
        }).unwrap();
    });
    
    const handleDelete         = useEvent<DeleteHandler<WishlistGroupDetail>>(async ({id}) => {
        await deleteWishlistGroup({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<WishlistGroupDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{model.name}</strong> collection?
                </p>
            </>,
        };
    });
    
    
    
    // jsx:
    const mainTabContent = (
        <>
            <span className='name label'>Name:</span>
            <UniqueWishlistGroupNameEditor
                // refs:
                elmRef={firstEditorRef}
                
                
                
                // classes:
                className='name editor'
                
                
                
                // values:
                currentValue={model?.name ?? ''}
                value={name}
                onChange={setName}
            />
        </>
    );
    const mainTab = (
        !model
        ? <form className={styleSheet.collectionTab}>
            {mainTabContent}
        </form>
        : <TabPanel label='Collection' panelComponent={<Generic className={styleSheet.collectionTab} />}>
            {mainTabContent}
        </TabPanel>
    );
    return (
        <ComplexEditModelDialog<WishlistGroupDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Collection'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {true}
            privilegeUpdate = {useMemo(() => ({
                any : true,
            }), [])}
            privilegeDelete = {true}
            
            
            
            // stores:
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // tabs:
            tabDelete='Delete'
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            
            onConfirmDelete={handleConfirmDelete}
        >
            {mainTab}
        </ComplexEditModelDialog>
    );
};
export {
    EditWishlistGroupDialog,
    EditWishlistGroupDialog as default,
}
