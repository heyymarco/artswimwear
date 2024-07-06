// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // types:
    MatchingShipping,
    MatchingAddress,
    
    
    
    // utilities:
    getMatchingShipping,
}                           from '@/libs/shippings'



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    // handler as GET,
    handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.post(async (req) => {
    /* required for displaying products page */
    
    
    
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    
    //#region parsing request
    const {
        city,
        state,
        country,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
           !city    || (typeof(city)    !== 'string') || (city.length    < 3) || (city.length    > 50)
        || !state   || (typeof(state)   !== 'string') || (state.length   < 3) || (state.length   > 50)
        || !country || (typeof(country) !== 'string') || (country.length < 2) || (country.length >  3)
    ) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    // TODO: auto update rajaongkir
    
    
    
    // populate:
    let allShippings = await prisma.shippingProvider.findMany({
        select : {
            // records:
            id         : true, // required for identifier
            
            
            
            // data:
            visibility : true, // required for auto_init
            
            name       : true, // required for identifier
            
            weightStep : true, // required for calculate_shipping_cost algorithm
            eta        : true, // optional for matching_shipping algorithm
            rates      : true, // required for calculate_shipping_cost algorithm
            
            useZones   : true, // required for matching_shipping algorithm
            zones      : true, // required for matching_shipping algorithm
        },
    }); // get all shippings including the disabled ones
    
    
    
    // auto_init:
    if (!allShippings.length) { // empty => first app setup => initialize the default shippings
        const defaultShippings = (await import('@/libs/defaultShippings')).default;
        await prisma.shippingProvider.createMany({
            data: defaultShippings,
        });
    } // if
    
    
    
    // filter out disabled shippings:
    const shippings = allShippings.filter(({visibility}) => (visibility !== 'DRAFT'));
    
    // filter out non_compatible shippings:
    const shippingAddress   : MatchingAddress    = { city, state, country };
    const matchingShippings : MatchingShipping[] = (
        (await prisma.$transaction(async (prismaTransaction) => {
            return await Promise.all( // await for all promises completed before closing the transaction
                shippings
                .map((shippingProvider) => getMatchingShipping(prismaTransaction, shippingProvider, shippingAddress))
            );
        }))
        .filter((shippingProvider): shippingProvider is Exclude<typeof shippingProvider, null|undefined> => !!shippingProvider)
        .map(({visibility: _visibility, ...shippingProvider}) => shippingProvider) // remove excess data
    );
    return NextResponse.json(matchingShippings); // handled with success
});
