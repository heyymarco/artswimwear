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
    type CartDetail,
    
    
    
    CartDetailSchema,
    
    
    
    cartDetailSelect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';



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
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region query result
    try {
        const cartDetail = await prisma.cart.findFirst({
            where  : {
                parentId : customerId,
            },
            select : cartDetailSelect,
        }) as CartDetail|null;
        
        
        
        return Response.json(cartDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'unexpected error' }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
})
.patch(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                cartDetail : CartDetailSchema.parse(data),
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
        cartDetail : {
            items,
            checkout,
            ...cartDetail
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        await (
            !items.length
            ? prisma.cart.deleteMany({
                where  : {
                    // relations:
                    parentId : customerId, // unique, guarantees only delete one or zero
                },
            })
            : prisma.$transaction(async (prismaTransaction) => {
                const oldData = await prismaTransaction.cart.findUnique({
                    where  : {
                        // relations:
                        parentId : customerId,
                    },
                    select : {
                        checkout : {
                            select : {
                                id              : true,
                                shippingAddress : {
                                    select : {
                                        id : true,
                                    },
                                },
                                billingAddress  : {
                                    select : {
                                        id : true,
                                    },
                                },
                            },
                        },
                    },
                });
                const hasCheckout        = oldData?.checkout?.id                  !== undefined;
                const hasShippingAddress = oldData?.checkout?.shippingAddress?.id !== undefined;
                const hasBillingAddress  = oldData?.checkout?.billingAddress?.id  !== undefined;
                
                
                
                return prisma.cart.upsert({
                    where  : {
                        // relations:
                        parentId : customerId,
                    },
                    update : {
                        // data:
                        ...cartDetail,
                        checkout : { // compound_like relation
                            // nested_delete if set to null:
                            delete : ((checkout !== null) /* do NOT delete if NOT null */ || !hasCheckout /* do NOT delete if NOTHING to delete */) ? undefined : {
                                // do DELETE
                                // no condition needed because one to one relation
                            },
                            
                            // two_conditional nested_update:
                            upsert : ((checkout === null) /* do NOT update if null */) ? undefined : {
                                update : { // prefer   to `update` if already exist
                                    ...checkout,
                                    shippingAddress : { // compound_like relation
                                        // nested_delete if set to null:
                                        delete : ((checkout.shippingAddress !== null) /* do NOT delete if NOT null */ || !hasShippingAddress /* do NOT delete if NOTHING to delete */) ? undefined : {
                                            // do DELETE
                                            // no condition needed because one to one relation
                                        },
                                        
                                        // two_conditional nested_update:
                                        upsert : ((checkout.shippingAddress === null) /* do NOT update if null */) ? undefined : {
                                            update : checkout.shippingAddress, // prefer   to `update` if already exist
                                            create : checkout.shippingAddress, // fallback to `create` if not     exist
                                        },
                                    },
                                    billingAddress  : { // compound_like relation
                                        // nested_delete if set to null:
                                        delete : ((checkout.billingAddress !== null) /* do NOT delete if NOT null */ || !hasBillingAddress /* do NOT delete if NOTHING to delete */) ? undefined : {
                                            // do DELETE
                                            // no condition needed because one to one relation
                                        },
                                        
                                        // two_conditional nested_update:
                                        upsert : ((checkout.billingAddress === null) /* do NOT update if null */) ? undefined : {
                                            update : checkout.billingAddress, // prefer   to `update` if already exist
                                            create : checkout.billingAddress, // fallback to `create` if not     exist
                                        },
                                    },
                                },
                                create : { // fallback to `create` if not     exist
                                    ...checkout,
                                    shippingAddress : (checkout.shippingAddress === null) ? undefined : { // compound_like relation
                                        // one_conditional nested_update:
                                        create : checkout.shippingAddress,
                                    },
                                    billingAddress  : (checkout.billingAddress  === null) ? undefined : { // compound_like relation
                                        // one_conditional nested_update:
                                        create : checkout.billingAddress,
                                    },
                                },
                            },
                        },
                        items : { // array_like relation
                            // clear the existing item(s), if any:
                            deleteMany : {},
                            
                            // create all item(s):
                            create : items, // the `items` is guaranteed not_empty because of the conditional `!items.length`
                        },
                    },
                    create : {
                        // data:
                        ...cartDetail,
                        checkout : (checkout === null) ? undefined : { // compound_like relation
                            create : {
                                ...checkout,
                                shippingAddress : (checkout.shippingAddress === null) ? undefined : { // compound_like relation
                                    // one_conditional nested_update:
                                    create : checkout.shippingAddress,
                                },
                                billingAddress  : (checkout.billingAddress  === null) ? undefined : { // compound_like relation
                                    // one_conditional nested_update:
                                    create : checkout.billingAddress,
                                },
                            },
                        },
                        items : { // array_like relation
                            // one_conditional nested_update:
                            create : items, // the `items` is guaranteed not_empty because of the conditional `!items.length`
                        },
                        
                        
                        
                        // relations:
                        parentId : customerId,
                    },
                })
            })
        );
        return Response.json({ ok: 'updated' }); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'unexpected error' }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
