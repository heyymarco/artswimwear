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
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component
import {
    Busy,
    Icon,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components

// nextJS:
import Image                from 'next/image'



// styles:
export const useProductImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './ProductImageStyle')
, { id: 'ajnv9mjr5u', specificityWeight: 0 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



type ImageProps = Parameters<typeof Image>[0]
export interface ProductImageProps extends Omit<ImageProps, 'src'> {
    src ?: ImageProps['src']
}
const ProductImage = (props: ProductImageProps) => {
    // styles:
    const styleSheet = useProductImageStyleSheet();
    
    
    
    // states:
    const [isLoaded, setIsLoaded] = useState<boolean|undefined>(undefined);
    
    
    
    // handlers:
    const handleError = useEvent(() => {
        setIsLoaded(false); // error => false
    });
    const handleLoaded = useEvent(() => {
        setIsLoaded(true); // loaded => true
    });
    
    
    
    // jsx:
    const src = props.src;
    return (
        <figure className={styleSheet.main}>
            {/* no image => show default image: */}
            {(!src) && <Icon className='status' icon='image' theme='primary' size='lg' />}
            
            {/* loading: */}
            {(isLoaded === undefined) && <Busy className='status' theme='primary' size='lg' />}
            
            {/* error: */}
            {(isLoaded === false    ) && <Icon className='status' icon='broken_image' theme='primary' size='lg' />}
            
            {src && (isLoaded !== false) && <Image
                // other props:
                {...props}
                
                
                
                // appearances:
                src={src}
                fill={props.fill ?? true}
                sizes={props.sizes ?? '255px'}
                
                
                
                // handlers:
                onError={handleError}
                onLoadingComplete={handleLoaded}
            />}
        </figure>
    );
}
export {
    ProductImage,
    ProductImage as default,
}
