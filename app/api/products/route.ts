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
import {
    type Pagination,
}                           from '@/libs/types'
import {
    type ProductPreview,
    type ProductDetail,
    
    
    
    PaginationArgSchema,
    
    
    
    productPreviewSelect,
    convertProductPreviewDataToProductPreview,
}                           from '@/models'
export type {
    VariantPreview,
    VariantDetail,
    VariantGroupDetail,
    
    ProductPreview,
    ProductDetail,
    
    ProductPricePart,
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
    handler as POST,
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
    const id   = req.nextUrl.searchParams.get('id');
    //#endregion parsing request
    
    
    
    if (id) {
        const productPreviewData = (
            await prisma.product.findUnique({
                where  : {
                    id         : id, // find by id
                    visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : productPreviewSelect,
            })
        );
        
        if (!productPreviewData) {
            return NextResponse.json({
                error: `The product with specified path "${path}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return NextResponse.json(convertProductPreviewDataToProductPreview(productPreviewData) satisfies ProductPreview); // handled with success
    }
    else if (path) {
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
            select : productPreviewSelect,
        }))
        .map(convertProductPreviewDataToProductPreview)
    );
    return NextResponse.json(productPreviews); // handled with success
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paginationArg : {
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region query result
    const [total, paged] = await prisma.$transaction([
        prisma.product.count({
            where  : {
                visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
            },
        }),
        prisma.product.findMany({
            where  : {
                visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
            },
            select  : productPreviewSelect,
            orderBy : {
                name: 'asc', // shows the alphabetical Product for pagination_view
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationOrderDetail : Pagination<ProductPreview> = {
        total    : total,
        entities : paged.map(convertProductPreviewDataToProductPreview),
    };
    return Response.json(paginationOrderDetail); // handled with success
    //#endregion query result
});
