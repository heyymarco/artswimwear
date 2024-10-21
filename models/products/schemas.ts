// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type Category,
}                           from '@prisma/client'
import {
    type CategoryPageRequest,
}                           from './types'
import {
    ModelIdSchema,
    
    PaginationArgSchema,
}                           from '../commons'



// schemas:
export const CategoryPageRequestSchema   = PaginationArgSchema.merge(
    z.object({
        parent : ModelIdSchema.nullable(),
    }) satisfies z.Schema<{ parent : Category['parentId'] }>
) satisfies z.Schema<CategoryPageRequest>;
