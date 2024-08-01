// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'

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
import {
    updateShippingProviders,
}                           from '@/libs/shipping-processors/rajaongkir'



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
    // handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
}

router
.get(async (req) => {
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
        country,
        state,
        city,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
           !country || (typeof(country) !== 'string') || (country.length < 2) || (country.length >  3)
        || !state   || (typeof(state)   !== 'string') || (state.length   < 3) || (state.length   > 50)
        || !city    || (typeof(city)    !== 'string') || (city.length    < 3) || (city.length    > 50)
    ) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    // auto update rajaongkir:
    if (process.env.RAJAONGKIR_SECRET) {
        try {
            await prisma.$transaction(async (prismaTransaction) => {
                const origin = await prismaTransaction.defaultShippingOrigin.findFirst({
                    select : defaultShippingOriginSelect,
                });
                if (origin) {
                    await updateShippingProviders(prismaTransaction, origin, {
                        country,
                        state,
                        city,
                    });
                } // if
            }, { timeout: 10000 }); // give a longer timeout for `updateShippingProviders()`
        }
        catch (error: unknown) {
            console.log('autoUpdate shipping error: ', error);
            // ignore any error
        } // try
    } // if
    
    
    
    // populate:
    let allShippings = await prisma.shippingProvider.findMany({
        select : {
            // records:
            id         : true, // required for identifier
            
            
            
            // data:
            visibility : true, // required for auto_init
            
            name       : true, // required for identifier
            
            weightStep : true, // required for calculate_shipping_cost algorithm
            eta        : {     // optional for matching_shipping algorithm
                select : {
                    // data:
                    min : true,
                    max : true,
                },
            },
            rates      : {     // required for calculate_shipping_cost algorithm
                select : {
                    // data:
                    start : true,
                    rate  : true,
                },
            },
            
            useZones   : true, // required for matching_shipping algorithm
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
    const shippingAddress   : MatchingAddress    = {
        country,
        state,
        city,
    };
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
