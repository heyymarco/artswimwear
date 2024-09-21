'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    type ImageProps,
    Image,
}                           from '@heymarco/image'

// stores:
import {
    // hooks:
    useGetProductPreview,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface ProductImageProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ImageProps<TElement>,
            |'src' // make optional
            |'alt' // make optional
        >,
        Partial<Pick<ImageProps<TElement>,
            |'src' // make optional
            |'alt' // make optional
        >>
{
    // data:
    productId : string|null
}
const ProductImage = <TElement extends Element = HTMLElement>(props: ProductImageProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        productId,
        
        
        
        // other props:
        ...restProductImageProps
    } = props;
    
    
    
    // jsx:
    if (!productId) return (
        <ProductImageBlank {...restProductImageProps} />
    );
    return (
        <ProductImageInternal {...restProductImageProps} productId={productId} />
    );
};
const ProductImageBlank = <TElement extends Element = HTMLElement>(props: Omit<ProductImageProps<TElement>, 'productId'>): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        src = undefined,
        
        
        
        // accessibilities:
        alt = 'No image',
        
        
        
        // other props:
        ...restImageProps
    } = props;
    
    
    
    // jsx:
    return (
        <Image<TElement>
            // other props:
            {...restImageProps}
            
            
            
            // appearances:
            src={src}
            
            
            
            // accessibilities:
            alt={alt}
        />
    );
};
const ProductImageInternal = <TElement extends Element = HTMLElement>(props: ProductImageProps<TElement> & { productId: string }): JSX.Element|null => {
    // props:
    const {
        // data:
        productId,
        
        
        
        // other props:
        ...restProductImageProps
    } = props;
    
    
    
    // apis:
    const { data: product } = useGetProductPreview(productId);
    
    
    
    // default props:
    const {
        // appearances:
        src = resolveMediaUrl(product?.image),
        
        
        
        // accessibilities:
        alt = `Image of ${product?.name ?? 'unknown product'}`,
        
        
        
        // other props:
        ...restImageProps
    } = restProductImageProps;
    
    
    
    // jsx:
    return (
        <Image<TElement>
            // other props:
            {...restImageProps}
            
            
            
            // appearances:
            src={src}
            
            
            
            // accessibilities:
            alt={alt}
        />
    );
};
export {
    ProductImage,            // named export for readibility
    ProductImage as default, // default export to support React.lazy
}
