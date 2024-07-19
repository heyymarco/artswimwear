// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-cache';
export const revalidate = 1 * 24 * 3600;



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
.get(async (req) => {
    /* required for displaying states in a specified country */
    
    
    
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
    
    
    
    const countryList : string[] = (
        allCountries
        .filter((country) => country.enabled)
        .map((country) => country.name)
    );
    return Response.json(countryList); // handled with success
});
