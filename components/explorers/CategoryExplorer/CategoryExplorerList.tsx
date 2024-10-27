'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    type PaginationListProps,
    PaginationList,
}                           from '@/components/explorers/PaginationList'

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



// react components:
export interface CategoryExplorerListProps
    extends
        // bases:
        Omit<CategoryExplorerBaseProps,
            // components:
            |'paginationBaseComponent'
        >,
        Omit<PaginationListProps<CategoryPreview>,
            // components:
            |'modelPreviewComponent'
        >
{
}
const CategoryExplorerList = (props: CategoryExplorerListProps): JSX.Element|null => {
     // jsx:
    return (
        <CategoryExplorerBase
            // other props:
            {...props}
            
            
            
            // components:
            paginationBaseComponent={
                <PaginationList<CategoryPreview>
                    modelPreviewComponent={undefined as any}
                />
            }
        />
    );
};
export {
    CategoryExplorerList,
    CategoryExplorerList as default,
}
