'use client'

// models:
import {
    // types:
    type PaginationArgs,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetCategoryPage,
    useGetCategoryPage as _useGetCategoryPage,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    rootPerPage,
}                           from './configs'



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

export const useGetHasCategories = (): boolean|undefined => {
    const { data: categoryPreviewPagination } = useGetRootCategoryPage({
        page    : 0,
        perPage : rootPerPage,
    });
    if (!categoryPreviewPagination) return undefined;
    return !!categoryPreviewPagination.total;
};
