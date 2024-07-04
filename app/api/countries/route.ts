// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import type {
    Country,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-cache';



// types:
export interface CountryPreview
    extends
        Pick<Country,
            |'name'
            |'code'
        >
{
}



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
    
    
    
    let allCountries = await prisma.country.findMany({
        select : {
            enabled : true,
            name    : true,
            
            code    : true,
        },
        // enabled: true
    });
    if (!allCountries.length) {
        const defaultCountries = (await import('@/libs/defaultCountries')).default;
        await prisma.country.createMany({
            data : defaultCountries,
        });
        allCountries = defaultCountries.map((country) => ({
            enabled : country.enabled,
            name    : country.name,
            
            code    : country.code,
        }));
    } // if
    
    
    
    const countryList : CountryPreview[] = (
        allCountries
        .filter((country) => country.enabled)
        .map((country) => ({
            name : country.name,
            code : country.code,
        }))
    );
    return Response.json(countryList); // handled with success
});
