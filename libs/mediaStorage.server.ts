import {
    // apis:
    put  as uploadBlob,
    del  as deleteBlob,
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
export const uploadMedia = async (fileName: string, stream: ReadableStream, options?: UploadMediaOptions): Promise<string> => {
    // options:
    const {
        folder,
    } = options ?? {};
    
    
    
    const blobResult = await uploadBlob((folder ? `${folder}/${fileName}` : fileName), stream, {
        token              : process.env.BLOB_READ_WRITE_TOKEN,
        access             : 'public',
        contentType        : undefined,
        addRandomSuffix    : true, // avoids name conflict
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
