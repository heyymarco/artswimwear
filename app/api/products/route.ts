// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import type {
    ProductPreview,
    ProductDetail,
}                           from '@/models'
export type {
    VariantPreview,
    ProductPreview,
    VariantDetail,
    VariantGroupDetail,
    ProductDetail,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    // handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.get(async (req) => {
    /* required for displaying related_products in orders page */
    
    
    
    //#region parsing request
    const path = req.nextUrl.searchParams.get('path');
    //#endregion parsing request
    
    
    
    if (path) {
        const productDetail : ProductDetail|null = (
            await prisma.product.findUnique({
                where  : {
                    path       : path, // find by url path
                    visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : {
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
                },
            })
        );
        
        if (!productDetail) {
            return NextResponse.json({
                error: `The product with specified path "${path}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return NextResponse.json(productDetail); // handled with success
    } // if
    
    
    
    const productPreviews : ProductPreview[] = (
        (await prisma.product.findMany({
            where  : {
                visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
            },
            select : {
                id                   : true,
                
                name                 : true,
                
                price                : true,
                shippingWeight       : true,
                
                path                 : true,
                
                images               : true,
                
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
            },
        }))
        .map((product) => {
            const {
                images,        // take
                variantGroups, // take
            ...restProduct} = product;
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
            };
        })
    );
    return NextResponse.json(productPreviews); // handled with success
});
