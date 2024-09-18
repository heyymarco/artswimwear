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
    useEditWishGroupDialogStyleSheet,
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
    UniqueWishGroupNameEditor,
}                           from '@/components/editors/UniqueWishGroupNameEditor'
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
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateWishGroup,
    useDeleteWishGroup,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface EditWishGroupDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<WishGroupDetail>
{
}
const EditWishGroupDialog = (props: EditWishGroupDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditWishGroupDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [name, setName] = useState<string >(model?.name ?? '');
    
    
    
    // stores:
    const [updateWishGroup, {isLoading : isLoadingUpdate}] = useUpdateWishGroup();
    const [deleteWishGroup, {isLoading : isLoadingDelete}] = useDeleteWishGroup();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<WishGroupDetail>>(async ({id}) => {
        return await updateWishGroup({
            id : id ?? '',
            
            name,
        }).unwrap();
    });
    
    const handleDelete         = useEvent<DeleteHandler<WishGroupDetail>>(async ({id}) => {
        await deleteWishGroup({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<WishGroupDetail>>(({model}) => {
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
            <UniqueWishGroupNameEditor
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
        <ComplexEditModelDialog<WishGroupDetail>
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
    EditWishGroupDialog,
    EditWishGroupDialog as default,
}
