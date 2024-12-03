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
    PaymentMethodSortRequestSchema,
    type PaymentMethodSortDetail,
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
                arg : PaymentMethodSortRequestSchema.parse(data),
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
            ids,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const customerId = session.user?.id;
    if (!customerId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    //#region save the data to database
    const paymentMethodSortDetail = await prisma.$transaction(async (prismaTransaction): Promise<PaymentMethodSortDetail> => {
        const validData = await prismaTransaction.paymentMethod.findMany({
            where  : {
                parentId : customerId, // important: the signedIn customerId
                id       : { in: ids },
            },
            select : {
                id   : true,
                sort : true,
            },
            orderBy : {
                sort: 'desc',
            },
        });
        const baseSortIndex = validData.at(-1)?.sort ?? 0;
        
        
        
        const sortIndices   = new Map<string, number>(
            ids
            .map((id, indexAsc, array) =>
                [
                    id,                            // the id
                    (array.length - indexAsc - 1), // descending index
                ]
            )
        );
        const sortedData = (
            validData
            .map(({id}) => ({
                id,
                sort : sortIndices.get(id) ?? 0, // re-sort based on the order of `ids`
            }))
            .sort(({sort: sortA}, {sort: sortB}) => (sortB - sortA)) // sort descending
        );
        const rebasedSortedData = (
            sortedData
            .map(({id}, indexAsc, array) => ({
                id,                                                   // the id
                sort : (array.length - indexAsc - 1) + baseSortIndex, // descending index
            }))
        );
        
        
        
        // apply changes:
        const newSortedData = await Promise.all(
            rebasedSortedData
            .map(({id, sort}) =>
                prismaTransaction.paymentMethod.update({
                    where : {
                        parentId : customerId, // important: the signedIn customerId
                        id       : id,
                    },
                    data : {
                        sort : sort,
                    },
                    select : {
                        id : true,
                    },
                })
            )
        );
        
        
        
        return {
            ids : newSortedData.map(({id}) => id),
        } satisfies PaymentMethodSortDetail;
    });
    //#endregion save the data to database
    
    
    
    return Response.json(paymentMethodSortDetail); // handled with success
});
