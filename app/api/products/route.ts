// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'

// models:
import {
    type Pagination,
    type ProductPreview,
    type ProductDetail,
    
    
    
    // schemas:
    ModelIdSchema,
    SlugSchema,
    PaginationArgSchema,
    GetProductPageRequestSchema,
    
    
    
    productPreviewSelect,
    convertProductPreviewDataToProductPreview,
    productDetailSelect,
    createNestedConditionalCategory,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-cache';
export const revalidate = 1 * 24 * 3600;



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<Request, RequestContext>();
const handler = async (req: Request, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (session) (req as any).session = session;
    
    
    
    // not_authenticated|authenticated => next:
    return await next();
})
.get(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                id   : ModelIdSchema.optional().parse(data?.id),
                path : SlugSchema.optional().parse(data?.path),
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
        id,
        path,
    } = requestData;
    
    // one of `id` or `path` must be defined, but cannot both defined or both undefined:
    if (
        ((id === undefined) && (path === undefined)) // both undefined
        ||
        ((id !== undefined) && (path !== undefined)) // both defined
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session?.user?.id ?? undefined; // optional loggedIn (allows for public access too)
    //#endregion validating privileges
    
    
    
    //#region query result
    if (id) {
        const productPreviewData = (
            await prisma.product.findUnique({
                where  : {
                    id         : id, // find by id
                    visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : productPreviewSelect(customerId),
            })
        );
        
        if (!productPreviewData) {
            return Response.json({
                error: `The product with specified id "${id}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return Response.json(convertProductPreviewDataToProductPreview(productPreviewData) satisfies ProductPreview); // handled with success
    }
    else if (path) {
        const productDetailData = (
            await prisma.product.findUnique({
                where  : {
                    path       : path, // find by url path
                    visibility : { not: 'DRAFT' }, // allows access to Product with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : productDetailSelect,
            })
        );
        
        if (!productDetailData) {
            return Response.json({
                error: `The product with specified path "${path}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        const {
            autoKeywords,
            keywords,
            ...productDetail
        } = productDetailData;
        return Response.json({
            ...productDetail,
            keywords : [
                ...keywords,
                ...autoKeywords,
            ],
        } satisfies ProductDetail); // handled with success
    } // if
    //#endregion query result
    
    
    
    // default response:
    return Response.json({
        error: 'Invalid data.',
    }, { status: 400 }); // handled with error
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                getProductPageRequest : GetProductPageRequestSchema.parse(data),
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
        getProductPageRequest : {
            page,
            perPage,
            categoryPath,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session?.user?.id ?? undefined; // optional loggedIn (allows for public access too)
    //#endregion validating privileges
    
    
    
    //#region query result
    const relatedCategoryId : string|null|undefined = (categoryPath === undefined) ? undefined : await (async (): Promise<string|null> => {
        categoryPath.reverse(); // reverse from currentPath up to rootPath
        const nestedConditionalCategory = createNestedConditionalCategory(categoryPath);
        if (!nestedConditionalCategory) return null;
        
        const relatedCategory = await prisma.category.findUnique({
            where  : nestedConditionalCategory,
            select : {
                id : true,
            },
        });
        if (!relatedCategory) return null;
        return relatedCategory.id;
    })();
    const [total, paged] = await prisma.$transaction([
        prisma.product.count({
            where  : {
                visibility : 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                categories : (relatedCategoryId === undefined) ? undefined : { some: { id: relatedCategoryId ?? '--never-match--' } },
            },
        }),
        prisma.product.findMany({
            where  : {
                visibility : 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                categories : (relatedCategoryId === undefined) ? undefined : { some: { id: relatedCategoryId ?? '--never-match--' } },
            },
            select  : productPreviewSelect(customerId),
            orderBy : {
                name: 'asc', // shows the alphabetical Product for pagination_view
            },
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
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
