'use client'

// models:
import {
    // types:
    type PaginationArgs,
    type CategoryPreview,
    
    
    
    // defaults:
    defaultRootCategoryPerPage,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetCategoryPage,
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'



// hooks:
export const useGetRootCategoryPage = (arg: PaginationArgs) => {
    return useGetCategoryPage({
        ...arg,
        parent : null,
    });
};

export const useUseGetSubCategoryPage = (parentCategory: string|null) => {
    return (arg: PaginationArgs) => {
        return _useGetCategoryPage({
            ...arg,
            parent : parentCategory,
        });
    };
};

export const useGetHasCategories = (): [boolean|undefined, CategoryPreview|null|undefined] => {
    const { data: categoryPreviewPagination } = useGetRootCategoryPage({
        page    : 0,
        perPage : defaultRootCategoryPerPage,
    });
    if (!categoryPreviewPagination) return [undefined, undefined];
    return [
        !!categoryPreviewPagination.total, // if non_zero => it have a/some categories
        
        categoryPreviewPagination.entities[0] ?? null // expose the first root_category, because it selected by default when the <CategoryExplorerDropdown> shown, so we need to prefetch the first_root_category and the prefetch subcategories of it
    ];
};
