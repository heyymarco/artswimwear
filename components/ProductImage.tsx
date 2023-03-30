// react:
import {
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component
import {
    GenericProps,
    Generic,
    
    
    
    Busy,
    Icon,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components

// nextJS:
import NextImage            from 'next/image'



// styles:
export const useProductImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './ProductImageStyle')
, { id: 'ajnv9mjr5u', specificityWeight: 0 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



type NextImageProps = Parameters<typeof NextImage>[0]
export interface ProductImageProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved to <Generic<Image>>
        >,
        Pick<GenericProps<HTMLImageElement>,
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved here
        >,
        
        // additional bases:
        Omit<NextImageProps,
            |'src'       // changed from required to optional
            |'role'      // moved to <Generic>
            |'key'|'ref' // React.ForwardRef
            |keyof React.DOMAttributes<TElement> // not supported yet
        >
{
    // appearances:
    src ?: NextImageProps['src'], // changed to optional
}
const ProductImage = <TElement extends Element = HTMLElement>(props: ProductImageProps<TElement>) => {
    // styles:
    const styleSheet = useProductImageStyleSheet();
    
    
    
    // states:
    const [isLoaded, setIsLoaded] = useState<boolean|undefined>(undefined);
    
    
    
    // rest props:
    const {
        // appearances:
        alt,
        src,
        loader,
        fill  = true,
        sizes = '255px',
        width,
        height,
        placeholder,
        blurDataURL,
        
        
        
        // behaviors:
        loading,
        priority,
        quality,
        unoptimized,
        
        
        
        // <img>:
        crossOrigin,
        decoding,
        referrerPolicy,
        useMap,
        
        
        
        // deprecated:
        // @ts-ignore
        layout,
        // @ts-ignore
        objectFit,
        // @ts-ignore
        objectPosition,
        // @ts-ignore
        lazyBoundary,
        // @ts-ignore
        lazyRoot,
        
        
        
        // handlers:
        onLoad,
        onLoadCapture,
        onError,
        onErrorCapture,
        onLoadingComplete,
    ...restGenericProps} = props;
    
    
    
    // handlers:
    const handleErrorInternal           = useEvent<React.ReactEventHandler<HTMLImageElement>>(() => {
        setIsLoaded(false); // error => false
    });
    const handleError                   = useMergeEvents(
        // preserves the original `onError`:
        onError,
        
        
        
        // handlers:
        handleErrorInternal,
    );
    
    const handleLoadingCompleteInternal = useEvent((_img: HTMLImageElement) => {
        setIsLoaded(true); // loaded => true
    });
    const handleLoadingComplete         = useMergeEvents(
        // preserves the original `onLoadingComplete`:
        onLoadingComplete,
        
        
        
        // handlers:
        handleLoadingCompleteInternal,
    );
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'figure'}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {/* no image => show default image: */}
            {(!src) && <Icon className='status' icon='image' theme='primary' size='lg' />}
            
            {/* loading: */}
            {(isLoaded === undefined) && <Busy className='status' theme='primary' size='lg' />}
            
            {/* error: */}
            {(isLoaded === false    ) && <Icon className='status' icon='broken_image' theme='primary' size='lg' />}
            
            {src && (isLoaded !== false) && <NextImage
                // appearances:
                alt={alt}
                src={src}
                loader={loader}
                fill={fill}
                sizes={sizes}
                width={width}
                height={height}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                
                
                
                // behaviors:
                loading={loading}
                priority={priority}
                quality={quality}
                unoptimized={unoptimized}
                
                
                
                // <img>:
                crossOrigin={crossOrigin}
                decoding={decoding}
                referrerPolicy={referrerPolicy}
                useMap={useMap}
                
                
                
                // deprecated:
                // @ts-ignore
                layout={layout}
                // @ts-ignore
                objectFit={objectFit}
                // @ts-ignore
                objectPosition={objectPosition}
                // @ts-ignore
                lazyBoundary={lazyBoundary}
                // @ts-ignore
                lazyRoot={lazyRoot}
                
                
                
                // handlers:
                onLoad={onLoad}
                onLoadCapture={onLoadCapture}
                onError={handleError}
                onErrorCapture={onErrorCapture}
                onLoadingComplete={handleLoadingComplete}
            />}
        </Generic>
    );
}
export {
    ProductImage,
    ProductImage as default,
}
