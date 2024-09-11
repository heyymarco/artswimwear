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
    type WishlistDetail,
    
    
    
    GetWishlistRequestSchema,
    CreateOrUpdateWishlistRequestSchema,
    DeleteWishlistRequestSchema,
    
    
    
    wishlistDetailSelect,
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
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                arg : GetWishlistRequestSchema.parse(data),
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
        arg : {
            groupId,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region query result
    const wishlists : WishlistDetail[] = await prisma.wishlist.findMany({
        where  : {
            parentId : customerId, // important: the signedIn customerId
            groupId  : groupId,    // null => get ungrouped wishlists, string => get grouped wishlists
        },
        select : wishlistDetailSelect,
    });
    const productIds = wishlists.map(({ productId }) => productId);
    return Response.json(productIds); // handled with success
    //#endregion query result
})
.patch(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                arg : CreateOrUpdateWishlistRequestSchema.parse(data),
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
        const wishlist : WishlistDetail = await prisma.$transaction(async (prismaTransaction): Promise<WishlistDetail> => {
            const existingWishlist = await prismaTransaction.wishlist.findFirst({
                where  : {
                    parentId  : customerId, // important: the signedIn customerId
                    productId : productId,  // important: the productId to wish
                },
                select : {
                    id : true,
                },
            });
            
            
            
            if (!existingWishlist) {
                return await prismaTransaction.wishlist.create({
                    data   : {
                        parentId  : customerId, // important: the signedIn customerId
                        productId : productId,  // important: the productId to wish
                        
                        groupId   : groupId,    // update the group of wishlist
                    },
                    select : wishlistDetailSelect,
                });
            }
            else {
                return await prismaTransaction.wishlist.update({
                    where  : {
                        id : existingWishlist.id,
                    },
                    data   : {
                        groupId   : groupId,    // update the group of wishlist
                    },
                    select : wishlistDetailSelect,
                });
            } // if
        });
        const mutatedProductId = wishlist.productId;
        return Response.json(mutatedProductId); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
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
                arg : DeleteWishlistRequestSchema.parse(data),
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
        arg : {
            productId,
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
        await prisma.wishlist.deleteMany({
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
