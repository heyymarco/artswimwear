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
    PaginationArgSchema,
    
    type PublicOrderDetail,
    publicOrderDetailSelect,
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
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



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
    if (!customerId) {
        return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    } // if
    //#endregion validating privileges
    
    
    
    //#region query result
    try {
        const [total, paged] = await prisma.$transaction([
            prisma.order.count({
                where  : {
                    customerId : customerId,
                },
            }),
            prisma.order.findMany({
                where  : {
                    customerId : customerId,
                },
                select : publicOrderDetailSelect,
                orderBy : {
                    createdAt: 'desc',
                },
                skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
                take    : perPage,
            }),
        ]);
        const paginationOrderDetail : Pagination<PublicOrderDetail> = {
            total    : total,
            entities : paged.map(({orderId, currency, ...page}) => ({
                ...page,
                id       : orderId,
                currency : currency?.currency ?? checkoutConfigServer.payment.defaultCurrency,
            })) satisfies PublicOrderDetail[],
        };
        return Response.json(paginationOrderDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return Response.json({ error: 'unexpected error' }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
});
