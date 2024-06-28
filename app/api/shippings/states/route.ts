// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// others:
import {
    State,
}                           from 'country-state-city'



// configs:
export const fetchCache = 'force-cache';



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
    
    
    
    //#region parsing request
    const {
        countryCode,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (((typeof(countryCode) !== 'string') || (countryCode.length !== 2)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const states : Array<string> = (
        State.getStatesOfCountry(countryCode)
        .map(({name}) => name)
    );
    return Response.json(states); // handled with success
});
