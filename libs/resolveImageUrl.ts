const resolveImageUrl = <TNull extends undefined|never = never>(imageId: string|TNull): string|TNull => {
    if (!imageId) return imageId;
    if (imageId.includes('/')) return imageId;
    if (!imageId.includes('.')) return `https://drive.google.com/uc?id=${imageId}`;
    return `/${imageId}`;
};
export default resolveImageUrl;
