'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSearchExplorerStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple components:
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'
import {
    ProductCard,
    EmptyProductCard,
}                           from '@/components/views/ProductCard'

// models:
import {
    // types:
    type ProductPreview,
}                           from '@/models'



// react components:
export interface SearchResultGalleryProps
{
    // handlers:
    onNavigate ?: ((url: string) => void) | null|undefined
}
const SearchResultGallery = (props: SearchResultGalleryProps): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onNavigate,
    } = props;
    
    
    
    // styles:
    const styles = useSearchExplorerStyleSheet();
    
    
    
    // states:
    const {
        data: searchResults,
    } = usePaginationState<ProductPreview>();
    const isInitialSearch = (searchResults === undefined);
    const isEmptyResult   = !!searchResults && (searchResults.total === 0);
    
    
    
    // handlers:
    const handleItemClick = useEvent<React.MouseEventHandler<HTMLAnchorElement>>((event) => {
        onNavigate?.(event.currentTarget.href);
    });
    
    
    
    // jsx:
    if (isInitialSearch) {
        return (
            <Icon icon='search' className='results initial' theme='primary' />
        );
    } // if
    return (
        <PaginationGallery<ProductPreview>
            // appearances:
            autoHidePagination={true}
            showPaginationTop={false}
            
            
            
            // classes:
            className={`results ${isEmptyResult ? 'empty' : ''}`}
            
            
            
            // accessibilities:
            textEmpty='No results found.'
            scrollable={true}
            
            
            
            // components:
            bodyComponent={
                <Basic className={styles.gallery} />
            }
            modelEmptyComponent={
                <EmptyProductCard
                    // accessibilities:
                    emptyText='No results found.'
                />
            }
            modelPreviewComponent={
                <ProductCard
                    // data:
                    model={undefined as any}
                    
                    
                    
                    // handlers:
                    onClick={handleItemClick}
                />
            }
        />
    );
};
export {
    SearchResultGallery,
    SearchResultGallery as default,
}