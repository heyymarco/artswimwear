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

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface ModelImageProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ImageProps<TElement>,
            |'src' // replaced
            |'alt' // replaced
        >
{
    // data:
    src  : string|null
    alt ?: string|null
}
const ModelImage = <TElement extends Element = HTMLElement>(props: ModelImageProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // data:
        src,
        
        
        
        // other props:
        ...restModelImageProps
    } = props;
    
    
    
    // jsx:
    if (!src) return (
        <ModelImageBlank<TElement> {...restModelImageProps} />
    );
    return (
        <ModelImageInternal<TElement> {...restModelImageProps} src={src} />
    );
};
const ModelImageBlank = <TElement extends Element = HTMLElement>(props: Omit<ModelImageProps<TElement>, 'src'>): JSX.Element|null => {
    // default props:
    const {
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
            src={undefined}
            
            
            
            // accessibilities:
            alt={alt ?? ''}
        />
    );
};
const ModelImageInternal = <TElement extends Element = HTMLElement>(props: ModelImageProps<TElement> & { src: string }): JSX.Element|null => {
    // props:
    const {
        // data:
        src,
        alt,
        
        
        
        // other props:
        ...restModelImageProps
    } = props;
    
    
    
    // default props:
    const {
        // other props:
        ...restImageProps
    } = restModelImageProps;
    
    
    
    // jsx:
    return (
        <Image<TElement>
            // other props:
            {...restImageProps}
            
            
            
            // appearances:
            src={resolveMediaUrl(src)}
            
            
            
            // accessibilities:
            alt={`Image of ${alt ?? 'unknown'}`}
        />
    );
};
export {
    ModelImage,            // named export for readibility
    ModelImage as default, // default export to support React.lazy
}
