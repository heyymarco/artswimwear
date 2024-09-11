'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// styles:
import {
    useProductCardStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

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
    useGetWishlists,
    useUpdateWishlist,
    useDeleteWishlist,
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
        model : {
            // records:
            id,
            
            
            
            // data:
            name,
            price,
            path,
            image,
        },
    } = props;
    
    
    
    // sessions:
    const { status: sessionStatus } = useSession();
    
    
    
    // styles:
    const styleSheet = useProductCardStyleSheet();
    
    
    
    // refs:
    const articleRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // apis:
    const prefetchProductDetail = usePrefetchProductDetail();
    
    const [getWishlists, { data: wishlists }] = useGetWishlists();
    const [updateWishlist] = useUpdateWishlist();
    const [deleteWishlist] = useDeleteWishlist();
    const isWishlisted = (!!wishlists && !!wishlists.entities[id]);
    
    
    
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
    
    useEffect(() => {
        // conditions:
        if (sessionStatus !== 'authenticated') return; // only interested to signedIn customer
        
        
        
        // actions:
        getWishlists({ groupId: undefined /* all wishlists in current signedIn customer */ });
    }, [sessionStatus]);
    
    
    
    // handlers:
    const handleWishlistClick = useEvent(() => {
        if (!isWishlisted) {
            updateWishlist({
                productId : id,
                groupId   : undefined,
            });
        }
        else {
            deleteWishlist({
                productId : id,
            });
        } // if
    });
    
    
    
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
                    {name}
                </h2>
                <span
                    // classes:
                    className='price h6'
                >
                    <CurrencyDisplay amount={price} />
                </span>
                <ButtonIcon
                    // appearances:
                    icon={isWishlisted ? 'favorite' : 'favorite_outline'}
                    
                    
                    
                    // variants:
                    buttonStyle='link'
                    theme='danger'
                    
                    
                    
                    // classes:
                    className='wishlist'
                    
                    
                    
                    // handlers:
                    onClick={handleWishlistClick}
                />
            </header>
        </article>
    );
};
export {
    ProductCard,            // named export for readibility
    ProductCard as default, // default export to support React.lazy
}
