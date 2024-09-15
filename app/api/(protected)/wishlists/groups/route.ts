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
}                           from '@/libs/types'
import {
    type WishlistGroupDetail,
    
    
    
    PaginationArgSchema,
    UpdateWishlistGroupRequestSchema,
    DeleteWishlistGroupRequestSchema,
    
    
    
    wishlistGroupDetailSelect,
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
    const [total, paged] = await prisma.$transaction([
        prisma.wishlistGroup.count({
            where  : {
                parentId : customerId, // important: the signedIn customerId
            },
        }),
        prisma.wishlistGroup.findMany({
            where  : {
                parentId : customerId, // important: the signedIn customerId
            },
            select : wishlistGroupDetailSelect,
            orderBy : {
                name: 'asc',
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationOrderDetail : Pagination<WishlistGroupDetail> = {
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
                arg : UpdateWishlistGroupRequestSchema.parse(data),
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
        const wishlistGroup : WishlistGroupDetail|Response = await prisma.$transaction(async (prismaTransaction): Promise<WishlistGroupDetail|Response> => {
            const conflictingWishlistGroup = await prismaTransaction.wishlistGroup.findFirst({
                where  : {
                    parentId : customerId, // important: the signedIn customerId
                    name     : { equals: name, mode: 'insensitive' },
                    id       : !id ? undefined : { not: id }, // when updating (has id): do not conflicting with the current record itself
                },
                select : {
                    id : true,
                },
            });
            if (conflictingWishlistGroup) {
                return Response.json({ error: `The name "${name}" already exists.` }, { status: 409 }); // handled with error
            } // if
            
            
            return (
                !id
                ? await prismaTransaction.wishlistGroup.create({
                    data   : {
                        parentId : customerId, // important: the signedIn customerId
                        name     : name,
                    },
                    select : wishlistGroupDetailSelect,
                })
                : await prismaTransaction.wishlistGroup.update({
                    where  : {
                        parentId : customerId, // important: the signedIn customerId
                        id       : id,
                    },
                    data   : {
                        name     : name,
                    },
                    select : wishlistGroupDetailSelect,
                })
            );
        });
        if (wishlistGroup instanceof Response) return wishlistGroup;
        return Response.json(wishlistGroup); // handled with success
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
                arg : DeleteWishlistGroupRequestSchema.parse(data),
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
        const wishlistGroup : WishlistGroupDetail = await prisma.wishlistGroup.delete({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                id       : id,
            },
            select : wishlistGroupDetailSelect,
        });
        return Response.json(wishlistGroup); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
