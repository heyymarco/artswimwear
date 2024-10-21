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
    type CategoryPreview,
    type CategoryDetail,
    
    
    
    // schemas:
    ModelIdSchema,
    SlugSchema,
    PaginationArgSchema,
    
    CategoryPageRequestSchema,
    
    
    
    // utilities:
    categoryPreviewSelect,
    convertCategoryPreviewDataToCategoryPreview,
    categoryDetailSelect,
    convertCategoryDetailDataToCategoryDetail,
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
        const categoryPreviewData = (
            await prisma.category.findUnique({
                where  : {
                    id         : id, // find by id
                    visibility : { not: 'DRAFT' }, // allows access to Category with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : categoryPreviewSelect,
            })
        );
        
        if (!categoryPreviewData) {
            return Response.json({
                error: `The category with specified id "${id}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return Response.json(convertCategoryPreviewDataToCategoryPreview(categoryPreviewData) satisfies CategoryPreview); // handled with success
    }
    else if (path) {
        const categoryDetailData = (
            await prisma.category.findUnique({
                where  : {
                    path       : path, // find by url path
                    visibility : { not: 'DRAFT' }, // allows access to Category with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
                },
                select : categoryDetailSelect(customerId),
            })
        );
        
        if (!categoryDetailData) {
            return Response.json({
                error: `The category with specified path "${path}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return Response.json(convertCategoryDetailDataToCategoryDetail(categoryDetailData) satisfies CategoryDetail|null); // handled with success
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
                categoryPageRequest : CategoryPageRequestSchema.parse(data),
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
        categoryPageRequest : {
            page,
            perPage,
            parent,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region query result
    const [total, paged] = await prisma.$transaction([
        prisma.category.count({
            where  : {
                visibility : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                parentId   : parent,
            },
        }),
        prisma.category.findMany({
            where  : {
                visibility : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                parentId   : parent,
            },
            select  : categoryPreviewSelect,
            orderBy : {
                name: 'asc', // shows the alphabetical Category for pagination_view
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationOrderDetail : Pagination<CategoryPreview> = {
        total    : total,
        entities : paged.map(convertCategoryPreviewDataToCategoryPreview),
    };
    return Response.json(paginationOrderDetail); // handled with success
    //#endregion query result
});
