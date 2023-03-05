import { Busy, Icon } from '@reusable-ui/components';
import { useEvent } from '@reusable-ui/core';
import Image from 'next/image'
import { useState } from 'react';



type ImageProps = Parameters<typeof Image>[0]
export interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src ?: ImageProps['src']
}
export default (props: ImageWithFallbackProps) => {
    const [isLoaded, setIsLoaded] = useState<boolean|undefined>(undefined);
    const handleError = useEvent(() => {
        setIsLoaded(false); // error => false
    });
    const handleLoaded = useEvent(() => {
        setIsLoaded(true); // loaded => true
    });
    
    
    
    // loaded:
    const src = props.src;
    return (
        <>
            {/* no image => show default image: */}
            {(!src) && <Icon className='img' icon='image' theme='primary' size='lg' />}
            
            {/* loading: */}
            {(isLoaded === undefined) && <Busy className='img' theme='primary' size='lg' />}
            
            {/* error: */}
            {(isLoaded === false    ) && <Icon className='img' icon='broken_image' theme='primary' size='lg' />}
            
            {src && (isLoaded !== false) && <Image {...props} src={src} onError={handleError} onLoadingComplete={handleLoaded} />}
        </>
    );
}