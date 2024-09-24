// next-js:
import {
    NextRequest,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    type Pagination,
    type ProductPreview,
    type WishGroupDetail,
    type WishDetail,
    
    
    
    PaginationArgSchema,
    GetWishPageRequestSchema,
    CreateOrUpdateWishRequestSchema,
    DeleteWishRequestSchema,
    
    
    
    productPreviewSelect,
    convertProductPreviewDataToProductPreview,
    wishDetailSelect,
}                           from '@/models'
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// configs:
export const fetchCache = 'force-no-store';



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
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
                groupId       : GetWishPageRequestSchema.partial().parse(data)?.groupId,
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
        groupId,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region query result
    const [total, paged, wishGroup] = await prisma.$transaction([
        prisma.wish.count({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                groupId  : groupId,    // string => get grouped wishes, undefined => get all wishes
                
                product  : {
                    visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                },
            },
        }),
        prisma.wish.findMany({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                groupId  : groupId,    // string => get grouped wishes, undefined => get all wishes
                
                product  : {
                    visibility: 'PUBLISHED', // allows access to Product with visibility: 'PUBLISHED' but NOT 'HIDDEN'|'DRAFT'
                },
            },
            select  : {
                product : {
                    select : productPreviewSelect(customerId),
                },
            },
            orderBy : {
                updatedAt: 'desc', // shows the most_recent created|moved Wish for pagination_view
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
        prisma.wishGroup.findFirst({
            where : {
                id : groupId ?? '--never-match--',
            },
            select : {
                id   : true,
                name : true,
            },
        }),
    ]);
    const paginationOrderDetail : Pagination<ProductPreview> & { wishGroup : WishGroupDetail|null } = {
        total     : total,
        entities  : paged.map(({ product }) => convertProductPreviewDataToProductPreview(product)),
        wishGroup : wishGroup,
    };
    return Response.json(paginationOrderDetail); // handled with success
    //#endregion query result
})
.patch(async (req) => {
    // await new Promise<void>((resolve) => {
    //     setTimeout(resolve, 1000);
    // });
    
    
    
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                arg : CreateOrUpdateWishRequestSchema.parse(data),
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
        arg: {
            productId,
            groupId,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const wish : WishDetail = await prisma.$transaction(async (prismaTransaction): Promise<WishDetail> => {
            const existingWish = await prismaTransaction.wish.findFirst({
                where  : {
                    parentId  : customerId, // important: the signedIn customerId
                    productId : productId,  // important: the productId to wish
                },
                select : {
                    id : true,
                },
            });
            
            
            
            if (!existingWish) {
                return await prismaTransaction.wish.create({
                    data   : {
                        parentId  : customerId, // important: the signedIn customerId
                        productId : productId,  // important: the productId to wish
                        
                        groupId   : groupId,    // update the group of wish
                    },
                    select : wishDetailSelect,
                });
            }
            else {
                return await prismaTransaction.wish.update({
                    where  : {
                        id : existingWish.id,
                    },
                    data   : {
                        groupId   : groupId,    // update the group of wish
                    },
                    select : wishDetailSelect,
                });
            } // if
        });
        const mutatedProductId = wish.productId;
        return Response.json(mutatedProductId); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.delete(async (req) => {
    // await new Promise<void>((resolve) => {
    //     setTimeout(resolve, 1000);
    // });
    
    
    
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                productId : DeleteWishRequestSchema.parse(data).productId,
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
        productId,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        await prisma.wish.deleteMany({
            where  : {
                parentId  : customerId, // important: the signedIn customerId
                productId : productId,  // important: the productId to wish
            },
        });
        return Response.json(productId); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
