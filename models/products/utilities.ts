// models:
// models:
import {
    type ProductPreview,
}                           from './types'
import {
    // types:
    type Prisma,
}                           from '@/models'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'



// utilities:
export const productPreviewSelect = (customerId: string|undefined) => ({
    id             : true,
    
    name           : true,
    
    price          : true,
    shippingWeight : true,
    
    path           : true,
    
    images         : true,
    
    variantGroups : {
        select : {
            variants : {
                where    : {
                    visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                },
                select : {
                    id             : true,
                    
                    name           : true,
                    
                    price          : true,
                    shippingWeight : true,
                    
                    images         : true,
                },
                orderBy : {
                    sort : 'asc',
                },
            },
        },
        orderBy : {
            sort : 'asc',
        },
    },
    
    wishes        : !customerId ? undefined : {
        where : {
            parentId : customerId,
        },
        select : {
            id : true,
        },
        take : 1,
    },
}) satisfies Prisma.ProductSelect;
export const convertProductPreviewDataToProductPreview = (productPreviewData: Awaited<ReturnType<typeof prisma.product.findFirstOrThrow<{ select: ReturnType<typeof productPreviewSelect> }>>>): ProductPreview => {
    const {
        images,        // take
        variantGroups, // take
        wishes,        // take
    ...restProduct} = productPreviewData;
    return {
        ...restProduct,
        image         : images?.[0],
        variantGroups : (
            variantGroups
            .map(({variants}) =>
                variants
                .map(({images, ...restVariantPreview}) => ({
                    ...restVariantPreview,
                    image : images?.[0],
                }))
            )
        ),
        wished : !!wishes?.length,
    };
};