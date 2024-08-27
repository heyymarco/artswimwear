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
    type Prisma,
    type CartDetail,
    
    
    
    CartUpdateRequestSchema,
    
    
    
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
                cartDetail : CartUpdateRequestSchema.parse(data),
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
                
                
                
                const deleteShippingAddressData : Prisma.CheckoutShippingAddressWhereInput|undefined = (
                    !checkout /* do NOT delete if NOT having parent */ || ((checkout.shippingAddress !== null) /* do NOT delete if NOT null */ || !hasShippingAddress /* do NOT delete if NOTHING to delete */)
                    ? undefined
                    : {
                        // do DELETE
                        // no condition needed because one to one relation
                    }
                );
                const createShippingAddressData : Omit<Prisma.CheckoutShippingAddressCreateInput, 'parent'>|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.shippingAddress === null) /* do NOT update if null */
                    ? undefined
                    : checkout.shippingAddress
                );
                const updateShippingAddressData : Prisma.CheckoutShippingAddressUpdateInput|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.shippingAddress === null) /* do NOT update if null */
                    ? undefined
                    : checkout.shippingAddress
                );
                const upsertShippingAddressData : Prisma.CheckoutShippingAddressUpsertWithoutParentInput|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.shippingAddress === null) /* do NOT update if null */
                    ? undefined
                    : {
                        update : updateShippingAddressData!, // prefer   to `update` if already exist
                        create : createShippingAddressData!, // fallback to `create` if not     exist
                    }
                );
                
                const deleteBillingAddressData  : Prisma.CheckoutBillingAddressWhereInput|undefined = (
                    !checkout /* do NOT delete if NOT having parent */ || ((checkout.billingAddress !== null) /* do NOT delete if NOT null */ || !hasBillingAddress /* do NOT delete if NOTHING to delete */)
                    ? undefined
                    : {
                        // do DELETE
                        // no condition needed because one to one relation
                    }
                );
                const createBillingAddressData  : Omit<Prisma.CheckoutBillingAddressCreateInput, 'parent'>|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.billingAddress === null) /* do NOT update if null */
                    ? undefined
                    : checkout.billingAddress
                );
                const updateBillingAddressData  : Prisma.CheckoutBillingAddressUpdateInput|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.billingAddress === null) /* do NOT update if null */
                    ? undefined
                    : checkout.billingAddress
                );
                const upsertBillingAddressData  : Prisma.CheckoutBillingAddressUpsertWithoutParentInput|undefined = (
                    !checkout /* do NOT update if NOT having parent */ || (checkout.billingAddress === null) /* do NOT update if null */
                    ? undefined
                    : {
                        update : updateBillingAddressData!, // prefer   to `update` if already exist
                        create : createBillingAddressData!, // fallback to `create` if not     exist
                    }
                );
                
                const deleteCheckoutData        : Prisma.CheckoutWhereInput|undefined = (
                    ((checkout !== null) /* do NOT delete if NOT null */ || !hasCheckout /* do NOT delete if NOTHING to delete */)
                    ? undefined
                    : {
                        // do DELETE
                        // no condition needed because one to one relation
                    }
                );
                const createCheckoutData        : Omit<Prisma.CheckoutCreateInput, 'parent'>|undefined = (
                    ((checkout === null) || (checkout === undefined)) /* do NOT update if null|undefined */
                    ? undefined
                    : {
                        // data:
                        ...checkout,
                        shippingAddress : { // compound_like relation
                            // moved to createCheckoutData:
                            // one_conditional nested_update if create:
                            create : createShippingAddressData,
                        },
                        billingAddress  : { // compound_like relation
                            // moved to createCheckoutData:
                            // one_conditional nested_update if create:
                            create : createBillingAddressData,
                        },
                    }
                );
                const updateCheckoutData        : Prisma.CheckoutUpdateInput|undefined = (
                    ((checkout === null) || (checkout === undefined)) /* do NOT update if null|undefined */
                    ? undefined
                    : {
                        // data:
                        ...checkout,
                        shippingAddress : { // compound_like relation
                            // nested_delete if set to null:
                            delete : deleteShippingAddressData,
                            
                            // moved to createCheckoutData:
                            // one_conditional nested_update if create:
                         // create : createShippingAddressData,
                            
                            // two_conditional nested_update if update:
                            upsert : upsertShippingAddressData,
                        },
                        billingAddress  : { // compound_like relation
                            // nested_delete if set to null:
                            delete : deleteBillingAddressData,
                            
                            // moved to createCheckoutData:
                            // one_conditional nested_update if create:
                         // create : createBillingAddressData,
                            
                            // two_conditional nested_update if update:
                            upsert : upsertBillingAddressData,
                        },
                    }
                );
                const upsertCheckoutData        : Prisma.CheckoutUpsertWithoutParentInput|undefined = (
                    ((checkout === null) || (checkout === undefined)) /* do NOT update if null|undefined */
                    ? undefined
                    : {
                        update : updateCheckoutData!, // prefer   to `update` if already exist
                        create : createCheckoutData!, // fallback to `create` if not     exist
                    }
                );
                
                const createCartData            : Prisma.XOR<Prisma.CartCreateInput, Prisma.CartUncheckedCreateInput> = {
                    // data:
                    ...cartDetail,
                    checkout : (checkout === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                        // moved to createCartData:
                        // one_conditional nested_update if create:
                        create : createCheckoutData,
                    },
                    items : { // array_like relation
                        // create all item(s):
                        create : items, // the `items` is guaranteed not_empty because of the conditional `!items.length`
                    },
                    
                    
                    
                    // relations:
                    parentId : customerId,
                };
                const updateCartData            : Prisma.CartUpdateInput = {
                    // data:
                    ...cartDetail,
                    checkout : (checkout === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                        // nested_delete if set to null:
                        delete : deleteCheckoutData,
                        
                        // moved to createCartData:
                        // one_conditional nested_update if create:
                     // create : createCheckoutData,
                        
                        // two_conditional nested_update if update:
                        upsert : upsertCheckoutData,
                    },
                    items : { // array_like relation
                        // clear the existing item(s), if any:
                        deleteMany : {
                            // do DELETE ALL related item(s)
                            // no condition is needed because we want to delete all related item(s)
                        },
                        
                        // create all item(s):
                        create : items, // the `items` is guaranteed not_empty because of the conditional `!items.length`
                    },
                };
                const upsertCartData            : Prisma.CartUpsertArgs = {
                    where  : {
                        // relations:
                        parentId : customerId,
                    },
                    update : updateCartData,
                    create : createCartData,
                    select : {
                        id : true,
                    },
                };
                
                return prisma.cart.upsert(upsertCartData);
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
