const resolveImageUrl = (imageId: string|undefined): string|undefined => {
    if (!imageId) return undefined;
    if (imageId.includes('/')) return imageId;
    if (!imageId.includes('.')) return `https://drive.google.com/uc?id=${imageId}`;
    return `/products/${name}/${imageId}`
};
export default resolveImageUrl;
