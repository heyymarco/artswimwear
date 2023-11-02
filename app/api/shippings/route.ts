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
import type {
    ShippingProvider,
}                           from '@prisma/client'

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



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            |'id'
            |'name'
        >
{
}



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
        zone,
        country,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
           !city    || (typeof(city)    !== 'string') || (city.length    < 3) || (city.length    > 50)
        || !zone    || (typeof(zone)    !== 'string') || (zone.length    < 3) || (zone.length    > 50)
        || !country || (typeof(country) !== 'string') || (country.length < 2) || (country.length >  3)
    ) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    let allShippings = await prisma.shippingProvider.findMany({
        select : {
            id              : true, // required for identifier
            
            enabled         : true, // required for check conditional
            name            : true, // required for labeling
            
            weightStep      : true, // required for getMatchingShipping
            
            estimate        : true, // optional for labeling
            shippingRates   : true, // required for getMatchingShipping
            
            useSpecificArea : true, // required for getMatchingShipping
            countries       : true, // required for getMatchingShipping
        },
    }); // get all shippings including the disabled ones
    if (!allShippings.length) { // empty => first app setup => initialize the default shippings
        const defaultShippings = (await import('@/libs/defaultShippings')).default;
        await prisma.shippingProvider.createMany({
            data: defaultShippings,
        });
        // allShippings = defaultShippings.map((shipping) => ({
        //     id              : shipping.id,
        //     
        //     enabled         : shipping.enabled,
        //     name            : shipping.name,
        //     
        //     weightStep      : shipping.weightStep,
        //     
        //     estimate        : shipping.estimate,
        //     shippingRates   : shipping.shippingRates,
        //     
        //     useSpecificArea : shipping.useSpecificArea,
        //     countries       : shipping.countries,
        // }));
    } // if
    
    
    
    // filter out disabled shippings:
    const shippings = allShippings.filter(({enabled}) => enabled);
    
    // filter out non_compatible shippings:
    const shippingAddress: MatchingAddress = { city, zone, country };
    const matchingShippings = (
        shippings
        .map((shipping) => getMatchingShipping(shipping, shippingAddress))
        .filter((shipping): shipping is MatchingShipping => !!shipping)
    );
    return NextResponse.json(matchingShippings); // handled with success
});
