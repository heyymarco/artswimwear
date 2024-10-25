// models:
import {
    type ProductPreview,
    
    type CategoryPreview,
    type CategoryParentInfo,
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
    subcategories  : {
        select     : {
            id     : true,
        },
        take       : 1,
    },
} satisfies Prisma.CategorySelect;
export const convertCategoryPreviewDataToCategoryPreview = (categoryPreviewData: Awaited<ReturnType<typeof prisma.category.findFirstOrThrow<{ select: typeof categoryPreviewSelect }>>>): CategoryPreview => {
    const {
        images,        // take
        subcategories, // take
    ...restCategory} = categoryPreviewData;
    return {
        ...restCategory,
        image            : images?.[0],
        hasSubcategories : !!subcategories?.length,
    };
};

type NestedParentSelect = {
    select:
        &Pick<Extract<Extract<Prisma.CategorySelect['parent'], object>['select'], object>, 'id'|'parent'>
        &{
            parent : NestedParentSelect|undefined
        }
}
const createNestedParentSelect = (pathname: string[]): NestedParentSelect|undefined => {
    // conditions:
    if (!pathname.length) return undefined;
    
    
    
    // build:
    const [_currentPathname, ...restPathname] = pathname;
    return {
        select : {
            id : true,
            parent : createNestedParentSelect(restPathname),
        }
    };
};
export const categoryDetailSelect = (pathname: string[]) => ({
    id            : true,
    
    name          : true,
    
    path          : true,
    
    excerpt       : true,
    description   : true,
    
    images        : true,
    
    parent        : createNestedParentSelect(((): string[] => {
        const [_currentPathname, ...parentPathname] = pathname;
        return parentPathname;
    })()),
}) satisfies Prisma.CategorySelect;
export const convertCategoryDetailDataToCategoryDetail = async (categoryDetailData: Awaited<ReturnType<typeof prisma.category.findFirstOrThrow<{ select: ReturnType<typeof categoryDetailSelect> }>>>, prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<CategoryDetail> => {
    const {
        parent, // take
    ...restCategory} = categoryDetailData;
    
    
    
    const parentIds      : string[] = [];
    const grandparentIds = new Set<string|null>();
    for (let currentParent = parent; !!currentParent; currentParent = (currentParent as any).parent) {
        parentIds.push(currentParent.id);
        grandparentIds.add((currentParent as any).parent?.id ?? null);
    } // for
    const [parentsData, sortedParentSiblings] = await Promise.all([
        prismaTransaction.category.findMany({
            where  : {
                // accessible visibility:
                visibility : { not: 'DRAFT' }, // allows access to Category with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                id : { in: parentIds },
            },
            select : {
                ...categoryPreviewSelect,
                parentId : true,
            },
        }),
        
        prismaTransaction.category.findMany({
            where  : {
                // browsable visibility:
                visibility : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                OR : [
                    {
                        parentId : { in: Array.from(grandparentIds).filter((id): id is Exclude<typeof id, null> => (id !== null)) },
                    },
                    ...(grandparentIds.has(null) ? [{
                        parentId : null,
                    }] : []),
                ],
            },
            select  : {
                id       : true,
                parentId : true,
            },
            orderBy : {
                // not required
                // // first : sort by parent
                // parentId : 'asc',
                
                // then  : sort by name
                name     : 'asc', // shows the alphabetical Category for pagination_view
            },
        }),
    ]);
    const categoryParentInfos : CategoryParentInfo[] = (
        parentIds.map((parentId): CategoryParentInfo => {
            const {parentId: grandParentId, ...parent} = parentsData.find(({id: searchId}) => (searchId === parentId))!;
            const parentSiblings = sortedParentSiblings.filter(({parentId}) => (parentId === grandParentId));
            return {
                category : convertCategoryPreviewDataToCategoryPreview(parent),
                index    : parentSiblings.findIndex(({id: searchId}) => (searchId === parent.id)),
            };
        })
    );
    
    
    
    return {
        ...restCategory,
        parents  : categoryParentInfos,
    };
};
