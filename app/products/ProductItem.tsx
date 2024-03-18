'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui components:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// stores:
import {
    // types:
    ProductPreview,
    
    
    
    // hooks:
    usePrefetchProductDetail,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface ProductItemProps {
    // data:
    product : ProductPreview
}
const ProductItem = ({product}: ProductItemProps) => {
    // refs:
    const articleRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // apis:
    const prefetchProductDetail = usePrefetchProductDetail();
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        const articleElm = articleRef.current;
        if (!articleElm) return;
        
        
        
        // setups:
        const observer = new IntersectionObserver((entries) => {
            // conditions:
            if (!entries[0]?.isIntersecting) return;
            
            
            
            // actions:
            observer.disconnect(); // the observer is no longer needed anymore
            prefetchProductDetail(product.path);
        }, {
            root      : null, // defaults to the browser viewport
            threshold : 0.5,
        });
        observer.observe(articleElm);
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, []);
    
    
    
    // jsx:
    return (
        <article
            // identifiers:
            key={product.id}
            
            
            
            // refs:
            ref={articleRef}
        >
            <Image
                // appearances:
                alt={product.name ?? ''}
                src={resolveMediaUrl(product.image)}
                sizes='414px' // (255*2) - ((4*16) * 1.5) = 414
                
                
                
                // classes:
                className='prodImg'
            />
            <header
                // classes:
                className='header'
            >
                <h2
                    // classes:
                    className='name h6'
                >
                    {product.name}
                </h2>
                <span
                    // classes:
                    className='price h6'
                >
                    <CurrencyDisplay convertAmount={true} amount={product.price} />
                </span>
            </header>
            <Link
                // data:
                href={`/products/${product.path}`}
            />
        </article>
    );
};
export {
    ProductItem,
    ProductItem as default,
};
