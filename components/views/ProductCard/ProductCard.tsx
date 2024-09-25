'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// styles:
import {
    useProductCardStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
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
import {
    ButtonWish,
}                           from '@/components/buttons/ButtonWish'

// models:
import {
    type ProductPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    usePrefetchProductDetail,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface ProductCardProps {
    // data:
    model : ProductPreview
}
const ProductCard = (props: ProductCardProps) => {
    // props:
    const {
        // data:
        model,
    } = props;
    const {
        // records:
        id,
        
        
        
        // data:
        name,
        price,
        path,
        image,
    } = model;
    
    
    
    // styles:
    const styleSheet = useProductCardStyleSheet();
    
    
    
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
            prefetchProductDetail(path);
        }, {
            root      : null, // defaults to the browser viewport
            threshold : 0.5,
        });
        observer.observe(articleElm);
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, [path]);
    
    
    
    // jsx:
    return (
        <article
            // identifiers:
            key={id}
            
            
            
            // refs:
            ref={articleRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <Link
                // data:
                href={`/products/${path}`}
            />
            <Image
                // appearances:
                alt={name}
                src={resolveMediaUrl(image)}
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
                    <span className='longText'>
                        {name}
                    </span>
                </h2>
                <span
                    // classes:
                    className='price h6'
                >
                    <span className='longText'>
                        <CurrencyDisplay amount={price} />
                    </span>
                </span>
                <ButtonWish
                    // data:
                    model={model}
                    
                    
                    
                    // classes:
                    className='wish'
                />
            </header>
        </article>
    );
};
export {
    ProductCard,            // named export for readibility
    ProductCard as default, // default export to support React.lazy
}
