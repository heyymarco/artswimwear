// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

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
    type CategoryPreviewPagination,
    
    
    
    // schemas:
    PathnameSchema,
    
    CategoryPageRequestSchema,
    
    
    
    // utilities:
    createNestedConditionalCategory,
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
    
    
    
    //#region query result
    pathname.reverse(); // reverse from currentPath up to rootPath
    const nestedConditionalCategory = createNestedConditionalCategory(pathname);
    if (!nestedConditionalCategory) {
        return Response.json({
            error: `The category with specified path "${pathname.join('/')}" is not found.`,
        }, { status: 404 }); // handled with error
    }
    return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
        const categoryDetailData = (
            await prismaTransaction.category.findUnique({
                where  : nestedConditionalCategory,
                select : categoryDetailSelect(pathname),
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
    
    
    
    // await new Promise<void>((resolve, reject) => {
    //     setTimeout(() => {
    //     //     resolve();
    //         reject('Oops an error occured!');
    //     }, 1000);
    // });
    
    
    
    //#region query result
    const [total, paged, has2ndLevelCategories] = await prisma.$transaction([
        prisma.category.count({
            where  : {
                // browsable visibility:
                visibility : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                parentId   : parent,
            },
        }),
        prisma.category.findMany({
            where  : {
                // browsable visibility:
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
        
        // when querying rootCategories (parent === null), add additional `has2ndLevelCategories` prop, otherwise undefined:
        ...((parent !== null) ? [] : [prisma.category.findFirst({
            where  : {
                // browsable visibility:
                visibility    : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                parentId      : null, // select root_categories
                subcategories : {
                    some      : { // having a/some subcategories
                        // browsable visibility:
                        visibility    : 'PUBLISHED', // allows access to Category with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                    },
                },
            },
            select : {
                id : true,
            },
        })]),
    ]);
    const categoryPreviewPagination : CategoryPreviewPagination = {
        total                 : total,
        entities              : paged.map(convertCategoryPreviewDataToCategoryPreview),
        has2ndLevelCategories : !!has2ndLevelCategories,
    };
    return Response.json(categoryPreviewPagination); // handled with success
    //#endregion query result
});
