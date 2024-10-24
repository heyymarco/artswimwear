'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    type PaginationGalleryProps,
    PaginationGallery,
}                           from '@/components/explorers/PaginationGallery'

// private components:
import {
    type CategoryExplorerBaseProps,
    CategoryExplorerBase,
}                           from './CategoryExplorerBase'

// models:
import {
    // types:
    type CategoryPreview,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface CategoryExplorerGalleryProps
    extends
        // bases:
        Omit<CategoryExplorerBaseProps,
            // components:
            |'paginationBaseComponent'
        >,
        Omit<PaginationGalleryProps<CategoryPreview>,
            // components:
            |'modelPreviewComponent'
        >
{
}
const CategoryExplorerGallery = (props: CategoryExplorerGalleryProps): JSX.Element|null => {
     // jsx:
    return (
        <CategoryExplorerBase
            // other props:
            {...props}
            
            
            
            // components:
            paginationBaseComponent={
                <PaginationGallery<CategoryPreview>
                    modelPreviewComponent={undefined as any}
                />
            }
        />
    );
};
export {
    CategoryExplorerGallery,
    CategoryExplorerGallery as default,
}
