// models:
// models:
import {
    type ProductPreview,
    
    type CategoryPreview,
    type CategoryDetail,
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
    
    wishes        : !!customerId && {
        where : {
            parentId : customerId,
        },
        select : {
            groupId : true,
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
        wished : !wishes?.length ? undefined : wishes?.[0]?.groupId,
    };
};

export const productDetailSelect = {
    id          : true,
    
    name        : true,
    
    price       : true,
    
    path        : true,
    
    excerpt     : true,
    description : true,
    
    images      : true,
    
    variantGroups : {
        select : {
            name : true,
            
            variants : {
                where    : {
                    visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                },
                select   : {
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
} satisfies Prisma.ProductSelect;



export const categoryPreviewSelect = {
    id             : true,
    
    name           : true,
    
    path           : true,
    
    images         : true,
} satisfies Prisma.CategorySelect;
export const convertCategoryPreviewDataToCategoryPreview = (categoryPreviewData: Awaited<ReturnType<typeof prisma.category.findFirstOrThrow<{ select: typeof categoryPreviewSelect }>>>): CategoryPreview => {
    const {
        images, // take
    ...restCategory} = categoryPreviewData;
    return {
        ...restCategory,
        image : images?.[0],
    };
};

export const categoryDetailSelect = (customerId: string|undefined) => ({
    id            : true,
    
    name          : true,
    
    path          : true,
    
    excerpt       : true,
    description   : true,
    
    images        : true,
    
    subcategories : {
        select    : categoryPreviewSelect,
    },
    products      : {
        select    : productPreviewSelect(customerId),
    },
}) satisfies Prisma.CategorySelect;
export const convertCategoryDetailDataToCategoryDetail = (categoryDetailData: Awaited<ReturnType<typeof prisma.category.findFirstOrThrow<{ select: ReturnType<typeof categoryDetailSelect> }>>>): CategoryDetail => {
    const {
        subcategories, // take
        products,      // take
    ...restCategory} = categoryDetailData;
    return {
        ...restCategory,
        subcategories : subcategories.map(convertCategoryPreviewDataToCategoryPreview),
        products      : products.map(convertProductPreviewDataToProductPreview),
    };
};
