'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    useProductCardStyleSheet,
}                           from './styles/loader'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // menu-components:
    type DropdownListButtonProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components
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
    type ButtonWishProps,
    ButtonWish,
}                           from '@/components/buttons/ButtonWish'
import {
    PrefetchProductDetail,
}                           from '@/components/prefetches/PrefetchProductDetail'

// models:
import {
    type ProductPreview,
}                           from '@/models'

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
    
    
    
    // handlers:
    onClick                     ?: React.MouseEventHandler<HTMLAnchorElement>
}
const ProductCard = (props: ProductCardProps): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        
        
        
        // components:
        buttonWishComponent         = (<ButtonWish model={model} /> as React.ReactElement<ButtonWishProps>),
        dropdownListButtonComponent : dropdownListButtonComponentFn = null,
        
        
        
        // handlers:
        onClick,
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
    const viewRef = useRef<HTMLDivElement|null>(null);
    
    
    
    // jsx:
    return (<>
        <article
            // identifiers:
            key={id}
            
            
            
            // refs:
            ref={viewRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <Link
                // data:
                href={`/products/${path}`}
                
                
                
                // behaviors:
                prefetch={true} // force to DEEP prefetch of product PAGE
                
                
                
                // handlers:
                onClick={onClick}
            />
            <Image
                // appearances:
                alt={name}
                src={resolveMediaUrl(image)}
                sizes='534px' // maxGalleryItemWidth = (255*2) + (16 * 1.5) = 534
                
                
                
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
        
        {/* PREFETCH for displaying product PAGE: */}
        <PrefetchProductDetail
            // refs:
            subjectRef={viewRef}
            
            
            
            // data:
            path={path}
        />
    </>);
};
export {
    ProductCard,            // named export for readibility
    ProductCard as default, // default export to support React.lazy
}
