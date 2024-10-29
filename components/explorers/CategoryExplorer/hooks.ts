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
