// next-js:
import {
    type NextRequest,
}                           from 'next/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store'; // always in sync with server



// utilities:
const currencyExchange = {
    expires : new Date(),
    rates   : new Map<string, number>(),
};



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
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    if (currencyExchange.expires <= new Date()) {
        const rates = currencyExchange.rates;
        rates.clear();
        
        
        
        // fetch https://www.exchangerate-api.com :
        const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATEAPI_KEY}/latest/${checkoutConfigShared.intl.defaultCurrency}`, {
            // cache : 'force-cache', // "cache: force-cache" and "revalidate: 86400", only one should be specified
            next  : {
                revalidate : 3 * 3600, // set the cache lifetime of a resource (in seconds).
            },
        });
        if (exchangeRateResponse.status !== 200) throw Error('api error');
        const data = await exchangeRateResponse.json();
        const apiRates = data?.conversion_rates;
        if (typeof(apiRates) !== 'object') throw Error('api error');
        for (const currency in apiRates) {
            rates.set(currency, apiRates[currency]);
        } // for
        
        
        
        currencyExchange.expires = new Date(Date.now() + (3 * 3600 * 1000));
    } // if
    
    
    
    return Response.json(Object.fromEntries(currencyExchange.rates)); // handled with success
});
