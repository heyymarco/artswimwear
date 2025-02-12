// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type Category,
}                           from '@prisma/client'
import {
    type GetProductPageRequest,
    type CategoryPageRequest,
    type SearchProductsPageRequest,
}                           from './types'
import {
    ModelIdSchema,
    SlugSchema,
    
    PaginationArgSchema,
}                           from '../commons'



// schemas:
export const GetProductPageRequestSchema = PaginationArgSchema.merge(
    z.object({
        categoryPath : z.array(SlugSchema).nonempty().optional(),
    }) satisfies z.Schema<{ categoryPath ?: string[] }>
) satisfies z.Schema<GetProductPageRequest>;



export const CategoryPageRequestSchema   = PaginationArgSchema.merge(
    z.object({
        parent : ModelIdSchema.nullable(),
    }) satisfies z.Schema<{ parent : Category['parentId'] }>
) satisfies z.Schema<CategoryPageRequest>;



export const SearchProductsPageRequestSchema = PaginationArgSchema.merge(
    z.object({
        query : z.string().trim().min(2).max(200).toLowerCase(),
    }) satisfies z.Schema<{ query : string }>
) satisfies z.Schema<SearchProductsPageRequest>;
