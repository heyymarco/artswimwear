import { buildUrl } from 'cloudinary-build-url'



export const resolveMediaUrl = <TNull extends undefined|never = never>(imageId: string|TNull): string|TNull => {
    if (!imageId) return imageId;
    return buildUrl(imageId, {
        cloud : {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_ENV,
        },
    });
};
