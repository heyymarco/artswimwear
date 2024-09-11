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
    type WishlistGroupDetail,
    
    
    
    CreateWishlistGroupRequestSchema,
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
.get(async (req) => {
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region query result
    const wishlistGroups : WishlistGroupDetail[] = await prisma.wishlistGroup.findMany({
        where  : {
            parentId : customerId, // important: the signedIn customerId
        },
        select : wishlistGroupDetailSelect,
    });
    return Response.json(wishlistGroups); // handled with success
    //#endregion query result
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                arg : CreateWishlistGroupRequestSchema.parse(data),
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
                },
                select : {
                    id : true,
                },
            });
            if (conflictingWishlistGroup) {
                return Response.json({ error: `The name "${name}" already exists.` }, { status: 409 }); // handled with error
            } // if
            
            
            
            return await prismaTransaction.wishlistGroup.create({
                data   : {
                    parentId : customerId, // important: the signedIn customerId
                    name     : name,
                },
                select : wishlistGroupDetailSelect,
            });
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
                    id       : { not: id },
                },
                select : {
                    id : true,
                },
            });
            if (conflictingWishlistGroup) {
                return Response.json({ error: `The name "${name}" already exists.` }, { status: 409 }); // handled with error
            } // if
            
            
            
            return await prismaTransaction.wishlistGroup.update({
                where  : {
                    id : id,
                },
                data   : {
                    parentId : customerId, // important: the signedIn customerId
                    name     : name,
                },
                select : wishlistGroupDetailSelect,
            });
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
        if (wishlistGroup instanceof Response) return wishlistGroup;
        return Response.json(wishlistGroup); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
