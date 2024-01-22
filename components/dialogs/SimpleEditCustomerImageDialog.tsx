'use client'

// internal components:
import type {
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    UploadImage,
}                           from '@/components/editors/UploadImage'
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    // types:
    ValueOfModel,
    UpdateModelApi,
    
    
    
    // react components:
    SimpleEditModelDialogProps,
    ImplementedSimpleEditModelDialogProps,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// stores:
import type {
    // types:
    CustomerDetail,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface SimpleEditCustomerImageDialogProps
    extends
        // bases:
        Omit<ImplementedSimpleEditModelDialogProps<CustomerDetail, 'image'>, 'editorComponent'>,
        Partial<Pick<SimpleEditModelDialogProps<CustomerDetail, 'image'>, 'editorComponent'|'updateModelApi'>>
{
}
export const SimpleEditCustomerImageDialog = (props: SimpleEditCustomerImageDialogProps) => {
    // other props:
    interface CustomerImageModel {
        id    : CustomerDetail['id']
        image : string|null
    }
    const {
        // stores:
        updateModelApi,
        
        
        
        // components:
        editorComponent = (<UploadImage nude={true} imageComponent={<ProfileImage />} onResolveImageUrl={resolveMediaUrl<never>} /> as React.ReactComponentElement<any, EditorProps<Element, ValueOfModel<CustomerImageModel>>>),
    } = props;
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<CustomerImageModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<CustomerImageModel>}
            
            
            
            // stores:
            updateModelApi={updateModelApi as (UpdateModelApi<CustomerImageModel> | (() => UpdateModelApi<CustomerImageModel>))}
            
            
            
            // components:
            editorComponent={editorComponent}
        />
    );
};
