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

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // menu-components:
    type DropdownListButtonProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'
import {
    type ButtonWishProps,
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
    
    
    
    // components:
    buttonWishComponent         ?: React.ReactElement<ButtonWishProps>|null
    dropdownListButtonComponent ?: React.ReactElement<DropdownListButtonProps>|((arg: { model: ProductPreview }) => React.ReactElement<DropdownListButtonProps>)|null
}
const ProductCard = (props: ProductCardProps): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        
        
        
        // components:
        buttonWishComponent         = (<ButtonWish model={model} /> as React.ReactElement<ButtonWishProps>),
        dropdownListButtonComponent : dropdownListButtonComponentFn = null,
    } = props;
    const dropdownListButtonComponent = (typeof(dropdownListButtonComponentFn) === 'function') ? dropdownListButtonComponentFn({ model }) : dropdownListButtonComponentFn;
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
    
    
    
    // jsx:
    return (<>
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
                sizes='534px' // max galleryImage size = (255*2) + (16 * 1.5) = 534
                
                
                
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
                
                {!!buttonWishComponent && React.cloneElement<ButtonWishProps>(buttonWishComponent,
                    // props:
                    {
                        // data:
                        model     : model,
                        
                        
                        
                        // classes:
                        className : 'wish',
                    },
                )}
                
                {!!dropdownListButtonComponent && React.cloneElement<DropdownListButtonProps>(dropdownListButtonComponent,
                    // props:
                    {
                        // variants:
                        theme             : 'primary',
                        buttonStyle       : 'link',
                        
                        
                        
                        // classes:
                        className         : 'more',
                        
                        
                        
                        // behaviors:
                        floatingPlacement : 'bottom-start',
                        
                        
                        
                        // components:
                        buttonComponent   : (
                            <ButtonIcon icon='more_vert' />
                        ),
                    },
                )}
            </header>
        </article>
        
        <PrefetchProductDetail
            // refs:
            articleRef={articleRef}
            
            
            
            // data:
            path={path}
        />
    </>);
};
export {
    ProductCard,            // named export for readibility
    ProductCard as default, // default export to support React.lazy
}



interface PrefetchProductDetailProps {
    // refs:
    articleRef : React.RefObject<HTMLDivElement|null>
    
    
    
    // data:
    path       : string
}
const PrefetchProductDetail = (props: PrefetchProductDetailProps): JSX.Element|null => {
    // props:
    const {
        // refs:
        articleRef,
        
        
        
        // data:
        path,
    } = props;
    
    
    
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
    return null;
};
