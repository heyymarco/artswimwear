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
    type Prisma,
    
    type Pagination,
    type CategoryPreview,
    type CategoryDetail,
    
    
    
    // schemas:
    PathnameSchema,
    
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
                pathname : PathnameSchema.parse(data?.pathname),
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
        pathname,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session?.user?.id ?? undefined; // optional loggedIn (allows for public access too)
    //#endregion validating privileges
    
    
    
    //#region query result
    const createNestedConditional = (pathname: string[]): Prisma.CategoryWhereUniqueInput|undefined => {
        // conditions:
        if (!pathname.length) return undefined;
        
        
        
        // build:
        const [currentPathname, ...restPathname] = pathname;
        return {
            path       : currentPathname,
            visibility : { not: 'DRAFT' }, // allows access to Category with visibility: 'PUBLISHED'|'HIDDEN' but NOT 'DRAFT'
            
            parent     : (restPathname.length === 0) ? null /* null: no more parent */ : createNestedConditional(restPathname), // recursive
        };
    };
    pathname.reverse(); // reverse from currentPath up to rootPath
    const nestedConditional = createNestedConditional(pathname);
    if (!nestedConditional) {
        return Response.json({
            error: `The category with specified path "${pathname.join('/')}" is not found.`,
        }, { status: 404 }); // handled with error
    }
    return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
        const categoryDetailData = (
            await prismaTransaction.category.findUnique({
                where  : nestedConditional,
                select : categoryDetailSelect(pathname, customerId),
            })
        );
        
        if (!categoryDetailData) {
            return Response.json({
                error: `The category with specified path "${pathname.join('/')}" is not found.`,
            }, { status: 404 }); // handled with error
        } // if
        
        return Response.json((await convertCategoryDetailDataToCategoryDetail(categoryDetailData, prismaTransaction)) satisfies CategoryDetail|null); // handled with success
    });
    //#endregion query result
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
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
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
