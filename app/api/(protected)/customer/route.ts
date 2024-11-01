// next-js:
import {
    type NextRequest,
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
    type CustomerDetail,
    
    
    
    customerDetailselect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// configs:
export const dynamic    = 'force-dynamic';
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
.patch(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    // return Response.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return Response.json({ message: 'server error' }, { status: 500 }); // handled with error
    
    //#region parsing request
    const {
        name,
        email,
        password,
        image,
        
        username,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        ((name !== undefined) && ((typeof(name) !== 'string') || (name.length < 1)))
        ||
        ((email !== undefined) && ((typeof(email) !== 'string') || (email.length < 5)))
        ||
        ((password !== undefined) && ((typeof(password) !== 'string') || (password.length < 1)))
        ||
        ((image !== undefined) && (image !== null) && ((typeof(image) !== 'string') || (image.length < 1)))
        ||
        ((username !== undefined) && (username !== null) && ((typeof(username) !== 'string') || (username.length < 1)))
        
        // TODO: validating data type & constraints
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const data = {
            name,
            email,
            // password : TODO: hashed password,
            image,
        };
        const {credentials, ...restCustomer} = await prisma.customer.update({
            where  : {
                id : customerId,
            },
            data   : {
                ...data,
                credentials : (username !== undefined) ? {
                    upsert : {
                        update : {
                            username,
                        },
                        create : {
                            username,
                        },
                    },
                } : undefined,
            },
            select : customerDetailselect,
        });
        const customerDetail : CustomerDetail = {
            ...restCustomer,
            username : credentials?.username ?? null,
        };
        return Response.json(customerDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
