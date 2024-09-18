'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// styles:
import {
    useWishGroupImageStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// models:
import {
    type WishGroupDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetWishPage,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface WishGroupImageProps {
    // data:
    model : WishGroupDetail
}
const WishGroupImage = (props: WishGroupImageProps): JSX.Element|null => {
    // styles:
    const styleSheet = useWishGroupImageStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
    } = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // stores:
    const [getWishPage, { data: wishes }] = useGetWishPage();
    const previews = !wishes ? undefined : Object.values(wishes.entities);
    
    
    
    // effects:
    useEffect(() => {
        getWishPage({ page: 1, perPage: 4, groupId: id });
    }, []);
    
    
    
    // jsx:
    return (
        <article
            // identifiers:
            key={id}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <Link
                // data:
                href={`/customer/wishes/collection/${encodeURIComponent(id)}`}
            />
            {!!previews && <div className='images'>
                {previews.map(({ image }, index) =>
                    <Image
                        // key:
                        key={index}
                        
                        
                        
                        // appearances:
                        alt={name}
                        src={resolveMediaUrl(image)}
                        sizes='207px' // (255*2) - ((4*16) * 1.5) = 414 => 414/2 = 207
                        
                        
                        
                        // classes:
                        className='prodImg'
                    />
                )}
            </div>}
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
                
                {!!wishes && <span
                    // classes:
                    className='count'
                >
                    {wishes.total} item{(wishes.total > 1) ? 's' : ''}
                </span>}
            </header>
        </article>
    );
};
export {
    WishGroupImage,
    WishGroupImage as default,
}
