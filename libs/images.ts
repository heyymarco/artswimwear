export const downloadImageAsBase64 = async (url: string, responsiveSize: number, quality: number = 75): Promise<string> => {
    const response    = await fetch(`${process.env.WEBSITE_URL}/_next/image?url=${encodeURIComponent(url)}&w=${responsiveSize}&q=${quality}`);
    if (response.status !== 200) throw Error('Unable to download the image.');
    const blob        = await response.blob();
    const buffer      = Buffer.from(await blob.arrayBuffer());
    const contentType = response.headers.get('Content-Type') ?? 'image';
    return `data:${contentType};base64, ${buffer.toString('base64')}`;
};
