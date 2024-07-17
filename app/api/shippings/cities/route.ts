// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// others:
import {
    State,
    City,
}                           from 'country-state-city'



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
    
    
    
    //#region parsing request
    const {
        countryCode,
        state,
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
    if (
        (((typeof(state) !== 'string') || (state.length < 1) || (state.length > 20)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const stateLowercase = state.trim().toLowerCase();
    const validStates    = State.getStatesOfCountry(countryCode);
    const stateCode = (
        validStates.find(({isoCode}) => (isoCode.toLowerCase() === stateLowercase))?.isoCode // normalize stateCode => uppercased stateCode
        ??
        validStates.find(({name   }) => (name.toLowerCase()    === stateLowercase))?.isoCode // convert   stateName => uppercased stateCode
        ??
        state
    );
    const cities : Array<string> = (
        City.getCitiesOfState(countryCode, stateCode)
        .map(({name}) => name)
    );
    return Response.json(cities); // handled with success
});
