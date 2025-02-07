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

// heymarco components:
import {
    type EditorProps,
}                           from '@heymarco/editor'

// internal components:
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

// models:
import {
    // types:
    type CustomerDetail,
}                           from '@/models'


// stores:
import {
    // hooks:
    usePostImage,
    useDeleteImage,
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
        Partial<Pick<SimpleEditModelDialogProps<CustomerDetail, 'image'>, 'editorComponent'|'useUpdateModel'>>
{
}
export const SimpleEditCustomerImageDialog = (props: SimpleEditCustomerImageDialogProps) => {
    // states:
    const [image, setImage   ] = useState<string|null>(props.model?.image ?? null); // optional field
    const [initialImage]       = useState<string|null>(() => props.model?.image ?? null); // optional field
    const [draftDeletedImages] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    
    
    // stores:
    const [postImage] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    
    
    
    // handlers:
    const handleSideModelSave       = useEvent(async (commitImages : boolean): Promise<void> => {
        // initial_image have been replaced with new image:
        if (commitImages && initialImage && (initialImage !== image)) {
            // register to actual_delete the initial_image when committed:
            draftDeletedImages.set(initialImage, true /* true: delete when committed, noop when reverted */);
        } // if
        
        
        
        // search for unused image(s) and delete them:
        const unusedImageIds : string[] = [];
        for (const unusedImageId of
            Array.from(draftDeletedImages.entries())
            .filter((draftDeletedImage) => ((draftDeletedImage[1] === commitImages) || (draftDeletedImage[1] === null)))
            .map((draftDeletedImage) => draftDeletedImage[0])
        )
        {
            unusedImageIds.push(unusedImageId);
        } // for
        
        
        
        try {
            if (unusedImageIds.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImageIds,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
        
        
        
        // substract the drafts:
        for (const unusedImageId of unusedImageIds) draftDeletedImages.delete(unusedImageId);
    });
    const handleSideModelCommitting = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */true);
    });
    const handleSideModelDiscarding = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */false);
    });
    
    
    
    // other props:
    interface CustomerImageModel {
        id    : CustomerDetail['id']
        image : string|null
    }
    const {
        // stores:
        useUpdateModel,
        
        
        
        // components:
        editorComponent = (<UploadImage
            // variants:
            nude={true}
            
            
            
            // values:
            value={image}
            onChange={(value) => {
                setImage(value);
            }}
            
            
            
            // components:
            imageComponent={<ProfileImage nude={true} />}
            
            
            
            // handlers:
            onUploadImage={async ({ imageFile, reportProgress, abortSignal }) => {
                try {
                    const imageId = await postImage({
                        image            : imageFile,
                        folder           : 'customers',
                        onUploadProgress : reportProgress,
                        abortSignal      : abortSignal,
                    }).unwrap();
                    
                    // replace => delete prev drafts:
                    await handleSideModelDiscarding();
                    
                    // register to actual_delete the new_image when reverted:
                    draftDeletedImages.set(imageId, false /* false: delete when reverted, noop when committed */);
                    
                    return imageId;
                }
                catch (error : any) {
                    if (error.status === 0) { // non_standard HTTP status code: a request was aborted
                        // TODO: try to cleanup a prematurely image (if any)
                        
                        return null; // prevents showing error
                    } // if
                    
                    throw error;     // shows the error detail
                } // try
            }}
            onDeleteImage={async ({ imageData: imageId }) => {
                // register to actual_delete the deleted_image when committed:
                draftDeletedImages.set(imageId,
                    draftDeletedImages.has(imageId) // if has been created but not saved
                    ? null /* null: delete when committed, delete when reverted */
                    : true /* true: delete when committed, noop when reverted */
                );
                
                return true;
            }}
            onResolveImageUrl={resolveMediaUrl<never>}
        /> as React.ReactElement<EditorProps<Element, ValueOfModel<CustomerImageModel>>>),
    } = props;
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<CustomerImageModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<CustomerImageModel>}
            
            
            
            // stores:
            useUpdateModel={useUpdateModel as (UpdateModelApi<CustomerImageModel> | (() => UpdateModelApi<CustomerImageModel>))}
            isCommiting={isLoadingCommitDeleteImage}
            isReverting={isLoadingRevertDeleteImage}
            
            
            
            // components:
            editorComponent={editorComponent}
            
            
            
            // handlers:
            onSideModelCommitting={handleSideModelCommitting}
            onSideModelDiscarding={handleSideModelDiscarding}
        />
    );
};
