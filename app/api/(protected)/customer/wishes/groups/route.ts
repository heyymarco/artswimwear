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

// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type Pagination,
    type WishGroupDetail,
    
    
    
    BooleanStringSchema,
    PaginationArgSchema,
    UpdateWishGroupRequestSchema,
    DeleteWishGroupRequestSchema,
    
    
    
    wishGroupDetailSelect,
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
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region query result
    const [total, paged, /*lastCreated, lastAdded*/] = await prisma.$transaction([
        prisma.wishGroup.count({
            where  : {
                parentId : customerId, // important: the signedIn customerId
            },
        }),
        prisma.wishGroup.findMany({
            where  : {
                parentId : customerId, // important: the signedIn customerId
            },
            select  : wishGroupDetailSelect,
            orderBy : {
                // name: 'asc', // shows the alphabetical created|moved Wish for pagination_view
                createdAt : 'desc', // shows the last_created WishGroup for pagination_create
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
        /*prisma.wishGroup.findFirst({
            where  : {
                parentId : customerId, // important: the signedIn customerId
            },
            select  : {
                id        : true,
                createdAt : true,
            },
            orderBy : {
                createdAt : 'desc', // shows the last_created WishGroup for pagination_create
            },
        }),
        prisma.wish.findFirst({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                groupId  : { not: null },
            },
            select  : {
                groupId   : true,
                updatedAt : true,
            },
            orderBy : {
                updatedAt: 'desc', // shows the most_recent created|moved Wish for pagination_select
            },
        }),*/
    ]);
    /*const lastTouchedId = ((): string|null => {
        if (!lastCreated && !lastAdded) return null;
        if (lastCreated && !lastAdded)  return lastCreated.id;
        if (!lastCreated && lastAdded)  return lastAdded.groupId;
        
        
        
        if (lastCreated && lastAdded) {
            return (
                (lastCreated.createdAt > lastAdded.updatedAt)
                ? lastCreated.id
                : lastAdded.groupId
            );
        } // if
        
        
        
        return null;
    })();*/
    const paginationOrderDetail : Pagination<WishGroupDetail> = {
        total    : total,
        entities : paged,
    };
    return Response.json(paginationOrderDetail); // handled with success
    //#endregion query result
})
.patch(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                arg : UpdateWishGroupRequestSchema.parse(data),
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
            id,
            name,
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
        const wishGroup : WishGroupDetail|Response = await prisma.$transaction(async (prismaTransaction): Promise<WishGroupDetail|Response> => {
            const conflictingWishGroup = await prismaTransaction.wishGroup.findFirst({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    name     : { equals: name, mode: 'insensitive' },
                    id       : !id ? undefined : { not: id }, // when updating (has id): do not conflicting with the current record itself
                },
                select : {
                    id : true,
                },
            });
            if (conflictingWishGroup) {
                return Response.json({ error: `The name "${name}" already exists.` }, { status: 409 }); // handled with error
            } // if
            
            
            return (
                !id
                ? await prismaTransaction.wishGroup.create({
                    data   : {
                        parentId : customerId, // important: the signedIn customerId
                        name     : name,
                    },
                    select : wishGroupDetailSelect,
                })
                : await prismaTransaction.wishGroup.update({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                        id       : id,
                    },
                    data   : {
                        name     : name,
                    },
                    select : wishGroupDetailSelect,
                })
            );
        });
        if (wishGroup instanceof Response) return wishGroup;
        return Response.json(wishGroup); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.delete(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                arg :
                    DeleteWishGroupRequestSchema.omit({ deleteBoth: true })
                    .merge(z.object({
                        deleteBoth : BooleanStringSchema.optional(),
                    })).parse(data),
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
            id,
            deleteBoth : deleteBothRaw,
        },
    } = requestData;
    const deleteBoth = (deleteBothRaw === 'true');
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const wishGroup : WishGroupDetail = await prisma.$transaction(async (prismaTransaction): Promise<WishGroupDetail> => {
            if (!deleteBoth) {
                // disconnects all related records before deleting to avoid "cascade" delete
                await prismaTransaction.wishGroup.update({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                        id       : id,
                    },
                    data   : {
                        items : {
                            set: [], // disconnects all related records in a one-to-many relation
                        },
                    },
                });
            } // if
            
            
            
            const wishGroup : WishGroupDetail = await prismaTransaction.wishGroup.delete({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    id       : id,
                },
                select : wishGroupDetailSelect,
            });
            return wishGroup;
        });
        return Response.json(wishGroup); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
