import {
    // apis:
    put as uploadBlob,
    del as deleteBlob,
}                           from '@vercel/blob'
import {
    // types:
    HandleUploadBody,
    
    
    
    // apis:
    handleUpload as handleUploadBlob,
}                           from '@vercel/blob/client'



interface UploadMediaOptions {
    folder?: string
}
export const uploadMedia = async (file: File, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const blobResult = await uploadBlob((folder ? `${folder}/${file.name}` : file.name), await file.arrayBuffer(), {
        token              : process.env.BLOB_READ_WRITE_TOKEN,
        access             : 'public',
        contentType        : 'image/*',
        addRandomSuffix    : true,
        cacheControlMaxAge : undefined,
        multipart          : false,
    });
    return blobResult.url;
};

export const deleteMedia = async (imageId: string): Promise<void> => {
    await deleteBlob(imageId, {
        token : process.env.BLOB_READ_WRITE_TOKEN,
    });
};
